import type { Metadata } from 'next';
import { site } from '@/lib/site';

type PageMetaOptions = {
  // A page-specific 1200 × 630 sharing image; defaults to the site card.
  image?: { path: string; alt: string };
  // Pages with a real review date are shared as articles with that modified time.
  modified?: string;
};

// Next.js replaces (not merges) openGraph/twitter objects from the root layout,
// so every subpage rebuilds them here with the shared sharing image.
export function pageMetadata(path: string, title: string, description: string, options: PageMetaOptions = {}): Metadata {
  const url = new URL(path, site.canonicalUrl).href;
  const image = {
    url: new URL(options.image?.path ?? site.sharingImage, site.canonicalUrl).href, width: 1200, height: 630,
    alt: options.image?.alt ?? `${site.name}: ${site.newsletter.title}`,
  };
  const fullTitle = `${title} | ${site.name}`;
  const openGraph = options.modified
    ? { type: 'article' as const, modifiedTime: options.modified }
    : { type: 'website' as const };
  return {
    title: fullTitle, description,
    alternates: { canonical: url },
    openGraph: { ...openGraph, locale: 'en_US', url, siteName: site.name, title: fullTitle, description, images: [image] },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [{ url: image.url, alt: image.alt }] },
  };
}
