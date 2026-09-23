/**
 * Admin-facing registration serial, e.g. CIEQ001. Built from the database's
 * `team_seq`; never shown to registrants (they get the confirmation number).
 */
export const TEAM_NUMBER_PREFIX = "CIEQ";

export function formatTeamNumber(seq: number): string {
  return `${TEAM_NUMBER_PREFIX}${String(seq).padStart(3, "0")}`;
}
