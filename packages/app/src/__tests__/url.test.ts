import { describe, expect, test } from "bun:test";
import { isValidUrl, normalizeUrl } from "../lib/url";

describe("isValidUrl", () => {
  describe("accepts valid domains", () => {
    test.each([
      "example.com",
      "www.example.com",
      "https://example.com",
      "http://example.com",
      "https://www.example.com",
      "https://example.com/path",
      "https://example.com/path/to/page",
      "https://example.com/path?query=1&other=2",
      "https://example.com/path#fragment",
      "sub.example.co.uk",
      "https://sub.domain.example.com",
      "my-site.io",
      "abc123.com",
      "x.co",
    ])("%s", (input) => {
      expect(isValidUrl(input)).toBe(true);
    });
  });

  describe("rejects invalid input", () => {
    test.each([
      ["empty", ""],
      ["bare word", "google"],
      ["scheme + bare word", "https://google"],
      ["scheme + bare word with slash", "https://google/"],
      ["scheme only", "https://"],
      ["dot only", "."],
      ["trailing dot, no TLD", "example."],
      ["leading dot", ".com"],
      ["single-letter TLD", "example.c"],
      ["spaces", "example .com"],
      ["scheme + space", "https://exa mple.com"],
      ["non-http scheme bare host", "ftp://google"],
    ])("%s — %s", (_label, input) => {
      expect(isValidUrl(input)).toBe(false);
    });
  });
});

describe("normalizeUrl", () => {
  test("leaves https:// URLs unchanged", () => {
    expect(normalizeUrl("https://example.com")).toBe("https://example.com");
  });

  test("leaves http:// URLs unchanged", () => {
    expect(normalizeUrl("http://example.com")).toBe("http://example.com");
  });

  test("prepends https:// to bare hostnames", () => {
    expect(normalizeUrl("example.com")).toBe("https://example.com");
    expect(normalizeUrl("www.example.com")).toBe("https://www.example.com");
  });

  test("prepends https:// to hostnames with paths", () => {
    expect(normalizeUrl("example.com/path?q=1")).toBe(
      "https://example.com/path?q=1",
    );
  });

  test("recognizes scheme case-insensitively", () => {
    expect(normalizeUrl("HTTPS://example.com")).toBe("HTTPS://example.com");
    expect(normalizeUrl("Http://example.com")).toBe("Http://example.com");
  });
});
