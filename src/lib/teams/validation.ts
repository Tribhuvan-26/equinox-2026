import { TEAM_CODE_REGEX, TEAM_MAX_MEMBERS, TEAM_MIN_MEMBERS_LIMIT, TEAM_NAME_MAX, TEAM_NAME_MIN } from "./constants";

// Letters, digits, spaces and a little punctuation. Keeps names printable and
// stops control characters / markup from being stored.
const TEAM_NAME_CHARS = /^[\p{L}\p{N}][\p{L}\p{N} _.&'’-]*$/u;

export function normalizeTeamName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ");
}

/** Returns an error message, or null when the (normalized) name is fine. */
export function validateTeamName(raw: string): string | null {
  const name = normalizeTeamName(raw);
  if (name.length < TEAM_NAME_MIN) return `Team name must be at least ${TEAM_NAME_MIN} characters.`;
  if (name.length > TEAM_NAME_MAX) return `Team name must be at most ${TEAM_NAME_MAX} characters.`;
  if (!TEAM_NAME_CHARS.test(name)) {
    return "Team name can only use letters, numbers, spaces and - _ . & '";
  }
  return null;
}

export function validateMaxMembers(value: unknown): number | null {
  if (typeof value !== "number" || !Number.isInteger(value)) return null;
  if (value < TEAM_MIN_MEMBERS_LIMIT || value > TEAM_MAX_MEMBERS) return null;
  return value;
}

/** Codes are searched case-insensitively. */
export function normalizeTeamCode(raw: string): string {
  return raw.trim().toUpperCase();
}

export function looksLikeTeamCode(raw: string): boolean {
  return TEAM_CODE_REGEX.test(normalizeTeamCode(raw));
}

// ilike treats % _ \ as wildcards; escape them so a search is an exact,
// case-insensitive match and not a pattern.
export function escapeLike(raw: string): string {
  return raw.replace(/[\\%_]/g, (c) => `\\${c}`);
}
