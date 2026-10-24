// House rules for the built site:
// 1. No em-dashes in our own copy or in any page's <title> and meta tags.
//    (Curated article titles are the authors' words and are left as written.)
// 2. Every link that leaves dotnetdevs.io opens in a new tab.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import assert from 'node:assert/strict';

const site = JSON.parse(readFileSync('src/config/site.json', 'utf8'));
const siteHost = new URL(site.canonicalUrl).hostname;
const EM = '—';

const walk = (dir, ext) => readdirSync(dir).flatMap(name => {
  const path = join(dir, name);
  return statSync(path).isDirectory() ? walk(path, ext) : ext.some(e => path.endsWith(e)) ? [path] : [];
});

for (const file of [...walk('src/app', ['.ts', '.tsx']), ...walk('src/components', ['.tsx']), ...walk('src/lib', ['.ts']), 'src/config/site.json', 'src/content/guides.json', 'src/content/posts.json']) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, i) => assert(!line.includes(EM), `Em-dash in ${file}:${i + 1}. Use a comma, colon, or period instead.`));
}

for (const file of walk('out', ['.html'])) {
  const html = readFileSync(file, 'utf8');
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '';
  assert(!title.includes(EM) && !title.includes('&mdash;'), `Em-dash in <title> of ${file}`);
  for (const [tag] of html.matchAll(/<meta\s[^>]*>/g)) assert(!tag.includes(EM) && !tag.includes('&mdash;'), `Em-dash in meta tag of ${file}: ${tag}`);
  for (const [tag] of html.matchAll(/<a\s[^>]*>/g)) {
    const href = tag.match(/href="([^"]*)"/)?.[1];
    if (!href || !/^https?:\/\//.test(href) || new URL(href.replace(/&amp;/g, '&')).hostname === siteHost) continue;
    assert(/\starget="_blank"/.test(tag) && /\srel="[^"]*noopener/.test(tag), `External link without target="_blank" in ${file}: ${tag}`);
  }
}
console.log('Copy and link checks passed.');
