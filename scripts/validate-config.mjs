import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
const config = JSON.parse(readFileSync('src/config/site.json', 'utf8'));
const https = value => { try { const u = new URL(value); return u.protocol === 'https:' && !!u.hostname && !u.username && !u.password && value === value.trim(); } catch { return false; } };
for (const field of ['brand', 'name', 'description', 'title', 'eyebrow', 'socialHeading', 'socialDescription']) assert(typeof config[field] === 'string' && config[field].trim(), `${field} must be nonempty text`);
assert(https(config.canonicalUrl) && config.canonicalUrl.endsWith('/'), 'canonicalUrl must be an absolute HTTPS URL ending in /');
assert(!config.googleAnalyticsId || /^G-[A-Z0-9]+$/.test(config.googleAnalyticsId), 'googleAnalyticsId must be a GA4 measurement ID or empty');
assert(https(config.newsletter.url), 'newsletter.url must be an absolute HTTPS URL');
for (const field of ['title', 'description', 'label', 'eyebrow']) assert(config.newsletter[field]?.trim(), `newsletter.${field} is required`);
const seen = new Set();
for (const link of config.socials) {
  assert(/^[a-z]+$/.test(link.id) && !seen.has(link.id), `Invalid or duplicate platform id: ${link.id}`);
  seen.add(link.id);
  assert(existsSync(`public/icons/${link.id}.svg`), `Missing icon for ${link.id}`);
  assert(typeof link.label === 'string' && link.label.trim(), `Missing label for ${link.id}`);
  assert(Number.isFinite(link.order) && typeof link.enabled === 'boolean', `Invalid order/enabled for ${link.id}`);
  assert(link.url == null || link.url === '' || https(link.url), `Invalid URL for ${link.id}`);
}
assert(!config.contact.url || https(config.contact.url) || /^mailto:[^\s@]+@[^\s@]+$/.test(config.contact.url), 'Invalid contact URL');
for (const asset of [config.logo, config.icon, config.sharingImage].filter(Boolean)) assert(/^\/[a-zA-Z0-9/_ .-]+$/.test(asset) && !asset.includes('..') && existsSync(`public${asset}`), `Missing or invalid local asset: ${asset}`);
console.log(`Configuration valid: ${config.socials.filter(link => link.enabled && link.url).length} configured social destinations.`);
