import { db } from "@url-shortener/database";
import { links, user, verification } from "@url-shortener/database/schema";
import { auth } from "./lib/auth";
import { cache } from "./lib/cache";

const SEED_USER = {
  email: "test@test.com",
  password: "password1234",
  name: "Test User",
};
const SEED_LINKS = [
  { slug: "gh", targetUrl: "https://github.com" },
  { slug: "g", targetUrl: "https://google.com" },
  { slug: "yt", targetUrl: "https://youtube.com" },
];

console.log("[seed] truncating user / verification...");
await db.delete(user);
await db.delete(verification);

console.log("[seed] creating user", SEED_USER.email);
const result = await auth.api.signUpEmail({ body: SEED_USER });

console.log("[seed] inserting links...");
const rows = SEED_LINKS.map((l) => ({ ...l, userId: result.user.id }));
await db.insert(links).values(rows);
for (const l of rows) await cache.set(l.slug, l.targetUrl);

console.log(`[seed] done. login: ${SEED_USER.email} / ${SEED_USER.password}`);
process.exit(0);
