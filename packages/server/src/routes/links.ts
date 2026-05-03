import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { db } from "@url-shortener/database";
import { links } from "@url-shortener/database/schema";
import type { AppEnv } from "../lib/context";
import { requireAuth } from "../lib/middleware";
import { generateSlug } from "../lib/slug";

function baseUrl(): string {
  return process.env["BETTER_AUTH_URL"] ?? "http://localhost:3000";
}

const createLinkSchema = z.object({
  targetUrl: z.url({ protocol: /^https?$/ }),
  customSlug: z
    .string()
    .toLowerCase()
    .regex(/^[a-z0-9_-]{1,32}$/, "Slug must be 1-32 chars: a-z, 0-9, _ or -")
    .optional(),
});

export const linksRoutes = new Hono<AppEnv>();

linksRoutes.post(
  "/",
  requireAuth,
  zValidator("json", createLinkSchema),
  async (c) => {
    const user = c.get("user");
    const { targetUrl, customSlug } = c.req.valid("json");
    const slug = customSlug ?? generateSlug();

    try {
      const [row] = await db
        .insert(links)
        .values({ slug, targetUrl, userId: user.id })
        .returning();
      if (!row) throw new Error("insert returned no row");
      return c.json(
        {
          slug: row.slug,
          targetUrl: row.targetUrl,
          shortUrl: `${baseUrl()}/${row.slug}`,
          createdAt: row.createdAt,
        },
        201,
      );
    } catch (err) {
      // 23505 = Postgres unique_violation
      if ((err as { code?: string }).code === "23505") {
        return c.json({ error: "Slug already taken" }, 409);
      }
      throw err;
    }
  },
);

linksRoutes.get("/", requireAuth, async (c) => {
  const user = c.get("user");

  const rows = await db
    .select({
      slug: links.slug,
      targetUrl: links.targetUrl,
      createdAt: links.createdAt,
    })
    .from(links)
    .where(eq(links.userId, user.id))
    .orderBy(desc(links.createdAt));

  return c.json({
    links: rows.map((r) => ({ ...r, shortUrl: `${baseUrl()}/${r.slug}` })),
  });
});
