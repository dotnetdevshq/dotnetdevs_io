import { site, socialLinks } from '@/lib/site';
import legal from '@/content/legal.json';
import { guideImagePath, linkByUrl, type CuratedLink, type Guide } from '@/lib/content';
import { playbook, playbookPages, repositoryUrl, sourceUrl, type PlaybookPage } from '@/lib/playbook';

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
      founder: { '@id': id('founder') },
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

const founder = {
  '@type': 'Person', '@id': id('founder'), name: legal.owner,
  jobTitle: 'Software engineer', knowsAbout: ['C#', '.NET', 'ASP.NET Core', 'Entity Framework Core', 'Aspire'],
  homeLocation: { '@type': 'Place', name: `${legal.city}, ${legal.country}` },
};

// The About page names the person behind the brand and links back to the homepage entities.
export const aboutStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage', '@id': `${new URL('/about/', site.canonicalUrl).href}#webpage`,
      name: `About ${site.brand}`, url: new URL('/about/', site.canonicalUrl).href, inLanguage: 'en',
      isPartOf: { '@id': id('website') }, about: { '@id': id('organization') }, mainEntity: { '@id': id('founder') },
    },
    { ...founder, worksFor: { '@id': id('organization') } },
  ],
};

// A guide is a curated, ordered reading list: a CollectionPage whose main entity is
// the list of linked articles, credited to their authors where the library knows them.
// It refers back to the homepage graph by @id instead of repeating the organization.
export function guideStructuredData(guide: Guide) {
  const url = new URL(`/guides/${guide.slug}/`, site.canonicalUrl).href;
  const items = guide.sections.flatMap(section => section.links.map(linkByUrl)
    .filter((link): link is CuratedLink => !!link)
    .map(link => ({ link, section: section.title })));
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage', '@id': `${url}#webpage`,
        name: guide.seoTitle ?? guide.title, headline: guide.title, url,
        description: guide.description, abstract: guide.intro, inLanguage: 'en',
        dateModified: guide.reviewed,
        isPartOf: { '@id': id('website') }, publisher: { '@id': id('organization') },
        breadcrumb: { '@id': `${url}#breadcrumb` }, mainEntity: { '@id': `${url}#reading-list` },
        primaryImageOfPage: { '@type': 'ImageObject', url: new URL(guideImagePath(guide), site.canonicalUrl).href, width: 1200, height: 630 },
        ...(guide.about?.length ? { about: guide.about.map(name => ({ '@type': 'Thing', name })), keywords: guide.about.join(', ') } : {}),
      },
      {
        '@type': 'ItemList', '@id': `${url}#reading-list`,
        name: `${guide.title}: reading order`, itemListOrder: 'https://schema.org/ItemListOrderAscending',
        numberOfItems: items.length,
        itemListElement: items.map(({ link, section }, i) => ({
          '@type': 'ListItem', position: i + 1,
          item: {
            '@type': 'Article', name: link.title, url: link.url, about: section,
            ...(link.author ? { author: { '@type': 'Person', name: link.author } } : {}),
          },
        })),
      },
      {
        '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: site.name, item: site.canonicalUrl },
          { '@type': 'ListItem', position: 2, name: 'Guides', item: new URL('/guides/', site.canonicalUrl).href },
          { '@type': 'ListItem', position: 3, name: guide.title, item: url },
        ],
      },
    ],
  };
}

const playbookUrl = new URL('/playbook/', site.canonicalUrl).href;
const playbookAuthor = { '@type': 'Person', '@id': id('founder'), name: legal.owner, url: new URL('/about/', site.canonicalUrl).href };
const playbookCrumbs = [
  { '@type': 'ListItem', position: 1, name: site.name, item: site.canonicalUrl },
  { '@type': 'ListItem', position: 2, name: 'Playbook', item: playbookUrl },
];

// The playbook hub: a collection whose parts are the layer pages, based on the public template repository.
export function playbookHubStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage', '@id': `${playbookUrl}#webpage`,
        name: playbook.seoTitle, headline: playbook.title, url: playbookUrl,
        description: playbook.description, abstract: playbook.lead, inLanguage: 'en',
        dateModified: playbook.reviewed, author: playbookAuthor,
        isPartOf: { '@id': id('website') }, publisher: { '@id': id('organization') },
        breadcrumb: { '@id': `${playbookUrl}#breadcrumb` },
        about: playbook.about.map(name => ({ '@type': 'Thing', name })), keywords: playbook.about.join(', '),
        isBasedOn: { '@type': 'SoftwareSourceCode', name: playbook.repository, codeRepository: repositoryUrl, programmingLanguage: 'C#', license: 'https://opensource.org/license/mit' },
        hasPart: playbookPages.map(page => ({ '@id': `${new URL(`/playbook/${page.slug}/`, site.canonicalUrl).href}#article` })),
      },
      { '@type': 'BreadcrumbList', '@id': `${playbookUrl}#breadcrumb`, itemListElement: playbookCrumbs },
    ],
  };
}

// A layer page: a technical article that answers one question, credited to its author,
// with the review date shown on the page and the rule files it is based on.
export function playbookPageStructuredData(page: PlaybookPage) {
  const url = new URL(`/playbook/${page.slug}/`, site.canonicalUrl).href;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle', '@id': `${url}#article`,
        name: page.seoTitle, headline: page.title, url, mainEntityOfPage: url,
        description: page.description, abstract: page.answer, inLanguage: 'en',
        dateModified: page.reviewed, author: playbookAuthor,
        publisher: { '@id': id('organization') },
        isPartOf: { '@id': `${playbookUrl}#webpage` },
        breadcrumb: { '@id': `${url}#breadcrumb` },
        about: page.about.map(name => ({ '@type': 'Thing', name })), keywords: page.about.join(', '),
        isBasedOn: page.sources.map(source => ({ '@type': 'SoftwareSourceCode', name: source.path, url: sourceUrl(source.path), codeRepository: repositoryUrl })),
      },
      {
        '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`,
        itemListElement: [...playbookCrumbs, { '@type': 'ListItem', position: 3, name: page.shortTitle, item: url }],
      },
    ],
  };
}

// Keep editable text from breaking out of the JSON-LD script element.
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
