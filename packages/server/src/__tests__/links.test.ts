import { test, expect, describe, beforeEach } from "bun:test";
import { redis } from "bun";
import { app } from "../index";
import { resetState, signUpAndGetCookie } from "./helpers";

interface CreatedLink {
  slug: string;
  targetUrl: string;
  createdAt: string;
}

interface ListedLinks {
  links: { slug: string; targetUrl: string; createdAt: string }[];
}

beforeEach(async () => {
  await resetState();
});

describe("POST /api/links", () => {
  test("requires auth", async () => {
    const res = await app.request("/api/links", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ targetUrl: "https://example.com" }),
    });
    expect(res.status).toBe(401);
  });

  test("creates link with random slug", async () => {
    const cookie = await signUpAndGetCookie("a@a.com", "password1234");
    const res = await app.request("/api/links", {
      method: "POST",
      headers: { "content-type": "application/json", cookie },
      body: JSON.stringify({ targetUrl: "https://example.com" }),
    });
    expect(res.status).toBe(201);
    const body = (await res.json()) as CreatedLink;
    expect(body.slug).toMatch(/^[a-z0-9]{7}$/);
    expect(body.targetUrl).toBe("https://example.com");
  });

  test("creates link with custom slug", async () => {
    const cookie = await signUpAndGetCookie("a@a.com", "password1234");
    const res = await app.request("/api/links", {
      method: "POST",
      headers: { "content-type": "application/json", cookie },
      body: JSON.stringify({
        targetUrl: "https://example.com",
        customSlug: "my-link",
      }),
    });
    expect(res.status).toBe(201);
    const body = (await res.json()) as CreatedLink;
    expect(body.slug).toBe("my-link");
  });

  test("rejects reserved slugs with 400", async () => {
    const cookie = await signUpAndGetCookie("a@a.com", "password1234");
    for (const slug of ["api", "links", "assets", "health"]) {
      const res = await app.request("/api/links", {
        method: "POST",
        headers: { "content-type": "application/json", cookie },
        body: JSON.stringify({
          targetUrl: "https://example.com",
          customSlug: slug,
        }),
      });
      expect(res.status).toBe(400);
    }
  });

  test("rejects duplicate slug with 409", async () => {
    const cookie = await signUpAndGetCookie("a@a.com", "password1234");
    const make = () =>
      app.request("/api/links", {
        method: "POST",
        headers: { "content-type": "application/json", cookie },
        body: JSON.stringify({
          targetUrl: "https://example.com",
          customSlug: "dupe",
        }),
      });
    expect((await make()).status).toBe(201);
    expect((await make()).status).toBe(409);
  });

  test("populates redis cache on create", async () => {
    const cookie = await signUpAndGetCookie("a@a.com", "password1234");
    await app.request("/api/links", {
      method: "POST",
      headers: { "content-type": "application/json", cookie },
      body: JSON.stringify({
        targetUrl: "https://example.com",
        customSlug: "cached",
      }),
    });
    const cached = await redis.get("slug:cached");
    expect(cached).toBe("https://example.com");
  });
});

describe("GET /api/links", () => {
  test("lists only the caller's links", async () => {
    const aliceCookie = await signUpAndGetCookie("alice@a.com", "password1234");
    const bobCookie = await signUpAndGetCookie("bob@b.com", "password1234");

    await app.request("/api/links", {
      method: "POST",
      headers: { "content-type": "application/json", cookie: aliceCookie },
      body: JSON.stringify({
        targetUrl: "https://alice.com",
        customSlug: "alice",
      }),
    });
    await app.request("/api/links", {
      method: "POST",
      headers: { "content-type": "application/json", cookie: bobCookie },
      body: JSON.stringify({
        targetUrl: "https://bob.com",
        customSlug: "bob",
      }),
    });

    const res = await app.request("/api/links", {
      headers: { cookie: aliceCookie },
    });
    const body = (await res.json()) as ListedLinks;
    expect(body.links).toHaveLength(1);
    expect(body.links[0]?.slug).toBe("alice");
  });
});

describe("DELETE /api/links/:slug", () => {
  test("soft-deletes the link and removes it from cache", async () => {
    const cookie = await signUpAndGetCookie("a@a.com", "password1234");
    await app.request("/api/links", {
      method: "POST",
      headers: { "content-type": "application/json", cookie },
      body: JSON.stringify({
        targetUrl: "https://example.com",
        customSlug: "kill",
      }),
    });
    expect(await redis.get("slug:kill")).toBe("https://example.com");

    const del = await app.request("/api/links/kill", {
      method: "DELETE",
      headers: { cookie },
    });
    expect(del.status).toBe(200);
    expect(await redis.get("slug:kill")).toBeNull();

    const list = await app.request("/api/links", { headers: { cookie } });
    const body = (await list.json()) as ListedLinks;
    expect(body.links).toHaveLength(0);
  });

  test("404 if the slug is not owned by the caller", async () => {
    const aliceCookie = await signUpAndGetCookie("alice@a.com", "password1234");
    const bobCookie = await signUpAndGetCookie("bob@b.com", "password1234");
    await app.request("/api/links", {
      method: "POST",
      headers: { "content-type": "application/json", cookie: aliceCookie },
      body: JSON.stringify({
        targetUrl: "https://alice.com",
        customSlug: "mine",
      }),
    });

    const res = await app.request("/api/links/mine", {
      method: "DELETE",
      headers: { cookie: bobCookie },
    });
    expect(res.status).toBe(404);
  });
});

describe("GET /:slug (public redirect)", () => {
  test("redirects and populates cache on miss", async () => {
    const cookie = await signUpAndGetCookie("a@a.com", "password1234");
    await app.request("/api/links", {
      method: "POST",
      headers: { "content-type": "application/json", cookie },
      body: JSON.stringify({
        targetUrl: "https://example.com",
        customSlug: "go",
      }),
    });
    // Force miss on next read
    await redis.send("FLUSHDB", []);

    const res = await app.request("/go", { redirect: "manual" });
    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe("https://example.com");
    expect(await redis.get("slug:go")).toBe("https://example.com");
  });

  test("404 for unknown slug", async () => {
    const res = await app.request("/nope", { redirect: "manual" });
    expect(res.status).toBe(404);
  });

  test("404 for soft-deleted slug", async () => {
    const cookie = await signUpAndGetCookie("a@a.com", "password1234");
    await app.request("/api/links", {
      method: "POST",
      headers: { "content-type": "application/json", cookie },
      body: JSON.stringify({
        targetUrl: "https://example.com",
        customSlug: "gone",
      }),
    });
    await app.request("/api/links/gone", {
      method: "DELETE",
      headers: { cookie },
    });

    const res = await app.request("/gone", { redirect: "manual" });
    expect(res.status).toBe(404);
  });
});
