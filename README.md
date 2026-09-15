# dotnetdevs.io

A static community link page for C#, .NET, and the developer ecosystem, with The .NET Insider newsletter and ten owner-confirmed social destinations.

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

External destinations consistently open in the same tab. Cards are single links, with visible platform labels and decorative icons. No forms, accounts, analytics, or backend are needed.

## Design and assets

`src/app/globals.css` holds the proposed warm neutral/violet design and CSS variables. `src/components/CommunityPage.tsx` contains layout, and `BrandMark.tsx` contains the original code mark.

Light and dark palettes follow the visitor's system preference by default. The moon/sun button in the header saves an explicit choice in local storage. `ThemeToggle.tsx` handles that control; `src/lib/theme.ts` applies saved choices before paint. Without JavaScript, the page still follows the system theme and all destination links work. Clear the `dotnetdevs-theme` local-storage entry to resume automatic system preference after an override.

The supplied `NET devs` mark is stored unchanged at its original 500 × 500 resolution in `public/logo.png`. Both `logo` and `icon` reference this full square image. The header displays it at 64 × 64 pixels (56 × 56 on mobile), with CSS rounded corners and no crop. The sharing image also uses the full square logo. To replace it, put an appropriately licensed asset in `public/` and update those root-relative paths. The text `dotnetdevs.io` wordmark remains visible beside the logo.

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

Vercel is the current deployment target. Use the Next.js framework preset, install command `npm ci`, build command `npm run build`, and automatic output-directory setting. The configuration enables static export. Next.js and its ESLint configuration are pinned to 15.5.25 to address the vulnerable-version deployment block; commit the updated lockfile alongside `package.json`. [Deployment notes](docs/DEPLOYMENT.md) explain Vercel recovery and the alternative Cloudflare Pages/GitHub Pages setups.

The owner attempted a Vercel deployment; successful publication and DNS have not been verified here. Deploy the updated commit and review the assigned deployment before attaching `dotnetdevs.io`. Preserve all email and unrelated DNS records.

## Preserved work and handoff

The old app routes and README/config are in `archive/prototype/`; old components and mock data remain unused in `src/`. None of that content is public. [Implementation decisions](docs/DECISIONS.md) record the scope and URL provenance for future sessions.

All ten social destinations and the header logo were supplied by the owner. Established brand colors and an optional contact destination remain optional inputs.
