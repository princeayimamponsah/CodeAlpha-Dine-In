import { chromium } from 'playwright';

 (async () => {
  const base = 'http://localhost:3000';
  const admin = { email: 'admin@dine-in.com', password: 'password123' };

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('Navigating to login...');
    await page.goto(`${base}/login`, { waitUntil: 'networkidle' });

    await page.getByLabel('Email').fill(admin.email);
    await page.getByLabel('Password').fill(admin.password);
    await page.getByRole('button', { name: /Sign In/i }).click();

    await page.waitForURL('**/dashboard', { timeout: 10000 });
    console.log('Logged in, on dashboard');

    // Navigate to admin menu management page
    await page.goto(`${base}/menu-items`, { waitUntil: 'networkidle' });
    console.log('On menu management page');

    // Create new item via top-right Add Item
    console.log('Opening Add Item modal');
    await page.getByRole('button', { name: /Add Item/i }).click();
    await page.getByLabel('Item Name *').fill('Playwright Test Dish');
    await page.getByLabel('Category *').selectOption('specials');
    await page.getByLabel('Price (GHS) *').fill('12.50');
    await page.getByLabel('Stock quantity *').fill('20');
    await page.getByLabel('Description *').fill('Automated test item created by Playwright');
    await page.getByRole('button', { name: /Create Item/i }).click();

    // Wait for success toast
    await page.waitForSelector('text=Menu item created successfully', { timeout: 8000 });
    console.log('Item created');

    // Edit the created item via Edit Item selector
    await page.getByRole('button', { name: /Edit Item/i }).click();
    // Wait for select to populate
    await page.waitForSelector('select', { timeout: 5000 });
    // Select the option with our item
    const opts = await page.$$eval('select option', (options) => options.map((o) => ({ value: o.value, text: o.textContent })));
    const found = opts.find((o) => o.text.includes('Playwright Test Dish'));
    if (!found) throw new Error('Created item not found in edit selector');
    await page.selectOption('select', found.value);
    await page.getByRole('button', { name: /Edit selected/i }).click();
    await page.waitForSelector('text=Edit Menu Item', { timeout: 5000 });
    await page.getByLabel('Item Name *').fill('Playwright Test Dish (edited)');
    await page.getByRole('button', { name: /Update Item/i }).click();
    await page.waitForSelector('text=Menu item updated successfully', { timeout: 8000 });
    console.log('Item updated');

    // Delete the edited item via Delete Item selector
    await page.getByRole('button', { name: /Delete Item/i }).click();
    await page.waitForSelector('select', { timeout: 5000 });
    const opts2 = await page.$$eval('select option', (options) => options.map((o) => ({ value: o.value, text: o.textContent })));
    const found2 = opts2.find((o) => o.text.includes('Playwright Test Dish (edited)'));
    if (!found2) throw new Error('Edited item not found in delete selector');
    await page.selectOption('select', found2.value);
    // Click delete
    await page.getByRole('button', { name: /Delete selected/i }).click();
    // Confirm browser confirm handled by app, but we already check for success toast
    await page.waitForSelector('text=Menu item deleted successfully', { timeout: 8000 });
    console.log('Item deleted');

    console.log('Playwright UI smoke completed successfully');
  } catch (err) {
    console.error('Playwright UI smoke failed:', err.message || err);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
