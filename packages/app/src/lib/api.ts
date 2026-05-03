import { hc, type InferResponseType } from "hono/client";
import type { ApiRoutes } from "@url-shortener/server";

// In prod the SPA is served from the same origin as the API, so use relative URLs.
// In dev, Vite serves on :5173 and the server on :3000 — point at the server.
export const API_BASE = import.meta.env.PROD
  ? ""
  : (import.meta.env.VITE_API_URL ?? "http://localhost:3000");

const client = hc<ApiRoutes>(API_BASE, {
  init: { credentials: "include" },
});

export const { api } = client;

// Server returns the same shape for both create (201) and list — one type is enough.
export type Link = InferResponseType<(typeof api.links)["$post"], 201>;
