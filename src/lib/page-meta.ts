import type { Metadata } from 'next';
import { site } from '@/lib/site';

// Next.js replaces (not merges) openGraph/twitter objects from the root layout,
// so every subpage rebuilds them here with the shared sharing image.
export function pageMetadata(path: string, title: string, description: string): Metadata {
  const url = new URL(path, site.canonicalUrl).href;
  const image = { url: new URL(site.sharingImage, site.canonicalUrl).href, width: 1200, height: 630, alt: `${site.name}: ${site.newsletter.title}` };
  const fullTitle = `${title} | ${site.name}`;
  return {
    title: fullTitle, description,
    alternates: { canonical: url },
    openGraph: { type: 'website', locale: 'en_US', url, siteName: site.name, title: fullTitle, description, images: [image] },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [{ url: image.url, alt: image.alt }] },
  };
}
