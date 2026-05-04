import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@url-shortener/database";
import { links } from "@url-shortener/database/schema";
import type { AppEnv } from "../lib/context";
import { cache } from "../lib/cache";
import { requireAuth } from "../lib/middleware";
import { generateSlug } from "../lib/slug";

// 23505 = Postgres unique_violation. Drizzle wraps the driver error, so the pg
// errno lives on err.cause.errno (Bun sql) or err.code.
function isUniqueViolation(err: unknown): boolean {
  const cause = (err as { cause?: unknown }).cause;
  const errno =
    (cause as { errno?: string } | null | undefined)?.errno ??
    (err as { code?: string }).code;
  return errno === "23505";
}

// Random slugs are 7 chars so can't collide with any current top-level route;
// only custom slugs need the reserved-slug guard.
export function makeLinksRoutes(reservedSlugs: ReadonlySet<string>) {
  const createLinkSchema = z.object({
    targetUrl: z.url({ protocol: /^https?$/ }),
    customSlug: z
      .string()
      .toLowerCase()
      .regex(/^[a-z0-9_-]{1,30}$/, "Slug must be 1-30 chars: a-z, 0-9, _ or -")
      .refine((s) => !reservedSlugs.has(s), "This slug is reserved")
      .optional(),
  });

  return new Hono<AppEnv>()
    .post("/", requireAuth, zValidator("json", createLinkSchema), async (c) => {
      const user = c.get("user");
      const { targetUrl, customSlug } = c.req.valid("json");

      const tryInsert = async (slug: string) => {
        const [row] = await db
          .insert(links)
          .values({ slug, targetUrl, userId: user.id })
          .returning();
        if (!row) throw new Error("insert returned no row");
        return row;
      };

      let row: Awaited<ReturnType<typeof tryInsert>>;
      try {
        row = await tryInsert(customSlug ?? generateSlug());
      } catch (err) {
        if (!isUniqueViolation(err)) throw err;
        if (customSlug) return c.json({ error: "Slug already taken" }, 409);
        // Random-slug collision is astronomically rare at 36^7. Retry once;
        // if the retry also collides, let it 500.
        row = await tryInsert(generateSlug());
      }

      await cache.set(row.slug, row.targetUrl);
      return c.json(
        {
          slug: row.slug,
          targetUrl: row.targetUrl,
          createdAt: row.createdAt,
        },
        201,
      );
    })
    .get("/", requireAuth, async (c) => {
      const user = c.get("user");

      const rows = await db
        .select({
          slug: links.slug,
          targetUrl: links.targetUrl,
          createdAt: links.createdAt,
        })
        .from(links)
        .where(and(eq(links.userId, user.id), isNull(links.deletedAt)))
        .orderBy(desc(links.createdAt));

      return c.json({ links: rows });
    })
    .delete("/:slug", requireAuth, async (c) => {
      const user = c.get("user");
      const slug = c.req.param("slug").toLowerCase();

      const [row] = await db
        .update(links)
        .set({ deletedAt: new Date() })
        .where(
          and(
            eq(links.slug, slug),
            eq(links.userId, user.id),
            isNull(links.deletedAt),
          ),
        )
        .returning({ slug: links.slug });

      if (!row) return c.json({ error: "Not found" }, 404);
      await cache.del(row.slug);
      return c.json({ slug: row.slug });
    });
}
