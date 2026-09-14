import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
const config = JSON.parse(readFileSync('src/config/site.json', 'utf8'));
const html = readFileSync('out/index.html', 'utf8');
const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
assert(html.includes(`href="${escape(config.newsletter.url)}"`), 'Newsletter missing from HTML');
for (const link of config.socials) {
  const active = link.enabled && !!link.url;
  if (active) assert(html.includes(`href="${escape(link.url)}"`), `${link.id} missing from HTML`);
  else assert(!html.includes(`class="platform-icon platform-${link.id}"`), `${link.id} should be omitted`);
}
for (const token of ['href="#"', 'Local design preview', 'social-sample', 'mockJobs', '1,200+', 'Featured Jobs']) assert(!html.includes(token), `Unexpected production content: ${token}`);
assert(html.includes(`rel="canonical" href="${escape(config.canonicalUrl)}"`), 'Canonical missing');
assert(html.includes(new URL(config.sharingImage, config.canonicalUrl).href), 'Sharing image URL missing');
for (const file of ['404.html', 'robots.txt', 'sitemap.xml', 'favicon.svg', 'logo.png', 'logo-lockup.png', 'social-card.png', 'apple-touch-icon.png']) assert(existsSync(`out/${file}`), `Missing ${file}`);
for (const route of ['jobs', 'creators', 'blog', 'tools', 'roadmaps']) assert(!existsSync(`out/${route}`), `Prototype route exported: ${route}`);
const png = readFileSync('out/social-card.png');
assert.equal(png.readUInt32BE(16), 1200); assert.equal(png.readUInt32BE(20), 630);
console.log('Export verified: static links, metadata, 1200×630 sharing image, assets, and no prototype or preview content.');
