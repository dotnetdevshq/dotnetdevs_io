// Exercise the built site on virtual hostnames; no requests reach Google or production.
// node scripts/verify-analytics.cjs [absolute Playwright package path] [--preview]
const { chromium } = require(process.argv[2] || 'playwright');
const { readFile, stat } = require('node:fs/promises');
const { resolve, extname, sep } = require('node:path');
const assert = require('node:assert/strict');
const site = require('../src/config/site.json');

async function main() {
  const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' });
  const root = resolve('out');
  const canonicalHost = new URL(site.canonicalUrl).hostname;
  const preview = process.argv.includes('--preview');
  const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml', '.txt': 'text/plain' };
  try {
    for (const hostname of [canonicalHost, 'review.vercel.app', 'localhost']) {
      const context = await browser.newContext({ colorScheme: 'light' });
      const tagRequests = [], unexpected = [], errors = [];
      await context.route('**/*', async route => {
        const url = new URL(route.request().url());
        if (url.hostname === 'www.googletagmanager.com' && url.pathname === '/gtag/js') {
          tagRequests.push(url.href);
          return route.fulfill({ contentType: 'text/javascript', body: 'window.__googleTagStubLoaded = true;' });
        }
        if (url.hostname !== hostname) {
          unexpected.push(url.href);
          return route.abort();
        }
        let file = resolve(root, '.' + decodeURIComponent(url.pathname));
        assert(file === root || file.startsWith(root + sep));
        try {
          if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
          return route.fulfill({ contentType: types[extname(file)] || 'application/octet-stream', body: await readFile(file) });
        } catch {
          return route.fulfill({ status: 404, body: 'Not found' });
        }
      });
      const page = await context.newPage();
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(`https://${hostname}/`, { waitUntil: 'networkidle' });
      await page.getByRole('button', { name: 'Switch to dark mode' }).click();
      await page.getByRole('button', { name: 'Switch to light mode' }).click();
      const enabled = hostname === canonicalHost && !preview && !!site.googleAnalyticsId;
      const state = await page.evaluate(() => ({
        queue: (window.dataLayer || []).map(args => Array.from(args)),
        tags: document.querySelectorAll('script[src^="https://www.googletagmanager.com/gtag/js"]').length,
      }));
      assert.equal(tagRequests.length, enabled ? 1 : 0, `${hostname}: unexpected tag requests`);
      assert.equal(state.tags, enabled ? 1 : 0, `${hostname}: duplicate or unexpected loader`);
      if (enabled) {
        assert.equal(new URL(tagRequests[0]).searchParams.get('id'), site.googleAnalyticsId);
        assert.deepEqual(state.queue.filter(args => args[0] === 'config'), [['config', site.googleAnalyticsId]]);
        assert.equal(state.queue.filter(args => args[0] === 'js').length, 1);
        assert.equal(state.queue.filter(args => args[0] === 'event' && args[1] === 'page_view').length, 0, 'No duplicate manual page views');
      } else assert.deepEqual(state.queue, [], `${hostname}: analytics must stay inactive`);
      assert.deepEqual(unexpected, [], 'No live analytics or other external traffic');
      assert.deepEqual(errors, [], 'No browser errors');
      await context.close();
    }
    console.log(`Analytics checks passed (${preview ? 'preview excluded' : 'production enabled'}): correct ID, one initialization, no review/local tracking, no real analytics requests.`);
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exit(1); });
