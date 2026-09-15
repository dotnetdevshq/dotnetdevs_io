import { site, socialLinks } from '@/lib/site';

const id = (fragment: string) => new URL(`#${fragment}`, site.canonicalUrl).href;

// Describe only the community and content actually presented on the homepage.
export const communityStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization', '@id': id('organization'),
      name: site.name, alternateName: site.brand,
      url: site.canonicalUrl, description: site.description,
      ...(site.logo ? { logo: new URL(site.logo, site.canonicalUrl).href } : {}),
      sameAs: socialLinks.map(link => link.url),
    },
    {
      '@type': 'WebSite', '@id': id('website'),
      name: site.name, alternateName: site.brand, url: site.canonicalUrl,
      description: site.description, inLanguage: 'en',
      publisher: { '@id': id('organization') },
    },
    {
      '@type': 'WebPage', '@id': id('webpage'),
      name: site.title, url: site.canonicalUrl, description: site.description,
      inLanguage: 'en', isPartOf: { '@id': id('website') },
      about: { '@id': id('organization') },
      primaryImageOfPage: {
        '@type': 'ImageObject', url: new URL(site.sharingImage, site.canonicalUrl).href,
        width: 1200, height: 630,
      },
      mentions: {
        '@type': 'CreativeWork', name: site.newsletter.title,
        url: site.newsletter.url, description: site.newsletter.description,
      },
    },
  ],
};

// Keep editable text from breaking out of the JSON-LD script element.
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
