const { chromium } = require(process.argv[2] || 'playwright');
const assert = require('node:assert/strict');
const { mkdirSync } = require('node:fs');

async function main() {
  mkdirSync('.qa', { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' });
  const errors = [];
  const bg = page => page.locator('body').evaluate(el => getComputedStyle(el).backgroundColor);
  try {
    const context = await browser.newContext({ colorScheme: 'dark', viewport: { width: 1440, height: 1000 } });
    const page = await context.newPage();
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    assert.equal(await bg(page), 'rgb(21, 19, 27)', 'Follow dark system preference');
    await page.screenshot({ path: '.qa/dark-desktop.png', fullPage: true });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.getByRole('button', { name: 'Switch to dark mode' }).waitFor();
    assert.equal(await bg(page), 'rgb(250, 249, 246)', 'Follow a system preference change');
    const toggle = page.getByRole('button', { name: 'Switch to dark mode' });
    await toggle.focus();
    await page.keyboard.press('Space');
    await page.getByRole('button', { name: 'Switch to light mode' }).waitFor();
    assert.equal(await bg(page), 'rgb(21, 19, 27)', 'Keyboard toggle');
    assert.equal(await page.evaluate(() => localStorage.getItem('dotnetdevs-theme')), 'dark');
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await bg(page), 'rgb(21, 19, 27)', 'Persist dark override against light system');
    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: 900 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Dark overflow at ${width}`);
      await page.screenshot({ path: `.qa/dark-${width}.png`, fullPage: true });
    }
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.getByRole('button', { name: 'Switch to light mode' }).click();
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await bg(page), 'rgb(250, 249, 246)', 'Persist light override against dark system');
    const noJsContext = await browser.newContext({ javaScriptEnabled: false, colorScheme: 'dark', viewport: { width: 390, height: 844 } });
    const noJs = await noJsContext.newPage();
    await noJs.goto('http://localhost:3000');
    assert.equal(await bg(noJs), 'rgb(21, 19, 27)', 'Dark mode without JavaScript');
    assert.equal(await noJs.locator('.theme-toggle').isVisible(), false, 'No inert toggle without JavaScript');
    assert.equal(await noJs.locator('a.social-card').count(), 10);
    const blockedContext = await browser.newContext({ colorScheme: 'light' });
    await blockedContext.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage unavailable'); } }); });
    const blocked = await blockedContext.newPage();
    blocked.on('pageerror', error => errors.push(error.message));
    await blocked.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await blocked.getByRole('button', { name: 'Switch to dark mode' }).click();
    assert.equal(await bg(blocked), 'rgb(21, 19, 27)', 'Storage failures must not prevent toggling');
    assert.deepEqual(errors, [], 'No console or hydration errors');
    console.log('Theme checks passed: system defaults/changes, keyboard toggle, both saved overrides, mobile/tablet/desktop, no-JS dark mode, blocked storage, no browser errors.');
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exit(1); });
