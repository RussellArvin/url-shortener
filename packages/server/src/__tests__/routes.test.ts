import { test, expect, describe } from "bun:test";
import { app } from "../index";

describe("GET /", () => {
  test("returns 200", async () => {
    const res = await app.request("/");
    expect(res.status).toBe(200);
  });
});

describe("GET /health", () => {
  test("returns ok status", async () => {
    const res = await app.request("/health");
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ status: "ok" });
  });
});
