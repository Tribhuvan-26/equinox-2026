import { isValidEmail } from "@/lib/registration/validation";

export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 128;

export type AuthFieldErrors = Partial<Record<"name" | "email" | "password", string>>;

export function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export function normalizePersonName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

export function validateSignup(input: { name: string; email: string; password: string }): AuthFieldErrors {
  const errors: AuthFieldErrors = {};
  const name = normalizePersonName(input.name);

  if (name.length < 2) errors.name = "Enter your full name.";
  else if (name.length > 80) errors.name = "Name is too long.";

  if (!isValidEmail(input.email)) errors.email = "Enter a valid email address.";

  if (input.password.length < PASSWORD_MIN) errors.password = `Password must be at least ${PASSWORD_MIN} characters.`;
  else if (input.password.length > PASSWORD_MAX) errors.password = "Password is too long.";

  return errors;
}

export function validatePassword(password: string): string | null {
  if (password.length < PASSWORD_MIN) return `Password must be at least ${PASSWORD_MIN} characters.`;
  if (password.length > PASSWORD_MAX) return "Password is too long.";
  return null;
}
