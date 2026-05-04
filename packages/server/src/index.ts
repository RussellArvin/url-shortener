import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "hono/bun";
import { auth } from "./lib/auth";
import type { AppEnv } from "./lib/context";
import { env } from "./lib/env";
import { requireAuth } from "./lib/middleware";
import { makeLinksRoutes } from "./routes/links";
import { redirectRoutes } from "./routes/redirect";

const APP_DIST = "../app/dist";

const app = new Hono<AppEnv>();

app.use(
  "/api/*",
  cors({
    origin: env.WEB_URL,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "DELETE", "OPTIONS"],
    credentials: true,
    maxAge: 600,
  }),
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.use("*", async (c, next) => {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  c.set("user", session?.user ?? null);
  c.set("session", session?.session ?? null);
  await next();
});

app.get("/health", (c) => c.json({ status: "ok" }));

// Static SPA assets and React Router pages — registered before the API mount
// so their top-level segments (assets, links) feed into reservedSlugs below.
app.use("/assets/*", serveStatic({ root: APP_DIST }));
app.get("/", serveStatic({ path: `${APP_DIST}/index.html` }));
app.get("/links", serveStatic({ path: `${APP_DIST}/index.html` }));

// Top-level segments of every route registered so far. Filters out wildcards
// and route params, so /:slug from redirectRoutes (mounted last) is excluded.
const reservedSlugs: ReadonlySet<string> = new Set(
  app.routes
    .map((r) => r.path.split("/")[1] ?? "")
    .filter((s) => s !== "" && !s.startsWith(":") && s !== "*"),
);

// Typed API surface — exported below as ApiRoutes for the RPC client
export const apiRoutes = app
  .basePath("/api")
  .route("/links", makeLinksRoutes(reservedSlugs))
  .get("/me", requireAuth, (c) => {
    const user = c.get("user");
    return c.json({ user });
  });

export type ApiRoutes = typeof apiRoutes;

// Public redirect — must be registered last so /:slug doesn't shadow other routes
app.route("/", redirectRoutes);

export { app };

export default {
  port: Number(process.env["PORT"]) || 3000,
  fetch: app.fetch,
};
