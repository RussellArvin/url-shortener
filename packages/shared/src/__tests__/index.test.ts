import { test, expect } from "bun:test";
import { APP_NAME } from "../index";

test("exports APP_NAME", () => {
  expect(APP_NAME).toBeString();
});
