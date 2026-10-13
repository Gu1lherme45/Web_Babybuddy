import { chromium, devices } from 'playwright';
const device = devices['iPhone 13'];
const browser = await chromium.launch({ headless: false, args: ['--window-position=80,60'] });
const context = await browser.newContext({ ...device });
const page = await context.newPage();
await page.goto('http://localhost:5173/', { waitUntil: 'load' });
await page.evaluate(() => document.querySelector('footer').scrollIntoView());
console.log('aberto e rolado até o footer');
