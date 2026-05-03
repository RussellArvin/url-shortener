import { hc } from "hono/client";
import type { ApiRoutes } from "@url-shortener/server";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const client = hc<ApiRoutes>(API_BASE, {
  init: { credentials: "include" },
});

export const { api } = client;
