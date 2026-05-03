import { customAlphabet } from "nanoid";

const SLUG_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
const SLUG_LENGTH = 7;

export const generateSlug = customAlphabet(SLUG_ALPHABET, SLUG_LENGTH);
