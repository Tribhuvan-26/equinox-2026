import "server-only";
import { randomUUID } from "node:crypto";
import { ApiError } from "@/lib/api";
import { supabaseAdmin, PAYMENT_PROOFS_BUCKET } from "@/lib/supabase/admin";
import { newAccessToken } from "@/lib/teams/access";
import type { RegistrationTeamRow } from "@/lib/teams/types";
import { validateTeamName } from "@/lib/teams/validation";
import { MAX_TEAM_SIZE, REGISTRATION_FEE } from "./constants";
import type { Participant } from "./types";
import { participantForStorage, isParticipantValid } from "./validation";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "application/pdf"]);

export type ParsedRegistrationForm = {
  registrationType: "team" | "individual";
  teamName: string | null;
  participants: Participant[];
  utrNumber: string;
  paymentScreenshot: File;
  utrProof: File | null;
  form: FormData;
};

function startsWith(bytes: Uint8Array, signature: number[], offset = 0): boolean {
  return signature.every((byte, i) => bytes[offset + i] === byte);
}

/** Real format from the first bytes, or null if it isn't one we accept. */
function sniffType(head: Uint8Array): string | null {
  if (startsWith(head, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  if (startsWith(head, [0xff, 0xd8, 0xff])) return "image/jpeg";
  if (startsWith(head, [0x25, 0x50, 0x44, 0x46])) return "application/pdf";
  // "RIFF" .... "WEBP"
  if (startsWith(head, [0x52, 0x49, 0x46, 0x46]) && startsWith(head, [0x57, 0x45, 0x42, 0x50], 8)) return "image/webp";
  return null;
}

/**
 * The declared Content-Type is just the file extension (payment apps often save
 * a PNG as ".jpeg"), so trust the bytes instead and re-label the file with the
 * real type. Null when too big or not an accepted format.
 */
async function normalizeFile(file: File): Promise<File | null> {
  if (file.size === 0 || file.size > MAX_FILE_BYTES) return null;
  const type = sniffType(new Uint8Array(await file.slice(0, 12).arrayBuffer()));
  if (!type || !ALLOWED_TYPES.has(type)) return null;
  return type === file.type ? file : new File([file], file.name, { type });
}

/** Read + validate the registration form for either team or individual registration. */
export async function readRegistrationForm(request: Request): Promise<ParsedRegistrationForm> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    throw new ApiError(400, "Invalid form submission.");
  }

  const rawType = form.get("registrationType");
  const rawTeamName = form.get("teamName");
  const teamName = typeof rawTeamName === "string" && rawTeamName.trim() ? rawTeamName.trim() : null;
  const registrationType: "team" | "individual" = rawType === "team" || Boolean(teamName) ? "team" : "individual";

  if (registrationType === "team") {
    if (!teamName) {
      throw new ApiError(400, "Team name is required.", "teamName");
    }
    const nameError = validateTeamName(teamName);
    if (nameError) {
      throw new ApiError(400, nameError, "teamName");
    }
  }

  const rawParticipants = form.get("participants");
  if (typeof rawParticipants !== "string") throw new ApiError(400, "Missing participant details.");
  let participants: Participant[] = [];
  try {
    const parsed = JSON.parse(rawParticipants);
    if (Array.isArray(parsed)) participants = parsed;
  } catch {
    throw new ApiError(400, "Malformed participants details.");
  }

  if (registrationType === "individual" && participants.length > 1) {
    participants = [participants[0]];
  }

  if (participants.length === 0) {
    throw new ApiError(400, "At least one participant is required.");
  }
  if (participants.length > MAX_TEAM_SIZE) {
    throw new ApiError(400, `A maximum of ${MAX_TEAM_SIZE} participants can be registered in one transaction.`);
  }

  for (let i = 0; i < participants.length; i++) {
    const p = participants[i];
    if (!p || typeof p !== "object" || !isParticipantValid(p)) {
      throw new ApiError(400, `Details for participant ${i + 1} are invalid.`);
    }
  }

  // Ensure each participant within this submission has a unique email
  const emailSet = new Set<string>();
  for (let i = 0; i < participants.length; i++) {
    const email = participants[i].email.trim().toLowerCase();
    if (emailSet.has(email)) {
      throw new ApiError(400, `Duplicate email detected: ${email}. Each participant must have a distinct email address.`, "email");
    }
    emailSet.add(email);
  }

  const utrNumber = String(form.get("utrNumber") ?? "").trim();
  if (utrNumber.length < 6) throw new ApiError(400, "Enter a valid UTR / transaction number.", "utrNumber");

  const rawScreenshot = form.get("paymentScreenshot");
  if (!(rawScreenshot instanceof File) || rawScreenshot.size === 0) {
    throw new ApiError(400, "Upload the payment screenshot.", "paymentScreenshot");
  }
  const paymentScreenshot = await normalizeFile(rawScreenshot);
  if (!paymentScreenshot) {
    throw new ApiError(400, "Payment screenshot must be a PNG/JPG/WEBP/PDF under 5MB.", "paymentScreenshot");
  }

  const proof = form.get("utrProof");
  let utrProof: File | null = null;
  if (proof instanceof File && proof.size > 0) {
    utrProof = await normalizeFile(proof);
    if (!utrProof) throw new ApiError(400, "UTR proof must be a PNG/JPG/WEBP/PDF under 5MB.");
  }

  return {
    registrationType,
    teamName,
    participants,
    utrNumber,
    paymentScreenshot,
    utrProof,
    form,
  };
}

/** Check which emails from the list are already on a live registration. */
export async function emailsAlreadyRegistered(emails: string[]): Promise<string[]> {
  if (emails.length === 0) return [];
  const normalized = emails.map((e) => e.trim().toLowerCase());
  const { data, error } = await supabaseAdmin()
    .from("pass_registrations")
    .select("member_email, participants")
    .neq("status", "rejected");
  if (error) throw error;

  const registeredEmails = new Set<string>();
  for (const row of data ?? []) {
    if (row.member_email) {
      registeredEmails.add(row.member_email.toLowerCase());
    }
    if (Array.isArray(row.participants)) {
      for (const p of row.participants) {
        if (p?.email) registeredEmails.add(String(p.email).trim().toLowerCase());
      }
    }
  }

  return normalized.filter((e) => registeredEmails.has(e));
}

export const EMAIL_IN_TEAM_MESSAGE =
  "This email is already registered. Open your registration link to manage it, or use a different email.";

export const UTR_REUSED_MESSAGE =
  "This UTR / transaction number is already on another registration. Check the number on your payment receipt.";

const TEAM_FULL_MESSAGE = "This team is full.";

function extensionFor(mime: string): string {
  switch (mime) {
    case "image/png":
      return ".png";
    case "image/jpeg":
      return ".jpg";
    case "image/webp":
      return ".webp";
    case "application/pdf":
      return ".pdf";
    default:
      return "";
  }
}

async function uploadFile(file: File, path: string): Promise<string> {
  const fullPath = `${path}${extensionFor(file.type)}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await supabaseAdmin()
    .storage.from(PAYMENT_PROOFS_BUCKET)
    .upload(fullPath, bytes, { contentType: file.type, upsert: true });
  if (error) throw error;
  return fullPath;
}

/** Files are uploaded before the row exists; drop them if the row never lands. */
async function removeUploads(paths: string[]): Promise<void> {
  if (paths.length === 0) return;
  const { error } = await supabaseAdmin().storage.from(PAYMENT_PROOFS_BUCKET).remove(paths);
  if (error) console.error("[team-registration] could not clean up uploads", error);
}

function confirmationNumber(): string {
  return `CNF-${randomUUID().replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}

export type InsertedRegistration = {
  id: string;
  confirmationNumber: string;
  /** The raw secret token. Shown once and emailed; never stored. */
  accessToken: string;
  team?: {
    id: string;
    name: string;
    code: string;
  } | null;
  members?: {
    email: string;
    name: string;
    accessToken: string;
    confirmationNumber: string;
    role: "leader" | "member";
  }[];
};

/**
 * Save one person's individual registration (Option B).
 *
 * `teamId` is null when they have only paid and not picked a team yet; they
 * attach to one afterwards.
 */
export async function insertTeamRegistration(opts: {
  parsed: ParsedRegistrationForm;
  teamId: string | null;
  role: "leader" | "member" | null;
}): Promise<InsertedRegistration> {
  const { parsed, teamId, role } = opts;
  const supabase = supabaseAdmin();
  const id = randomUUID();

  let screenshotPath: string;
  let proofPath: string | null = null;
  try {
    screenshotPath = await uploadFile(parsed.paymentScreenshot, `${id}/payment-screenshot`);
    if (parsed.utrProof) proofPath = await uploadFile(parsed.utrProof, `${id}/utr-proof`);
  } catch (err) {
    console.error("[team-registration] upload failed", err);
    throw new ApiError(500, "Could not upload your files. Please try again.");
  }

  const p = parsed.participants[0];
  const { token, hash } = newAccessToken();
  const uploaded = proofPath ? [screenshotPath, proofPath] : [screenshotPath];

  try {
    let number = confirmationNumber();
    for (let attempt = 0; attempt < 2; attempt++) {
      const { error } = await supabase
        .from("pass_registrations")
        .insert({
          id,
          participants: [participantForStorage(p)],
          participant_count: 1,
          total_amount: REGISTRATION_FEE,
          payment_screenshot_path: screenshotPath,
          utr_number: parsed.utrNumber,
          utr_proof_path: proofPath,
          status: "pending",
          admin_note: null,
          confirmation_number: number,
          team_id: teamId,
          team_role: role,
          member_email: p.email.trim().toLowerCase(),
          access_token_hash: hash,
        })
        .single();

      if (!error) {
        return {
          id,
          confirmationNumber: number,
          accessToken: token,
        };
      }

      if (error.code === "23505" && error.message.includes("confirmation_number") && attempt === 0) {
        number = confirmationNumber();
        continue;
      }
      if (error.code === "23505" && error.message.includes("pass_registrations_one_live_per_email_key")) {
        throw new ApiError(409, EMAIL_IN_TEAM_MESSAGE, "email");
      }
      if (error.code === "23505" && error.message.includes("pass_registrations_one_live_per_utr_key")) {
        throw new ApiError(409, UTR_REUSED_MESSAGE, "utrNumber");
      }
      if (error.message.includes("team_full")) throw new ApiError(409, TEAM_FULL_MESSAGE);
      if (error.message.includes("team_not_found")) throw new ApiError(404, "Team not found.");

      console.error("[team-registration] insert failed", error);
      throw new ApiError(500, "Could not save your registration. Please try again.");
    }
    throw new ApiError(500, "Could not save your registration. Please try again.");
  } catch (err) {
    await removeUploads(uploaded);
    throw err;
  }
}

/**
 * Register a whole team together (Option A, 1–5 people, one payment proof, associated with the same team).
 */
export async function insertTeamBatchRegistration(opts: {
  parsed: ParsedRegistrationForm;
  team: RegistrationTeamRow;
}): Promise<InsertedRegistration> {
  const { parsed, team } = opts;
  const supabase = supabaseAdmin();
  const leadId = randomUUID();

  let screenshotPath: string;
  let proofPath: string | null = null;
  try {
    screenshotPath = await uploadFile(parsed.paymentScreenshot, `${leadId}/payment-screenshot`);
    if (parsed.utrProof) proofPath = await uploadFile(parsed.utrProof, `${leadId}/utr-proof`);
  } catch (err) {
    console.error("[team-registration] upload failed", err);
    throw new ApiError(500, "Could not upload your files. Please try again.");
  }

  const uploaded = proofPath ? [screenshotPath, proofPath] : [screenshotPath];
  const members: NonNullable<InsertedRegistration["members"]> = [];
  const insertedIds: string[] = [];

  try {
    for (let i = 0; i < parsed.participants.length; i++) {
      const p = parsed.participants[i];
      const id = i === 0 ? leadId : randomUUID();
      const role: "leader" | "member" = i === 0 ? "leader" : "member";
      const { token, hash } = newAccessToken();
      const memberUtr = i === 0 ? parsed.utrNumber : `${parsed.utrNumber}#${i + 1}`;
      const memberEmail = p.email.trim().toLowerCase();
      const memberNote =
        i === 0
          ? `Team registration: ${team.name} (${parsed.participants.length} members)`
          : `Team member of ${team.name} (Lead: ${parsed.participants[0].email})`;

      let number = confirmationNumber();
      let inserted = false;

      for (let attempt = 0; attempt < 2; attempt++) {
        const { error } = await supabase
          .from("pass_registrations")
          .insert({
            id,
            participants: [participantForStorage(p)],
            participant_count: 1,
            total_amount: REGISTRATION_FEE,
            payment_screenshot_path: screenshotPath,
            utr_number: memberUtr,
            utr_proof_path: proofPath,
            status: "pending",
            admin_note: memberNote,
            confirmation_number: number,
            team_id: team.id,
            team_role: role,
            member_email: memberEmail,
            access_token_hash: hash,
          })
          .single();

        if (!error) {
          insertedIds.push(id);
          members.push({
            email: memberEmail,
            name: p.name.trim(),
            accessToken: token,
            confirmationNumber: number,
            role,
          });
          inserted = true;
          break;
        }

        if (error.code === "23505" && error.message.includes("confirmation_number") && attempt === 0) {
          number = confirmationNumber();
          continue;
        }
        if (error.code === "23505" && error.message.includes("pass_registrations_one_live_per_email_key")) {
          throw new ApiError(409, `Email already registered: ${memberEmail}`, "email");
        }
        if (error.code === "23505" && error.message.includes("pass_registrations_one_live_per_utr_key")) {
          throw new ApiError(409, UTR_REUSED_MESSAGE, "utrNumber");
        }
        if (error.message.includes("team_full")) throw new ApiError(409, TEAM_FULL_MESSAGE);
        if (error.message.includes("team_not_found")) throw new ApiError(404, "Team not found.");

        console.error("[team-registration] batch member insert failed", error);
        throw new ApiError(500, "Could not save team registration. Please try again.");
      }

      if (!inserted) {
        throw new ApiError(500, "Could not save team registration. Please try again.");
      }
    }

    return {
      id: leadId,
      confirmationNumber: members[0].confirmationNumber,
      accessToken: members[0].accessToken,
      team: {
        id: team.id,
        name: team.name,
        code: team.code,
      },
      members,
    };
  } catch (err) {
    if (insertedIds.length > 0) {
      await supabase.from("pass_registrations").delete().in("id", insertedIds);
    }
    await removeUploads(uploaded);
    throw err;
  }
}
