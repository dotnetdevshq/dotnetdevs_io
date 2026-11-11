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
for (const route of ['newsletter', 'links', 'sponsor', 'guides', 'playbook', 'posts', 'about', 'privacy', 'terms']) {
  assert(existsSync(`out/${route}/index.html`), `Missing page: /${route}/`);
  const page = readFileSync(`out/${route}/index.html`, 'utf8');
  assert(page.includes(`rel="canonical" href="${new URL(`/${route}/`, config.canonicalUrl).href}"`), `/${route}/ canonical missing`);
  assert.equal([...page.matchAll(/<h1\b/g)].length, 1, `/${route}/ needs one h1`);
}
const links = JSON.parse(readFileSync('src/content/links.json', 'utf8'));
const library = readFileSync('out/links/index.html', 'utf8');
for (const link of links) assert(library.includes(`href="${escape(link.url)}"`), `Link library missing ${link.url}`);
const issues = JSON.parse(readFileSync('src/content/issues.json', 'utf8'));
const archive = readFileSync('out/newsletter/index.html', 'utf8');
for (const issue of issues) assert(archive.includes(`/p/${issue.slug}`), `Archive missing issue ${issue.number}`);
const guides = JSON.parse(readFileSync('src/content/guides.json', 'utf8'));
const linkUrls = new Set(links.map(link => link.url));
for (const guide of guides) {
  const page = readFileSync(`out/guides/${guide.slug}/index.html`, 'utf8');
  for (const section of guide.sections) for (const url of section.links) {
    assert(linkUrls.has(url), `Guide ${guide.slug} references a URL missing from links.json: ${url}`);
    assert(page.includes(`href="${escape(url)}"`), `Guide ${guide.slug} page missing ${url}`);
  }
}
// Playbook: every layer page is exported, shows each rule section of its snapshot files,
// and only names a check as a test when one of the synced rule files names it too.
const playbook = JSON.parse(readFileSync('src/content/playbook.json', 'utf8'));
const rules = JSON.parse(readFileSync('src/content/playbook-rules.json', 'utf8'));
assert.equal(rules.repository, playbook.repository, 'Playbook snapshot is from a different repository');
const playbookHub = readFileSync('out/playbook/index.html', 'utf8');
const allRules = Object.values(rules.files).join('\n');
for (const layer of playbook.pages) {
  const path = `out/playbook/${layer.slug}/index.html`;
  assert(existsSync(path), `Missing page: /playbook/${layer.slug}/`);
  const page = readFileSync(path, 'utf8');
  assert.equal([...page.matchAll(/<h1\b/g)].length, 1, `/playbook/${layer.slug}/ needs one h1`);
  assert(playbookHub.includes(`href="/playbook/${layer.slug}/"`), `Playbook hub does not link to ${layer.slug}`);
  const text = layer.sources.map(source => {
    assert(rules.files[source.path], `Playbook snapshot missing ${source.path}: run node scripts/sync-playbook.mjs`);
    assert(page.includes(`href="https://github.com/${rules.repository}/blob/${rules.commit}/${source.path}"`), `/playbook/${layer.slug}/ does not link to ${source.path} at the snapshot commit`);
    return rules.files[source.path];
  }).join('\n');
  const headings = [...text.matchAll(/^## (.+)$/gm)].map(match => match[1].replaceAll('&', '&amp;'));
  for (const heading of headings) assert(page.includes(`>${heading}</h3>`), `/playbook/${layer.slug}/ is missing the rule section "${heading}"`);
  for (const check of layer.enforcedBy) if (check.test) assert(allRules.includes(check.name), `/playbook/${layer.slug}/ names the test ${check.name}, which no synced rule file mentions`);
}
const posts = JSON.parse(readFileSync('src/content/posts.json', 'utf8'));
const postsPage = readFileSync('out/posts/index.html', 'utf8');
for (const post of posts) {
  assert(existsSync(`out${post.image}`), `Missing post image ${post.image}`);
  assert(postsPage.includes(`href="${escape(post.source.url)}"`), `Posts page missing source for ${post.slug}`);
}
console.log('Export verified: static links, metadata, 1200×630 sharing image, assets, and no prototype or preview content.');
