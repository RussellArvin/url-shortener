import { test, expect } from "@playwright/test";

test("signup → shorten → see in list → delete", async ({ page }) => {
  const email = `e2e-${crypto.randomUUID()}@test.com`;
  const password = "password1234";
  const slug = `e2e-${crypto.randomUUID().slice(0, 8)}`;
  const target = "https://example.com/very/long/path";

  await page.goto("/");

  // Sign up
  await page.getByRole("tab", { name: "Sign up" }).click();
  await page.getByLabel("Name").fill("E2E");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();

  // Land on home, fill out the create-link form with a custom slug
  await expect(
    page.getByRole("link", { name: "Shorten", exact: true }),
  ).toBeVisible();
  await page.getByLabel("URL").fill(target);
  await page.getByRole("tab", { name: "Custom" }).click();
  await page.getByLabel("Custom slug").fill(slug);
  await page.getByRole("button", { name: "Shorten" }).click();

  // Result panel shows the short URL
  await expect(page.getByText("Your short link is ready")).toBeVisible();
  await expect(
    page.getByRole("link", { name: new RegExp(slug) }),
  ).toBeVisible();

  // Navigate to /links and confirm row exists
  await page.getByRole("link", { name: "My links" }).click();
  await expect(page).toHaveURL(/\/links$/);
  const row = page.getByRole("row", { name: new RegExp(slug) });
  await expect(row).toBeVisible();
  await expect(row.getByText(target)).toBeVisible();

  // Delete the link
  await row.getByRole("button", { name: "Delete link" }).click();
  await expect(row).not.toBeVisible();
});
