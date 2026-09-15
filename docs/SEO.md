# Search and AI discovery

The site exports its homepage, metadata, and structured data as HTML. Crawlers do not need JavaScript to read the community description, newsletter, or official social links. Content and entity details come from `src/config/site.json`.

## Public endpoints

- `/robots.txt`: allows all crawlers on production and advertises the canonical sitemap. This includes Googlebot, Bingbot, OAI-SearchBot, and PerplexityBot under the wildcard rule. Rendering assets are crawlable too. The existing broad training-crawler policy is unchanged; AI search access and model-training access are separate controls.
- `/sitemap.xml`: lists only `https://dotnetdevs.io/`, the site's one canonical content page. External social links, the external newsletter, the 404 page, and machine-readable files are excluded. There is no invented `lastmod` date or search-priority claim.
- `/llms.txt`: a concise Markdown summary and directory generated from the same configuration. It is an optional convenience based on the [llms.txt proposal](https://llmstxt.org/), not a standardized ranking signal or a guarantee of citations. A `rel="describedby"` link advertises it in the HTML head.

The homepage has Organization, WebSite, and WebPage JSON-LD with stable canonical IDs, the original logo, and the owner's official social URLs in `sameAs`. Its newsletter reference matches visible page content. It does not invent reviews, members, addresses, authors, update dates, or FAQ answers. The homepage canonical is page-specific, so the 404 does not inherit it or the community JSON-LD.

## Indexing controls

Production metadata allows indexing, following, unlimited text snippets, and large image previews. `VERCEL_ENV=preview`, `SITE_NOINDEX=1`, or a non-production Cloudflare branch switches the export to noindex metadata, a disallow-all robots file, an empty sitemap, and a preview-only llms.txt notice. Analytics is also omitted from these builds. Rebuild when changing these settings; the output is static.

The local preview server always sends `X-Robots-Tag: noindex, nofollow` even when serving the production export. That header is local-only. Robots rules are not access control, and blocking crawling can prevent bots from reading noindex; use deployment protection for private previews. If a URL is already indexed, allow it to be crawled with noindex until removal is processed.

## After deploying

1. Deploy the updated commit to Vercel Production. Confirm `/`, `/robots.txt`, `/sitemap.xml`, and `/llms.txt` return 200 with their correct HTML/text/XML content types. Check that the homepage has no noindex meta/header and that unknown paths return an actual 404.
2. Keep `https://dotnetdevs.io/` as the canonical domain. Configure HTTP and `www` redirects in Vercel's domain settings; do not serve competing copies. Preserve existing email and other DNS records.
3. Verify the domain in Google Search Console and Bing Webmaster Tools. DNS verification can cover the domain; optional HTML verification uses the build-time values `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION`. Supply only the real verification token, then rebuild. Empty values emit no tags.
4. Submit `https://dotnetdevs.io/sitemap.xml` in both tools and request homepage indexing. Account verification and sitemap submissions have not been performed by this code change.
5. Check the deployed URL with Google's URL Inspection and Rich Results Test or Schema.org Validator. Organization/WebSite markup helps describe identity; it does not imply an eligible rich-result feature or guaranteed appearance.
6. If crawler logs show challenges or denied requests, inspect the hosting firewall. Allow legitimate search crawlers using their providers' verified identity/IP guidance, rather than trusting arbitrary user-agent strings. No firewall rules have been changed here.
7. Track actual indexing, relevant queries, and referrals. Broader visibility requires useful original content and external references over time; adding metadata to a link page cannot substitute for that content.

## Google Analytics

The owner-supplied GA4 ID is `G-FJLBMHRY60`, configured as `googleAnalyticsId` in `src/config/site.json`. The Google tag is loaded asynchronously after hydration with Next.js Script. It queues the standard `js` and `config` commands once per document. The config command enables Google's default page-view measurement; no additional page-view event is sent.

Analytics runs only in indexable production builds and only when the browser hostname matches the canonical domain. Localhost and Vercel review hostnames do not load the remote tag or create analytics events. Set the ID to an empty string to disable it. The browser verification intercepts Google's script request and checks the command queue without sending test visits to Google. After deployment, verify reception in GA4 Realtime or [Tag Assistant](https://tagassistant.google.com/); local testing does not confirm account-side ingestion.

## Verification

Every `npm run build` runs `scripts/check-seo.mjs` against the actual export: metadata, graph relationships, real social links, robots, canonical sitemap, llms.txt, 404 exclusions, and analytics presence/absence. Both preview and production modes must pass. Browser regression checks cover visible content without JavaScript and responsive layouts. `scripts/verify-analytics.cjs` checks production initialization, duplicate prevention, and exclusion of review/local hosts using intercepted requests.

## References checked September 16, 2026

- [Google AI features and your website](https://developers.google.com/search/docs/appearance/ai-features): ordinary SEO fundamentals remain applicable; no special AI markup/file is required and indexing is not guaranteed.
- [Google Organization structured data](https://developers.google.com/search/docs/appearance/structured-data/organization): identity, logo, and external profiles.
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap): canonical URLs and submission.
- [OpenAI crawler documentation](https://developers.openai.com/api/docs/bots): OAI-SearchBot serves search discovery; GPTBot is a separate training control.
- [Perplexity crawler documentation](https://docs.perplexity.ai/docs/resources/perplexity-crawlers): crawler access and verified IP guidance.
- [Bing Webmaster Guidelines](https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a): search and AI grounding fundamentals.
- [Google tag setup](https://developers.google.com/tag-platform/gtagjs): standard initialization and verification.
