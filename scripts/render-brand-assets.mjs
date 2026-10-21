// Renders the raster brand assets from public/brand/mark.svg with an installed Playwright.
// Usage: node scripts/render-brand-assets.mjs [absolute path to the playwright package]
import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require(process.argv[2] || 'playwright');
const site = JSON.parse(readFileSync('src/config/site.json', 'utf8'));
const mark = readFileSync('public/brand/mark.svg', 'utf8');
const markUri = `data:image/svg+xml;base64,${Buffer.from(mark).toString('base64')}`;
const font = `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'DejaVu Sans', sans-serif`;
const pages = {
  'logo.png': [500, 500, `<img src="${markUri}" width="500" height="500">`],
  'apple-touch-icon.png': [180, 180, `<div style="width:180px;height:180px;background:#6341b5"><img src="${markUri}" width="180" height="180" style="border-radius:0"></div>`],
  'logo-lockup.png': [880, 200, `<div style="display:flex;align-items:center;gap:36px;height:200px;padding:0 36px;background:#faf9f6;font-family:${font}"><img src="${markUri}" width="128" height="128"><span style="font-size:76px;font-weight:700;letter-spacing:-3px;color:#272331">${site.brand}</span></div>`],
  'social-card.png': [1200, 630, `<div style="width:1200px;height:630px;box-sizing:border-box;padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between;font-family:${font};color:#272331;background:#faf9f6 radial-gradient(ellipse at 15% 0%,#e9dffa 0%,rgba(250,249,246,0) 60%)">
    <div style="display:flex;align-items:center;gap:20px"><img src="${markUri}" width="84" height="84"><span style="font-size:38px;font-weight:700;letter-spacing:-1px">${site.brand}</span></div>
    <div><div style="font-size:84px;font-weight:750;letter-spacing:-3.5px;line-height:1.04;max-width:960px">${site.tagline.replace(/-/g, "\u2011")}</div>
    <div style="margin-top:26px;font-size:30px;color:#625b6e">${site.newsletter.title} · curated links · reading guides</div></div>
  </div>`],
};
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
for (const [name, [width, height, body]] of Object.entries(pages)) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(`<!doctype html><html><body style="margin:0;background:transparent">${body}</body></html>`);
  await page.screenshot({ path: `public/${name}`, omitBackground: name === 'logo.png' });
  await page.close();
  console.log(`Rendered public/${name} (${width}×${height})`);
}
await browser.close();
