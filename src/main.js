// This is the main Node.js source code file of your actor.

// Import Apify SDK. For more information, see https://sdk.apify.com/
const Apify = require("apify");
const { chromium } = require('playwright');

Apify.main(async () => {
  const input = await Apify.getInput();
  console.log("Input:");
  console.dir(input);

  const output = { isLoginSuccess: false, isCancelSuccess: false };

  try {
    const browser = await chromium.launch({
      headless: false,
    });
    const context = await browser.newContext();

    // Open new page
    const page = await context.newPage();

    // Go to https://play.hbonow.com/page/urn:hbo:page:home
    await page.goto("https://play.hbonow.com/page/urn:hbo:page:home");

    // Click text="SIGN IN"
    await page.click('text="SIGN IN"');
    console.log("Found sign in");

    // Click input[type="text"]
    await page.click('input[type="text"]');

    // Fill input[type="text"]
    await page.fill('input[type="text"]', input.account.username);
    console.log("Entered username");

    // Click input[type="password"]
    await page.click('input[type="password"]');

    // Press v with modifiers
    await page.fill('input[type="password"]', input.account.password);

    // Click //div[normalize-space(.)='Show']
    await page.click("//div[normalize-space(.)='Show']");

    // Fill input[type="password"]
    await page.fill('input[type="password"]', "aelHB6986");

    // Press Enter
    await Promise.all([
      page.waitForNavigation(/*{ url: 'https://play.hbonow.com/page/urn:hbo:page:home' }*/),
      page.press('input[type="password"]', "Enter"),
    ]);

    output.isLoginSuccess = true;

    // Click text="Brenna"
    await page.click('text="Brenna"');

    // Click text="Billing Information"
    await page.click('text="Billing Information"');

    // Click text="Manage Your Subscription"
    const [page1] = await Promise.all([
      page.waitForEvent("popup"),
      page.click('text="Manage Your Subscription"'),
    ]);

    output.isCancelSuccess = true;
  } catch (e) {
    console.error(e);
  } finally {
    await Apify.setValue(
      'OUTPUT',
      JSON.stringify(output),
      { contentType: 'application/json' }
    )
  }
});
