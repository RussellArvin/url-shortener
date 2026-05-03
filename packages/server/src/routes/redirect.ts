import { Hono } from "hono";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@url-shortener/database";
import { links } from "@url-shortener/database/schema";

export const redirectRoutes = new Hono();

redirectRoutes.get("/:slug", async (c) => {
  const slug = c.req.param("slug").toLowerCase();
  const [row] = await db
    .select({ targetUrl: links.targetUrl })
    .from(links)
    .where(and(eq(links.slug, slug), isNull(links.deletedAt)))
    .limit(1);
  if (!row) return c.notFound();
  return c.redirect(row.targetUrl, 302);
});
