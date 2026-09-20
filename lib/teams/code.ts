import { randomInt } from "node:crypto";
import { TEAM_CODE_ALPHABET, TEAM_CODE_LENGTH } from "./constants";

export function generateTeamCode(): string {
  let code = "";
  for (let i = 0; i < TEAM_CODE_LENGTH; i++) {
    code += TEAM_CODE_ALPHABET[randomInt(TEAM_CODE_ALPHABET.length)];
  }
  return code;
}
