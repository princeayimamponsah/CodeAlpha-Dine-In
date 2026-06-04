const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  try {
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
    // Click the Google sign-in button by aria-label
    await page.click('button[aria-label="Continue with Google"]', { timeout: 5000 });
    // wait for navigation to happen
    await page.waitForNavigation({ waitUntil: 'load', timeout: 10000 });
    const url = page.url();
    console.log('CURRENT_URL:', url);
    if (url.includes('accounts.google.com')) {
      console.log('RESULT: REDIRECT_OK');
      process.exit(0);
    }
    console.error('RESULT: REDIRECT_FAILED');
    process.exit(2);
  } catch (err) {
    console.error('ERROR:', err.message || err);
    process.exit(3);
  } finally {
    await browser.close();
  }
})();
