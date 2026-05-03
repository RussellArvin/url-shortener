import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@url-shortener/database";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: ["http://localhost:5173"],
  advanced: {
    database: {
      generateId: "uuid",
    },
  },
});
