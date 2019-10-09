const puppeteer = require("puppeteer");
const value = require("../factories/session")();

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

test("Header Text", async () => {
  const text = await page.$eval("a.brand-logo", el => {
    return el.innerHTML;
  });
  expect(text).toEqual("Testing");
});

test("login link", async () => {
  await page.click(".right .login");
  let url = await page.url();
  expect(url).toMatch(/login/gi);
});

test("When Signed In Shows Logout Button", async () => {
  await page.setCookie(value);
  await page.goto("http://localhost:3000");
});
