// Optional verification using an installed Playwright; no project dependency needed.
// node scripts/verify-browser.cjs [absolute path to a Playwright package]
const { chromium } = require(process.argv[2] || 'playwright');
const { mkdirSync, writeFileSync } = require('node:fs');
const assert = require('node:assert/strict');
const config = require('../src/config/site.json');
async function main() {
  mkdirSync('.qa', { recursive: true });
  const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' });
  const report = { sizes: [], errors: [], failedRequests: [], keyboard: [], links: [] };
  try {
    const page = await browser.newPage();
    page.on('pageerror', error => report.errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error') report.errors.push(message.text()); });
    page.on('requestfailed', req => report.failedRequests.push(req.url()));
    page.on('response', res => { if (res.status() >= 400) report.errors.push(`${res.status()} ${res.url()}`); });
    await page.addInitScript(() => {
      window.__layoutShift = 0;
      new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__layoutShift += entry.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    for (const [name, width, height] of [['mobile', 390, 844], ['narrow', 320, 740], ['tablet', 768, 1024], ['desktop', 1440, 1000]]) {
      await page.setViewportSize({ width, height });
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
      await page.locator('.footer').scrollIntoViewIfNeeded();
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({ path: `.qa/${name}.png`, fullPage: true });
      const metrics = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, shifts: window.__layoutShift, badImages: [...document.images].filter(i => !i.complete || i.naturalWidth === 0).map(i => i.src), smallLinks: [...document.querySelectorAll('a:not(.skip-link)')].filter(a => a.getBoundingClientRect().height < 44).map(a => a.textContent) }));
      assert(metrics.scrollWidth <= width, `${name} horizontal overflow`);
      assert.equal(metrics.badImages.length, 0, `${name} missing images`);
      assert.equal(metrics.smallLinks.length, 0, `${name} small tap targets`);
      assert.equal(metrics.shifts, 0, `${name} layout shifts`);
      report.sizes.push({ name, ...metrics });
    }
    report.links = await page.locator('a').evaluateAll(links => links.map(a => ({ label: a.textContent.trim(), href: a.getAttribute('href'), target: a.getAttribute('target') })));
    const expected = config.socials.filter(l => l.enabled && l.url).sort((a, b) => a.order - b.order).map(l => l.url);
    assert.deepEqual(await page.locator('a.social-card').evaluateAll(links => links.map(a => a.getAttribute('href'))), expected);
    assert(report.links.every(l => !l.target), 'Inconsistent new-tab behavior');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    for (let i = 0; i < expected.length + 4; i++) {
      await page.keyboard.press('Tab');
      report.keyboard.push(await page.evaluate(() => ({ label: document.activeElement.textContent.trim(), href: document.activeElement.getAttribute('href'), visibleFocus: document.activeElement.matches(':focus-visible'), outline: getComputedStyle(document.activeElement).outlineStyle })));
    }
    assert.equal(report.keyboard[0].label, 'Skip to content');
    assert(report.keyboard.every(item => item.visibleFocus && item.outline === 'solid'), 'Missing keyboard focus outline');
    await page.screenshot({ path: '.qa/keyboard-focus.png', fullPage: true });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'main', 'Skip link must move focus to main');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), '200% text overflow');
    await page.screenshot({ path: '.qa/text-zoom.png', fullPage: true });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    assert.equal(await page.locator('.newsletter-card').evaluate(el => getComputedStyle(el).transitionDuration), '0s');
    const noJsContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const noJs = await noJsContext.newPage();
    await noJs.goto('http://localhost:3000');
    assert.equal(await noJs.locator('a.social-card').count(), expected.length);
    assert.equal(await noJs.locator('.newsletter-card').getAttribute('href'), config.newsletter.url);
    await noJs.locator('.footer').scrollIntoViewIfNeeded();
    await noJs.screenshot({ path: '.qa/no-javascript.png', fullPage: true });
    // Intercept only the test navigation, to confirm the actual click target without depending on third-party access.
    await noJs.route(config.newsletter.url + '/**', route => route.fulfill({ contentType: 'text/plain', body: 'Verified newsletter navigation target.' }));
    await noJs.route(config.newsletter.url, route => route.fulfill({ contentType: 'text/plain', body: 'Verified newsletter navigation target.' }));
    await noJs.locator('.newsletter-card').click();
    assert.equal(new URL(noJs.url()).origin, new URL(config.newsletter.url).origin);
    report.noJavaScript = 'All links present; newsletter click navigates to the configured origin (intercepted).';
    assert.equal(report.errors.length, 0, 'Browser errors');
    assert.equal(report.failedRequests.length, 0, 'Failed requests');
    writeFileSync('.qa/browser-report.json', JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exit(1); });
