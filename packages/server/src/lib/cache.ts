import { redis } from "bun";

const TTL_SECONDS = 60 * 60 * 24 * 7;
const key = (slug: string) => `slug:${slug}`;

export const cache = {
  get: (slug: string) => redis.get(key(slug)),
  set: (slug: string, target: string) =>
    redis.send("SET", [key(slug), target, "EX", String(TTL_SECONDS)]),
  del: (slug: string) => redis.del(key(slug)),
};
