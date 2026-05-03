import { Hono } from "hono";

const app = new Hono();

app.get("/health", (c) => c.json({ status: "ok" }));

export { app };

export default {
  port: 3000,
  fetch: app.fetch,
};
