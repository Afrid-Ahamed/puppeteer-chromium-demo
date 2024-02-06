import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { preview } from "vite";
import { PreviewServer } from "vite";
import puppeteer from "puppeteer";
import { Browser, Page } from "puppeteer";

describe("basic", async () => {
  let server = PreviewServer;
  let browser = Browser;
  let page = Page;

  beforeAll(async () => {
    server = await preview({ server: { port: 3000 }, preview: { port: 3000 } });
    browser = await puppeteer.launch({
      headless: false,
      slowMo: 1000,
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
    await new Promise((resolve, reject) => {
      server.httpServer.close((error) => (error ? reject(error) : resolve()));
    });
  });

  test("should have the correct title", async () => {
    try {
      await page.goto("http://localhost:3000");
      const button = await page.$("#btn");
      expect(button).toBeDefined();

      let text = await page.evaluate((btn) => btn.textContent, button);
      expect(text).toBe("Clicked 0 time(s)");

      await button.click();
      text = await page.evaluate((btn) => btn.textContent, button);
      expect(text).toBe("Clicked 1 time(s)");
    } catch (e) {
      console.error(e);
      expect(e).toBeUndefined(); // Line causes error, if commented, tests pass though I'm unable to see the execution
    }
  }, 60_000);
});
