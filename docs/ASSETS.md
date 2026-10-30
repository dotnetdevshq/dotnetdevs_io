# Asset sources

- The brand mark is the `<·>` symbol (a dot inside code brackets, white on the violet tile), chosen by the owner in October 2026. Its source is `public/brand/mark.svg`; `public/favicon.svg` is a copy, and `src/components/LogoMark.tsx` inlines the same paths for the header.
- `public/logo.png` (500 × 500), `public/apple-touch-icon.png` (180 × 180), `public/logo-lockup.png` and `public/social-card.png` (1200 × 630) are rendered from the mark by `scripts/render-brand-assets.mjs` (`npm run assets`), which needs an installed Playwright: `node scripts/render-brand-assets.mjs <path to playwright package>`. The sharing image uses `tagline` from `src/config/site.json`.
- Each guide has a 1200 × 630 sharing image at `public/og/guides/<slug>.png`, rendered by the same script from `src/content/guides.json` (title, step titles, first three `about` topics). Set `ASSETS_ONLY=og/` to render only these and leave the brand assets untouched.
- Platform SVGs are vendored from Simple Icons 11.15.0: `https://cdn.jsdelivr.net/npm/simple-icons@11.15.0/icons/{id}.svg`. License: `public/icons/LICENSE.md` (CC0). Platform marks belong to their respective owners; their use labels destinations and does not imply endorsement.
- Lucide icons use the existing `lucide-react` dependency (ISC license).
