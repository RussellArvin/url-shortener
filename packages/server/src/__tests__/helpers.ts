import { redis } from "bun";
import { db } from "@url-shortener/database";
import { user, verification } from "@url-shortener/database/schema";
import { app } from "../index";

export async function resetState(): Promise<void> {
  // Cascades to session, account, links via FK onDelete
  await db.delete(user);
  await db.delete(verification);
  await redis.send("FLUSHDB", []);
}

export async function signUpAndGetCookie(
  email: string,
  password: string,
): Promise<string> {
  const res = await app.request("/api/auth/sign-up/email", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password, name: "Test" }),
  });
  if (!res.ok) {
    throw new Error(
      `signup failed (${String(res.status)}): ${await res.text()}`,
    );
  }
  const cookies = res.headers.getSetCookie();
  return cookies.map((c) => c.split(";")[0]).join("; ");
}
