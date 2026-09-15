# Verification — September 15, 2026

## Completed

- Initially restored the existing locked dependencies with `npm ci` after the previous installation was found to be missing Next.js type files. The later security upgrade is documented below.
- `npm run build`: successful. Includes configuration validation, Next compilation, lint/type checks, static generation, and export assertions. Only the homepage, 404, robots, and sitemap routes are exported. The old prototype is not public.
- `npm run typecheck`: successful.
- Production export served at `http://localhost:3000` and inspected in headless Google Chrome through the bundled Playwright.
- Screenshots reviewed at 320px narrow mobile, 390px mobile, 768px tablet, and 1440px desktop. No horizontal overflow, clipped content, or missing images in these checks. All link targets were at least 44px high. The layout-shift observer recorded zero for each tested navigation; this is a local measurement, not field performance data.
- Tab order: skip link, brand home link, theme toggle, newsletter, then all ten channels in configured order. All focused controls had visible solid outlines. External links consistently open in the same tab.
- 200% text enlargement at 390px: no horizontal overflow; labels and newsletter action wrap. Reduced-motion emulation disables transitions.
- JavaScript-disabled browser: newsletter and all ten social anchors render. The newsletter click reaches its configured origin. That click was intercepted for a deterministic navigation check, rather than relying on an external website response.
- No browser console errors, page errors, failed requests, or missing local assets in the production check.
- Confirmed exact owner-supplied URLs in exported anchors, canonical/OG/X metadata, homepage sitemap, robots, favicon, and sharing image. The sharing PNG is exactly 1200 × 630 pixels and was visually inspected.
- The supplied `NET devs` logo was visually inspected at source resolution. Following the owner's correction, the header and sharing image use the full original square with rounded corners, with no cropping. The source remains 500 × 500 and is also used for the favicon/app icon.
- Configuration smoke checks cover null/empty URLs, disabled links, order, invalid schemes, production exclusion of design samples, and staging/noindex detection.
- Production output contains no mock jobs, invented audience counts, inactive social samples, or placeholder destination anchors. The functional `#main` skip target is intentional.

## External URL verification limits

The newsletter homepage at [dotnet.news](https://dotnet.news) loaded through the web tool and identified The .NET Insider. All ten social URLs were supplied by the owner and retained exactly. Automated fetches could not establish remote account availability:

| Platform | Automated result |
| --- | --- |
| LinkedIn | robots.txt denied automated access |
| X | HTTP 403 |
| Facebook, Instagram, TikTok, YouTube | Fetch tool cache miss |
| Threads | Fetch error |
| Bluesky, Telegram, WhatsApp | Tool safety/fetch restriction |

These outcomes do not show that the links are broken. Check the profiles/channels in a normal signed-in browser before launch. No account ownership was inferred from a status code.

## Reproduction and remaining scope

Run `npm run build`, then `npm run preview`. With Playwright and Chrome installed, run `node scripts/verify-browser.cjs`; an absolute Playwright package path may be supplied as the first argument. `PLAYWRIGHT_CHANNEL=edge` can select an installed Edge browser. Reports/screenshots go to ignored `.qa/`. The implementation session used the bundled Playwright package and Chrome.

Next reports approximately 113 kB of first-load JavaScript after the security upgrade. The page remains functional without it; most is the retained framework's runtime. A small theme initializer and toggle are the only custom client behavior. No trackers, external fonts, or network data fetching were added. No Lighthouse score or screen-reader certification is claimed.

## Vercel security upgrade follow-up

Updated Next.js and `eslint-config-next` from 15.3.5 to 15.5.25. React/React DOM remain 18.3.1. Updated PostCSS to 8.5.28 with a scoped Next.js override, and Nano ID to 3.3.19. Next.js generated a route-types reference in `next-env.d.ts` during the build.

- The final `npm run build` passed compilation, lint/type checks, static generation, and export assertions with the updated dependencies.
- `npm audit --omit=dev` reported zero vulnerabilities. This result covers production dependencies and does not claim that development dependencies were audited.
- `npm ci --dry-run --ignore-scripts --no-audit --no-fund --offline` accepted the updated lockfile structure. A fresh remote install on Vercel remains to be verified.
- Both existing browser scripts passed against the final production export: responsive widths, links, keyboard navigation, text enlargement, JavaScript-disabled behavior, dark system defaults, saved overrides, and blocked storage. No browser errors were reported. The dark mobile screenshot was visually reviewed.
- The Next.js 15.5.25 development server started, served the homepage, and passed a browser theme-toggle check without page errors.
- SHA-256 checks confirm `public/logo.png` is still identical to the owner's original file. It displays uncropped with rounded corners.

The deployment fix is local. Push the updated manifest and lockfile, then verify a Vercel deployment of that new commit. The failed old commit still contains Next.js 15.3.5.

## Original dark mode verification

The final build and browser regression checks passed after adding dark mode. `scripts/verify-theme.cjs` checks dark system defaults, live system changes, keyboard switching, persistence of both overrides against the opposite system preference, dark layouts at 320/390/768/1440px, CSS dark mode with JavaScript disabled, and graceful behavior when local storage is blocked. No browser or hydration errors were observed. Dark desktop and mobile screenshots were visually reviewed. Saved overrides are applied by an inline head script before paint. No dependencies were added.

The build emitted an old Browserslist-data advisory from the existing lockfile; it did not block compilation or browser checks. Hosted HTTPS, redirects, social-card fetching at the production URL, and actual provider preview noindex headers can only be checked after a deployment exists. No publication or DNS changes were made.
