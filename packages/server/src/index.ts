import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./lib/auth";

type AuthSession = typeof auth.$Infer.Session;

interface Variables {
  user: AuthSession["user"] | null;
  session: AuthSession["session"] | null;
}

const app = new Hono<{ Variables: Variables }>();

app.use(
  "/api/auth/*",
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

export { app };

export default {
  port: 3000,
  fetch: app.fetch,
};
