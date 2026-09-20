import { MAX_TEAM_SIZE } from "@/lib/registration/constants";

// A team seats at most as many people as one full registration.
export const TEAM_MAX_MEMBERS = MAX_TEAM_SIZE;
export const TEAM_MIN_MEMBERS_LIMIT = 2;
export const DEFAULT_MAX_MEMBERS = MAX_TEAM_SIZE;

export const TEAM_NAME_MIN = 3;
export const TEAM_NAME_MAX = 40;

export const TEAM_CODE_LENGTH = 6;
// No 0/O/1/I so codes survive being read aloud or copied from a screenshot.
export const TEAM_CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
export const TEAM_CODE_REGEX = /^[A-Z0-9]{6,8}$/;

export const NAME_TAKEN_MESSAGE = "This team name is already taken. Please choose another name.";
