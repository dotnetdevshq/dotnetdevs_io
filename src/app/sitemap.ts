import type { MetadataRoute } from 'next';
import { site, isIndexable } from '@/lib/site';
import { activeTopics, guides } from '@/lib/content';
export const dynamic = 'force-static';

// Every real, canonical, indexable page. Paths end in "/" to match trailingSlash: true.
const sitePaths = ['/', '/newsletter/', '/links/', ...activeTopics.map(topic => `/links/${topic}/`), '/guides/', ...guides.map(guide => `/guides/${guide.slug}/`), '/posts/', '/sponsor/'];

export default function sitemap(): MetadataRoute.Sitemap {
  // Avoid fabricated lastmod dates.
  return isIndexable ? sitePaths.map(path => ({ url: new URL(path, site.canonicalUrl).href })) : [];
}
