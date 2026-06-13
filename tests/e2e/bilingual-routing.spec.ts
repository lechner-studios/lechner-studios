import { test, expect } from "playwright/test";

test.describe("Bilingual routing — SEO contract", () => {
  test("/ redirects to /de", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    expect(page.url()).toMatch(/\/de\/?$/);
  });

  test("/impressum redirects to /de/impressum", async ({ page }) => {
    await page.goto("/impressum");
    expect(page.url()).toMatch(/\/de\/impressum\/?$/);
  });

  test("/privacy redirects to /de/privacy", async ({ page }) => {
    await page.goto("/privacy");
    expect(page.url()).toMatch(/\/de\/privacy\/?$/);
  });

  test("<html lang> is de-AT on /de (SSR-correct)", async ({ page }) => {
    await page.goto("/de");
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("de-AT");
  });

  test("<html lang> is en on /en (SSR-correct)", async ({ page }) => {
    await page.goto("/en");
    const lang = await page.locator("html").getAttribute("lang");
    expect(lang).toBe("en");
  });

  test("hreflang alternates present on /de homepage", async ({ page }) => {
    await page.goto("/de");
    const links = page.locator("link[rel='alternate'][hreflang]");
    const count = await links.count();
    expect(count).toBeGreaterThanOrEqual(3);

    const hreflangs: string[] = [];
    for (let i = 0; i < count; i++) {
      const hreflang = await links.nth(i).getAttribute("hreflang");
      if (hreflang) hreflangs.push(hreflang);
    }
    expect(hreflangs).toContain("de-AT");
    expect(hreflangs).toContain("en");
    expect(hreflangs).toContain("x-default");
  });

  test("canonical resolves to current locale on /en", async ({ page }) => {
    await page.goto("/en");
    const canonical = await page.locator("link[rel='canonical']").getAttribute("href");
    expect(canonical).toMatch(/\/en$/);
  });

  test("language toggle on /de leads to /en preserving anchor", async ({ page }) => {
    await page.goto("/de#contact");
    const toggle = page.getByRole("link", { name: "EN", exact: true });
    await toggle.click();
    await page.waitForURL(/\/en/);
    expect(page.url()).toMatch(/\/en#contact/);
  });

  test("/de/impressum renders DE only (no EN section)", async ({ page }) => {
    await page.goto("/de/impressum");
    const body = await page.textContent("main");
    expect(body).toContain("Medieninhaber");
    expect(body ?? "").not.toContain("Media owner");
  });

  test("/en/impressum renders EN only (no DE section)", async ({ page }) => {
    await page.goto("/en/impressum");
    const body = await page.textContent("main");
    expect(body).toContain("Media owner & responsible for content");
    expect(body ?? "").not.toContain("Medieninhaber");
  });

  test("sitemap.xml includes both locale entries with hreflang triplet", async ({ request }) => {
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain("https://lechner-studios.at/de");
    expect(body).toContain("https://lechner-studios.at/en");
    expect(body).toContain('hreflang="de-AT"');
    expect(body).toContain('hreflang="en"');
    expect(body).toContain('hreflang="x-default"');
  });
});
