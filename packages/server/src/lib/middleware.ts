import { createMiddleware } from "hono/factory";
import type { AuthSession } from "./context";

interface AuthedVariables {
  user: AuthSession["user"];
  session: AuthSession["session"];
}

export const requireAuth = createMiddleware<{ Variables: AuthedVariables }>(
  async (c, next) => {
    const user = c.get("user") as AuthSession["user"] | null;
    if (!user) return c.json({ error: "Unauthorized" }, 401);
    await next();
  },
);
