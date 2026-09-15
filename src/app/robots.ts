import type { MetadataRoute } from 'next';
import { site, isIndexable } from '@/lib/site';
export const dynamic = 'force-static';
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable) return { rules: { userAgent: '*', disallow: '/' } };
  // The wildcard permits search and AI search crawlers, including OAI-SearchBot
  // and PerplexityBot, without blocking the CSS/JS required to render the page.
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: new URL('sitemap.xml', site.canonicalUrl).href,
  };
}
