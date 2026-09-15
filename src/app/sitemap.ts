import type { MetadataRoute } from 'next';
import { site, isIndexable } from '@/lib/site';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  // Only real, canonical, indexable pages belong here. Avoid fabricated lastmod dates.
  return isIndexable ? [{ url: site.canonicalUrl }] : [];
}
