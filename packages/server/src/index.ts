import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./lib/auth";
import type { AppEnv } from "./lib/context";
import { linksRoutes } from "./routes/links";
import { redirectRoutes } from "./routes/redirect";

const app = new Hono<AppEnv>();

app.use(
  "/api/*",
  cors({
    origin: "http://localhost:5173",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
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

app.get("/api/me", (c) => {
  const user = c.get("user");
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  return c.json({ user });
});

app.route("/api/links", linksRoutes);

// Public redirect — must be registered last so /:slug doesn't shadow other routes
app.route("/", redirectRoutes);

export { app };

export default {
  port: 3000,
  fetch: app.fetch,
};
