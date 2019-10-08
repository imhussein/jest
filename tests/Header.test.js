const puppeteer = require("puppeteer");

let browser, page;
beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
    args: [`--window-size=${1200},${750}`]
  });
  page = await browser.newPage();
  await page.goto("http://localhost:3000");
});

afterEach(async () => {
  await browser.close();
});

test("Launch Chrominium", async () => {
  const text = await page.$eval("a.brand-logo", el => {
    return el.innerHTML;
  });
  expect(text).toEqual("Testing");
});
