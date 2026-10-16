# dotnetdevs.io

A static content hub for C# and .NET developers: The .NET Insider archive, a curated link library organized by topic, a sponsor page, and ten owner-confirmed social destinations.

## Local preview

Use Node 24 and the existing lockfile:

```sh
npm ci
npm run build
npm run preview
```

Open http://localhost:3000. The preview serves the actual production export from `out/`, bound to the local machine. Stop it with Ctrl+C. For editing with automatic refresh, use `npm run dev` instead (stop the preview first if both use port 3000).

This machine's `npm` PowerShell shim currently points to a missing global npm installation. The working alternative used during implementation is:

```powershell
node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" run build
node scripts/preview.mjs
```

`npm run dev:preview` opens a separate developer-only design mode at http://localhost:3001. Missing social URLs render as clearly marked, non-clickable samples there. Production builds always omit those samples. With all ten current URLs configured, all ten cards are real links in either mode.

## Edit content

`src/config/site.json` contains the brand, description, page title, canonical URL, newsletter copy and destination, social labels/URLs/order/enabled flags, header logo (`logo`), app icon (`icon`), sharing-image path, and optional contact destination.

- Add or edit a social URL using the exact HTTPS profile/channel destination.
- Change `order` to reorder links; lower numbers come first.
- Set `enabled` to `false` to hide a destination, or remove its entry.
- Set `url` to `null` or an empty string when unknown. It is omitted in production.
- New platform identifiers require a matching local SVG in `public/icons/`.
- Contact is optional. Set `contact.url` to a real HTTPS or mailto destination; never invent an address.
- Rebuild after configuration edits. Content and links are present in the exported HTML and work without JavaScript.

External destinations consistently open in the same tab. Cards are single links, with visible platform labels and decorative icons. No forms, accounts, or backend are needed. Google Analytics and Vercel Web Analytics run only on the canonical production hostname.

## Pages

| Route | Content source |
| --- | --- |
| `/` | Hero, newsletter card, latest issue, four most recent picks, social links |
| `/newsletter/` | `src/content/issues.json` (all published issues, linking to dotnet.news) |
| `/links/` and `/links/<topic>/` | `src/content/links.json`; topics are defined in `src/lib/content.ts` |
| `/guides/` and `/guides/<slug>/` | `src/content/guides.json`; each section lists URLs that must exist in `links.json` |
| `/posts/` | `src/content/posts.json`; card images live in `public/posts/` |
| `/sponsor/` | `src/content/media-kit.json`; contact from `site.json` |

Topic pages are generated only for topics that have at least one link. Everything is static; no client-side data fetching.

## Weekly update (after each Monday issue)

1. Add the new issue to the top of `src/content/issues.json`: `number`, `date` (send date, `YYYY-MM-DD`), `slug` (the part after `/p/` in the dotnet.news URL), Beehiiv `tags`, and an optional one-sentence `summary`.
2. Add each featured article to `src/content/links.json`: `title`, original `url`, `author` (or `null` if unknown; never guess), `issue`, one or more `topics` keys, and an optional `note`. Notes are dotnetdevs.io commentary and are labelled as such on the page. Leave out sponsor and ad placements.
3. Run `npm run build`. The export check fails if any issue or link is missing from the generated pages.

## Guides and posts

- A guide is an ordered reading path. Add one to `guides.json` with sections of library URLs; the build fails if a URL is not in `links.json`. Update `reviewed` / `reviewedLabel` whenever you revisit it.
- A post is a social card. Add the exported image to `public/posts/`, then an entry to `posts.json` with the source article, author and publish date. Write the summary only after reading the source article, and keep it clearly yours.

## Sponsor page figures

`src/content/media-kit.json` holds dated audience figures. Update `asOf`, `asOfLabel` and every figure together from a fresh snapshot; never mix dates. Channel totals overlap and must not be summed. No prices are published; rates are discussed by email.

## Design and assets

`src/app/globals.css` holds the proposed warm neutral/violet design and CSS variables. `src/components/CommunityPage.tsx` contains layout, and `BrandMark.tsx` contains the original code mark.

Light and dark palettes follow the visitor's system preference by default. The moon/sun button in the header saves an explicit choice in local storage. `ThemeToggle.tsx` handles that control; `src/lib/theme.ts` applies saved choices before paint. Without JavaScript, the page still follows the system theme and all destination links work. Clear the `dotnetdevs-theme` local-storage entry to resume automatic system preference after an override.

The supplied `NET devs` mark is stored unchanged at its original 500 × 500 resolution in `public/logo.png`. Both `logo` and `icon` reference this full square image. The header displays it at 80 × 80 pixels (64 × 64 on mobile), with CSS rounded corners and no crop. The sharing image also uses the full square logo. To replace it, put an appropriately licensed asset in `public/` and update those root-relative paths. The header uses the logo alone, with an accessible home-link label; text branding is a fallback when no logo is configured.

The glassmorphic treatment uses translucent cards, backdrop blur, fine edge highlights, and static violet/blue/pink background gradients in both themes. Browsers without backdrop blur use solid surfaces, as does the reduced-transparency preference. Background decoration does not animate.

The original sharing image is `public/social-card.png`, exactly 1200 × 630 pixels. Replace it with a PNG at those dimensions or change `sharingImage` and rebuild. Run `npm run assets` to regenerate the supplied typographic artwork from configuration. The generator has its own palette constants to update if changing the site colors; it intentionally does not overwrite custom assets during every build. See [asset sources](docs/ASSETS.md).

## Build and checks

```sh
npm run assets       # Only after changing branding / to regenerate the original artwork
npm run build        # Validates configuration, builds, typechecks/lints, verifies the export
npm run typecheck
npm run lint
npm run preview
```

Deploy **only `out/`**. Next.js static export is enabled, so no Next.js server is required. Do not deploy `.next/`, source files, or the archived prototype. A lightweight preview server is included; it is not intended as a public hosting service. The footer year is set at build time; rebuild in a new year.

Optional browser regression checks: `node scripts/verify-browser.cjs` uses an already installed Playwright, or takes its absolute package path as the first argument. It writes screenshots and a report to ignored `.qa/`; it does not install browser dependencies. See [verification results](docs/VERIFICATION.md).

## Hosting and domain

Search metadata, community JSON-LD, `/robots.txt`, `/sitemap.xml`, and `/llms.txt` are generated during the build. Preview builds are excluded from indexing automatically on Vercel. GA4 uses `googleAnalyticsId` in the content configuration. See [SEO and analytics setup](docs/SEO.md) for crawler policy, search-console verification/submission, environment variables, and checks.

Vercel is the current deployment target. Use the Next.js framework preset, install command `npm ci`, build command `npm run build`, and automatic output-directory setting. The configuration enables static export. Next.js and its ESLint configuration are pinned to 15.5.25 to address the vulnerable-version deployment block; commit the updated lockfile alongside `package.json`. [Deployment notes](docs/DEPLOYMENT.md) explain Vercel recovery and the alternative Cloudflare Pages/GitHub Pages setups.

The live canonical homepage, robots.txt, and sitemap.xml returned HTTP 200 on September 16, 2026. Deploy these latest local changes, then verify the production metadata and Analytics reception. Preserve all email and unrelated DNS records.

## Preserved work and handoff

The old app routes and README/config are in `archive/prototype/`; old components and mock data remain unused in `src/`. None of that content is public. [Implementation decisions](docs/DECISIONS.md) record the scope and URL provenance for future sessions.

All ten social destinations and the header logo were supplied by the owner. Established brand colors and an optional contact destination remain optional inputs.
