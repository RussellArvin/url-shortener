import { Hono } from "hono";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@url-shortener/database";
import { links } from "@url-shortener/database/schema";
import { cache } from "../lib/cache";

export const redirectRoutes = new Hono();

redirectRoutes.get("/:slug", async (c) => {
  const slug = c.req.param("slug").toLowerCase();

  const cached = await cache.get(slug);
  if (cached) return c.redirect(cached, 302);

  const [row] = await db
    .select({ targetUrl: links.targetUrl })
    .from(links)
    .where(and(eq(links.slug, slug), isNull(links.deletedAt)))
    .limit(1);
  if (!row) return c.notFound();

  await cache.set(slug, row.targetUrl);
  return c.redirect(row.targetUrl, 302);
});
