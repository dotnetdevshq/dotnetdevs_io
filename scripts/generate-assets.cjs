// Deterministic, original typographic artwork; uses Next's bundled image renderer.
const { ImageResponse } = require('next/og');
const { createElement: h } = require('react');
const { writeFileSync, readFileSync } = require('node:fs');
const site = require('../src/config/site.json');
const logoData = `data:image/png;base64,${readFileSync('public/logo.png').toString('base64')}`;
const el = (tag, style, ...children) => h(tag, { style }, ...children);
async function save(name, element, width, height) {
  const response = new ImageResponse(element, { width, height });
  writeFileSync(`public/${name}`, Buffer.from(await response.arrayBuffer()));
}
async function main() {
  const card = el('div', { width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: '#faf9f6', color: '#272331', padding: '60px 70px' },
    el('div', { display: 'flex', alignItems: 'center', gap: 18, borderBottom: '1px solid #e6e2e9', paddingBottom: 26 },
      h('img', { src: logoData, width: 80, height: 80, style: { objectFit: 'contain', borderRadius: 20 } }),
      el('div', { fontSize: 28, fontWeight: 700 }, site.brand)),
    el('div', { display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'space-between' },
      el('div', { display: 'flex', flexDirection: 'column', width: 700 },
        el('div', { fontSize: 18, color: '#6341b5', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 18 }, site.eyebrow),
        el('div', { fontSize: 78, fontWeight: 700, letterSpacing: -4, lineHeight: 1.1 }, site.brand),
        el('div', { fontSize: 26, color: '#706a79', marginTop: 24, maxWidth: 660, lineHeight: 1.5 }, site.description)),
      el('div', { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#6341b5', color: 'white', width: 250, height: 295, padding: 25, borderRadius: 12, transform: 'rotate(-7deg)' },
        el('div', { fontSize: 13, letterSpacing: 2 }, 'THE INSIDER'),
        el('div', { display: 'flex', flexDirection: 'column', fontSize: 72, fontWeight: 700, letterSpacing: -4 }, '.NET', el('div', { fontSize: 30, fontWeight: 400, letterSpacing: 0 }, 'INSIDER')),
        el('div', { borderTop: '1px solid #ac94ce', paddingTop: 14, fontSize: 12, letterSpacing: 2 }, 'C# / .NET / DEV'))),
    el('div', { display: 'flex', borderTop: '1px solid #e6e2e9', paddingTop: 24, color: '#6341b5', fontSize: 20 }, site.newsletter.title));
  await save('social-card.png', card, 1200, 630);
  await save('apple-touch-icon.png', el('div', { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#6341b5', color: 'white', fontSize: 88, borderRadius: 42 }, '</>'), 180, 180);
  console.log('Generated social-card.png (1200×630) and apple-touch-icon.png (180×180).');
}
main().catch(error => { console.error(error); process.exit(1); });
