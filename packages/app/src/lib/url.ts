// Allows: optional http(s)://, one or more dot-separated labels, 2+ letter TLD, optional path.
// Rejects bare hostnames without a dot ("google", "https://google") so we don't accept
// schemes pointing at non-public hostnames as if they were domains.
export const URL_PATTERN = "(https?://)?([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}(/.*)?";

const URL_REGEX = new RegExp(`^${URL_PATTERN}$`);

export function isValidUrl(value: string): boolean {
  return URL_REGEX.test(value);
}

export function normalizeUrl(value: string): string {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}
