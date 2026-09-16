import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { supabaseAdmin, PAYMENT_PROOFS_BUCKET } from "@/lib/supabase/admin";
import { REGISTRATION_FEE, MAX_TEAM_SIZE } from "@/lib/registration/constants";
import { isParticipantValid, participantForStorage } from "@/lib/registration/validation";
import type { Participant } from "@/lib/registration/types";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "application/pdf"]);

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  const participantsRaw = form.get("participants");
  const utrNumber = String(form.get("utrNumber") ?? "").trim();
  const paymentScreenshot = form.get("paymentScreenshot");
  const utrProof = form.get("utrProof");

  if (typeof participantsRaw !== "string") {
    return NextResponse.json({ error: "Missing participant details." }, { status: 400 });
  }

  let participants: Participant[];
  try {
    participants = JSON.parse(participantsRaw);
  } catch {
    return NextResponse.json({ error: "Malformed participant details." }, { status: 400 });
  }

  if (!Array.isArray(participants) || participants.length === 0) {
    return NextResponse.json({ error: "At least one participant is required." }, { status: 400 });
  }
  if (participants.length > MAX_TEAM_SIZE) {
    return NextResponse.json({ error: `A team can have at most ${MAX_TEAM_SIZE} members.` }, { status: 400 });
  }
  if (!participants.every(isParticipantValid)) {
    return NextResponse.json({ error: "One or more participant details are invalid." }, { status: 400 });
  }
  if (!utrNumber || utrNumber.length < 6) {
    return NextResponse.json({ error: "Enter a valid UTR / transaction number." }, { status: 400 });
  }
  if (!(paymentScreenshot instanceof File) || paymentScreenshot.size === 0) {
    return NextResponse.json({ error: "Upload the payment screenshot." }, { status: 400 });
  }
  if (!validateFile(paymentScreenshot)) {
    return NextResponse.json({ error: "Payment screenshot must be a PNG/JPG/WEBP/PDF under 5MB." }, { status: 400 });
  }
  if (utrProof instanceof File && utrProof.size > 0 && !validateFile(utrProof)) {
    return NextResponse.json({ error: "UTR proof must be a PNG/JPG/WEBP/PDF under 5MB." }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const registrationId = randomUUID();

  let screenshotPath: string;
  let utrProofPath: string | null = null;
  try {
    screenshotPath = await uploadFile(paymentScreenshot, `${registrationId}/payment-screenshot`);
    if (utrProof instanceof File && utrProof.size > 0) {
      utrProofPath = await uploadFile(utrProof, `${registrationId}/utr-proof`);
    }
  } catch (err) {
    console.error("[register] upload failed", err);
    return NextResponse.json({ error: "Could not upload your files. Please try again." }, { status: 500 });
  }

  const totalAmount = participants.length * REGISTRATION_FEE;

  const { error } = await supabase.from("pass_registrations").insert({
    id: registrationId,
    participants: participants.map(participantForStorage),
    participant_count: participants.length,
    total_amount: totalAmount,
    payment_screenshot_path: screenshotPath,
    utr_number: utrNumber,
    utr_proof_path: utrProofPath,
    status: "pending",
  });

  if (error) {
    console.error("[register] insert failed", error);
    return NextResponse.json({ error: "Could not save your registration. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ id: registrationId, totalAmount }, { status: 201 });

  async function uploadFile(file: File, path: string): Promise<string> {
    const ext = extensionFor(file.type);
    const fullPath = `${path}${ext}`;
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { error: uploadError } = await supabase.storage
      .from(PAYMENT_PROOFS_BUCKET)
      .upload(fullPath, bytes, { contentType: file.type, upsert: true });
    if (uploadError) throw uploadError;
    return fullPath;
  }
}

function validateFile(file: File): boolean {
  return file.size <= MAX_FILE_BYTES && ALLOWED_TYPES.has(file.type);
}

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
