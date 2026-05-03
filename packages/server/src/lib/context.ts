import type { auth } from "./auth";

export type AuthSession = typeof auth.$Infer.Session;

export interface Variables {
  user: AuthSession["user"] | null;
  session: AuthSession["session"] | null;
}

export interface AppEnv {
  Variables: Variables;
}
