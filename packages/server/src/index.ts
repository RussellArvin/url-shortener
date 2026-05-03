import { Hono } from "hono";
import { APP_NAME } from "@url-shortener/shared";

const app = new Hono();

app.get("/", (c) => c.json({ name: APP_NAME }));

app.get("/health", (c) => c.json({ status: "ok" }));

export { app };

export default {
  port: 3000,
  fetch: app.fetch,
};
