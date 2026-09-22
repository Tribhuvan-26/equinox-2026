import "server-only";
import { randomUUID } from "node:crypto";
import { ApiError } from "@/lib/api";
import { supabaseAdmin, PAYMENT_PROOFS_BUCKET } from "@/lib/supabase/admin";
import { newAccessToken } from "@/lib/teams/access";
import { REGISTRATION_FEE } from "./constants";
import type { Participant } from "./types";
import { participantForStorage, isParticipantValid } from "./validation";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "application/pdf"]);

export type ParsedRegistrationForm = {
  participant: Participant;
  utrNumber: string;
  paymentScreenshot: File;
  utrProof: File | null;
  form: FormData;
};

function validFile(file: File): boolean {
  return file.size > 0 && file.size <= MAX_FILE_BYTES && ALLOWED_TYPES.has(file.type);
}

function startsWith(bytes: Uint8Array, signature: number[], offset = 0): boolean {
  return signature.every((byte, i) => bytes[offset + i] === byte);
}

/**
 * The declared Content-Type is whatever the browser (or a hand-written request)
 * says it is, so check the first bytes really are the format they claim.
 */
async function contentMatchesType(file: File): Promise<boolean> {
  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  switch (file.type) {
    case "image/png":
      return startsWith(head, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    case "image/jpeg":
      return startsWith(head, [0xff, 0xd8, 0xff]);
    case "application/pdf":
      return startsWith(head, [0x25, 0x50, 0x44, 0x46]);
    case "image/webp":
      // "RIFF" .... "WEBP"
      return startsWith(head, [0x52, 0x49, 0x46, 0x46]) && startsWith(head, [0x57, 0x45, 0x42, 0x50], 8);
    default:
      return false;
  }
}

/** Read + validate the single-person registration form (details, UTR, screenshot). */
export async function readRegistrationForm(request: Request): Promise<ParsedRegistrationForm> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    throw new ApiError(400, "Invalid form submission.");
  }

  const raw = form.get("participant");
  if (typeof raw !== "string") throw new ApiError(400, "Missing your details.");
  let participant: Participant;
  try {
    participant = JSON.parse(raw);
  } catch {
    throw new ApiError(400, "Malformed details.");
  }
  if (!participant || typeof participant !== "object" || !isParticipantValid(participant)) {
    throw new ApiError(400, "One or more of your details are invalid.");
  }

  const utrNumber = String(form.get("utrNumber") ?? "").trim();
  if (utrNumber.length < 6) throw new ApiError(400, "Enter a valid UTR / transaction number.", "utrNumber");

  const paymentScreenshot = form.get("paymentScreenshot");
  if (!(paymentScreenshot instanceof File) || paymentScreenshot.size === 0) {
    throw new ApiError(400, "Upload the payment screenshot.", "paymentScreenshot");
  }
  if (!validFile(paymentScreenshot) || !(await contentMatchesType(paymentScreenshot))) {
    throw new ApiError(400, "Payment screenshot must be a PNG/JPG/WEBP/PDF under 5MB.", "paymentScreenshot");
  }

  const proof = form.get("utrProof");
  let utrProof: File | null = null;
  if (proof instanceof File && proof.size > 0) {
    if (!validFile(proof) || !(await contentMatchesType(proof))) {
      throw new ApiError(400, "UTR proof must be a PNG/JPG/WEBP/PDF under 5MB.");
    }
    utrProof = proof;
  }

  return { participant, utrNumber, paymentScreenshot, utrProof, form };
}

/** Is this email already on a live (not rejected) registration, team or not? */
export async function emailAlreadyRegistered(email: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin()
    .from("pass_registrations")
    .select("id")
    .eq("member_email", email.trim().toLowerCase())
    .neq("status", "rejected")
    .limit(1);
  if (error) throw error;
  return (data ?? []).length > 0;
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
};

/**
 * Save one person's registration (their details + their own payment proof).
 *
 * `teamId` is null when they have only paid and not picked a team yet; they
 * attach to one afterwards. The database decides capacity and one-per-email.
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

  const stored = participantForStorage(parsed.participant);
  const { token, hash } = newAccessToken();
  const uploaded = proofPath ? [screenshotPath, proofPath] : [screenshotPath];

  try {
    let number = confirmationNumber();
    for (let attempt = 0; attempt < 2; attempt++) {
      const { error } = await supabase
        .from("pass_registrations")
        .insert({
          id,
          participants: [stored],
          participant_count: 1,
          total_amount: REGISTRATION_FEE,
          payment_screenshot_path: screenshotPath,
          utr_number: parsed.utrNumber,
          utr_proof_path: proofPath,
          status: "pending",
          confirmation_number: number,
          team_id: teamId,
          team_role: role,
          member_email: stored.email,
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
      // One payment, one registration. Nothing here can check a UTR against a
      // bank, so re-using a screenshot is caught by the index or not at all.
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
