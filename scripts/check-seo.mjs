import { readFileSync } from 'node:fs';
import assert from 'node:assert/strict';

const site = JSON.parse(readFileSync('src/config/site.json', 'utf8'));
const html = readFileSync('out/index.html', 'utf8');
const robots = readFileSync('out/robots.txt', 'utf8');
const sitemap = readFileSync('out/sitemap.xml', 'utf8');
const llms = readFileSync('out/llms.txt', 'utf8');
const preview = process.env.SITE_NOINDEX === '1' || process.env.VERCEL_ENV === 'preview'
  || (process.env.CF_PAGES === '1' && !!process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== (process.env.SITE_PRODUCTION_BRANCH || 'main'));
const decode = value => value.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const meta = new Map([...html.matchAll(/<meta\s+[^>]*>/g)].map(([tag]) => {
  const name = tag.match(/(?:name|property)="([^"]+)"/)?.[1];
  const content = tag.match(/content="([^"]*)"/)?.[1];
  return [name, content === undefined ? undefined : decode(content)];
}));
assert.equal(decode(html.match(/<title>([^<]+)<\/title>/)?.[1] || ''), site.title);
assert.equal(meta.get('description'), site.description);
assert.equal(meta.get('og:url'), site.canonicalUrl);
assert.equal(meta.get('og:site_name'), site.name);
assert.equal(meta.get('twitter:card'), 'summary_large_image');
assert.equal(meta.get('og:image'), new URL(site.sharingImage, site.canonicalUrl).href);
assert.equal(meta.get('twitter:image:alt'), `${site.name} — ${site.newsletter.title}`);
assert.match(html, /<html[^>]*lang="en"/);
assert.equal([...html.matchAll(/<h1\b/g)].length, 1, 'One clear primary heading');
assert(html.includes(site.description), 'Entity description must be visible in server-rendered content');
assert.equal(meta.get('google-site-verification'), process.env.GOOGLE_SITE_VERIFICATION || undefined);
assert.equal(meta.get('msvalidate.01'), process.env.BING_SITE_VERIFICATION || undefined);

const scripts = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
assert.equal(scripts.length, 1, 'Exactly one JSON-LD graph on the homepage');
const schema = JSON.parse(scripts[0][1]);
assert.equal(schema['@context'], 'https://schema.org');
const graph = schema['@graph'];
assert.equal(graph.length, 3);
const entity = type => graph.find(node => node['@type'] === type);
const org = entity('Organization'), website = entity('WebSite'), page = entity('WebPage');
assert.equal(org.name, site.name);
assert.equal(org.url, site.canonicalUrl);
assert.equal(org.logo, site.logo ? new URL(site.logo, site.canonicalUrl).href : undefined);
const socials = site.socials.filter(link => link.enabled && link.url).sort((a, b) => a.order - b.order);
assert.deepEqual(org.sameAs, socials.map(link => link.url));
assert.equal(website.publisher['@id'], org['@id']);
assert.equal(page.isPartOf['@id'], website['@id']);
assert.equal(page.about['@id'], org['@id']);
assert.equal(page.mentions.url, site.newsletter.url);
assert.equal(page.mentions.name, site.newsletter.title);
assert.equal(page.description, site.description);
assert.equal(new Set(graph.map(node => node['@id'])).size, 3);

assert.match(robots, /^User-Agent: \*$/mi);
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => decode(match[1]));
assert.match(sitemap, /xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9"/);
assert(!sitemap.includes('<lastmod>'), 'Do not publish invented modification dates');
if (preview) {
  assert(!html.includes('googletagmanager.com/gtag/js'), 'Preview must not load analytics');
  assert.match(meta.get('robots'), /\bnoindex\b/);
  assert.match(robots, /^Disallow: \/$/m);
  assert(!/^Allow:/m.test(robots), 'Preview must not allow a specific search bot');
  assert(!/^Sitemap:/m.test(robots), 'Preview must not advertise a sitemap');
  assert.deepEqual(locations, []);
  assert(!llms.includes(site.newsletter.url));
} else {
  if (site.googleAnalyticsId) {
    assert(html.includes(site.googleAnalyticsId), 'Production analytics measurement ID missing');
    assert(html.includes('googletagmanager.com/gtag/js'), 'Production analytics loader missing');
  }
  assert.match(meta.get('robots'), /\bindex, follow\b/);
  assert.match(meta.get('robots'), /max-image-preview:large/);
  assert.match(meta.get('robots'), /max-snippet:-1/);
  assert(!/noindex|nosnippet|noarchive|noai/.test(meta.get('robots')));
  assert.match(robots, /^Allow: \/$/m);
  assert(!/^Disallow:\s*\S+/m.test(robots), 'Production crawlers and rendering assets must remain accessible');
  assert(robots.includes(`Sitemap: ${new URL('sitemap.xml', site.canonicalUrl).href}`));
  assert.deepEqual(locations, [site.canonicalUrl]);
  for (const url of [site.canonicalUrl, site.newsletter.url, ...socials.map(link => link.url)]) assert(llms.includes(url), `llms.txt missing ${url}`);
  assert(llms.includes(site.description));
}
const notFound = readFileSync('out/404.html', 'utf8');
assert.match(notFound, /name="robots" content="noindex"/);
assert(!notFound.includes('application/ld+json'), '404 must not describe itself as the community homepage');
assert(!notFound.includes('rel="canonical"'), '404 must not claim the homepage canonical');
console.log(`SEO verified (${preview ? 'preview: excluded' : 'production: indexable'}): metadata, JSON-LD, robots, sitemap, llms.txt, and 404.`);
