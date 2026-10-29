import { expect, test } from "@playwright/test";

test.describe("الصفحة الرئيسية", () => {
  test("الصفحة RTL وعربية", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("بريد إلكتروني مؤقت");
    await expect(page).toHaveTitle(/بريد مؤقت/);
  });

  test("التنقل إلى قسم المميزات", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "المميزات" }).first().click();
    await expect(page.locator("#features")).toBeInViewport();
  });

  test("تبديل الوضع الداكن", async ({ page }) => {
    await page.goto("/");

    const themeBtn = page.locator('button[aria-label*="وضع"]');
    await expect(themeBtn).toHaveAttribute("data-ready", "true");
    await themeBtn.click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("API health", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.ok()).toBeTruthy();

    const body = await response.json();
    expect(body.status).toBe("ok");
  });

  test("توليد بريد مؤقت", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=guerrillamailblock.com").first()).toBeVisible({ timeout: 15000 });
  });
});
