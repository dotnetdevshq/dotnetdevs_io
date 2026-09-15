# Deployment preparation

The owner's initial Vercel deployment was blocked by Next.js 15.3.5; the security upgrade below resolved the local dependency issue. On September 16, 2026, live HTTP checks returned 200 for the canonical homepage, robots.txt, and sitemap.xml, with no X-Robots-Tag header. This does not verify deployment of subsequent local changes or search-engine indexing. No DNS changes were made here.

## Vercel deployment recovery

Next.js and `eslint-config-next` are pinned to 15.5.25, with the updated dependency graph in `package-lock.json`. This exceeds the 15.5.24 patch identified in the [August 2026 Next.js security release](https://nextjs.org/blog/august-2026-security-release). React 18 remains compatible; no application migration or security bypass is needed.

1. Commit and push both `package.json` and `package-lock.json` to the connected production branch, `main`. Deploy the new commit; redeploying the old failed commit will retain its vulnerable dependency.
2. Keep Vercel's **Next.js** framework preset. Use `npm ci` for installation and `npm run build` as the build command so the repository's configuration and export checks run. Keep the framework's automatic output-directory setting. `next.config.js` already enables static export to `out/`.
3. Confirm the new build log reports Next.js 15.5.25 and finishes successfully. Check the homepage, full rounded logo, theme toggle, newsletter, and all ten social links on the assigned deployment URL.
4. `VERCEL_ENV=preview` now excludes Vercel previews from indexing automatically. `SITE_NOINDEX=1` is an optional explicit override; leave it unset in Production. See `docs/SEO.md` for sitemap submission and GA4 verification after deployment. Cloudflare's `public/_headers` file is not a Vercel header configuration.

References: [Next.js on Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs), [Next.js static exports](https://nextjs.org/docs/app/guides/static-exports).

## Hosting choice

Vercel is the owner's current deployment target. The following comparison documents the previously proposed alternatives. The output is a static Next.js export, so no Workers runtime, backend, secrets, or paid database are required.

| Need | Cloudflare Pages | GitHub Pages |
| --- | --- | --- |
| Static `out/` deployment | Supported | Supported with Actions |
| Custom domain and HTTPS | Supported | Supported |
| Review deployments | Per-branch previews; preview responses get `X-Robots-Tag: noindex` | No equivalent built-in per-PR previews |
| Relevant limits | Free: 500 builds/month, 20,000 files, 25 MiB per asset | Published site up to 1 GB; soft 100 GB monthly bandwidth |
| DNS implications | Apex requires a Cloudflare DNS zone | Can retain the current DNS provider |

These limits are ample for this small page. GitHub Pages restricts sites primarily facilitating commercial transactions or commercial SaaS; this informational community page has neither. Reassess the host if its purpose changes.

Sources checked September 15, 2026: [Cloudflare limits](https://developers.cloudflare.com/pages/platform/limits/), [Cloudflare previews](https://developers.cloudflare.com/pages/configuration/preview-deployments/), [Cloudflare custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/), [GitHub limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits), [GitHub custom domains and HTTPS](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Cloudflare Pages setup

1. Review the local page, commit the project, and connect its repository to a new **Pages** project using Git integration. This requires the owner's authorization/account access.
2. Select production branch `main`. Use build command `npm run build`, output directory `out`, and repository root as the root directory. Use the static Next.js preset or no framework preset; do not select an SSR adapter. The `.node-version` file selects Node 24. `public/_headers` supplies static response headers.
3. Set `SITE_PRODUCTION_BRANCH=main` if using our branch detection; update that value if changing production branches. Set `SITE_NOINDEX=1` in preview environment variables as an explicit extra safeguard. Leave it unset in production. The build generates noindex metadata and a disallowing robots file for staging. Local previews also send a noindex HTTP header. Search exclusion is not access control; enable Cloudflare Access if previews must be private.
4. Review the assigned `pages.dev` deployment first. Once approved, add `dotnetdevs.io` in the project's Custom domains section. Use the actual project hostname and nameservers supplied by Cloudflare; none are guessed in this repository.
5. To use the apex domain, add its zone to Cloudflare. Before changing nameservers, export and compare the existing DNS zone. Preserve MX, SPF/TXT, DKIM selectors, DMARC, verification records, CAA, and every unrelated service. Verify imported records before switching nameservers at the registrar. Mail host records should keep the DNS/proxy settings required by the mail provider.
6. Let Pages create the apex record and wait for domain validation and the managed certificate to become active. Inspect existing CAA records if certificate issuance is blocked; change only the relevant records with approval.
7. Add `www.dotnetdevs.io` to the same Pages project and provision HTTPS for it too. Configure a permanent redirect from `www.dotnetdevs.io` to `https://dotnetdevs.io`, preserving the path and query string. Follow [Cloudflare's www-to-apex procedure](https://developers.cloudflare.com/pages/how-to/www-redirect/). Set a host-specific redirect for the assigned production `pages.dev` hostname once the custom domain works; leave branch previews accessible.
8. Enable HTTP-to-HTTPS redirection. Verify HTTP and HTTPS for apex and `www`, canonical metadata, favicon, sharing image, sitemap, and every outbound link. Confirm production responses do not contain a noindex header or meta tag. Confirm preview responses do.

Reference: [Cloudflare static Next.js deployment](https://developers.cloudflare.com/pages/framework-guides/nextjs/deploy-a-static-nextjs-site/).

## If choosing GitHub Pages instead

Use an Actions workflow to run `npm ci`, `npm run build`, upload `out/` with `actions/upload-pages-artifact`, and deploy with `actions/deploy-pages`. Set Pages' custom domain to `dotnetdevs.io`. The included `.nojekyll` allows underscore-prefixed asset directories for branch-based hosting too. For a custom Actions workflow the domain is set in repository settings; a CNAME file is unnecessary.

Get the apex A/AAAA or ALIAS/ANAME values from the current GitHub documentation linked above, and set `www` to the exact account/organization Pages hostname shown by GitHub (without the repository path). Configure both apex and `www`, then enable **Enforce HTTPS** after the certificate is ready. GitHub redirects `www` to the configured apex automatically. Preserve existing email/unrelated DNS records. A repository subpath preview needs `basePath`; the prepared build targets the requested custom-domain root.

## Static output boundaries

Deploy only `out/`, not the source checkout, `archive/`, `.next/`, or `node_modules/`. Do not run `next start` for this static export. `npm run preview` is a local-only review server. Rebuild after changing configuration; year and metadata are fixed at build time. Regenerate the sharing image with `npm run assets` after changing branding.
