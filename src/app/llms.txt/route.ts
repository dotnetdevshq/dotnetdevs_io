import { site, socialLinks, isIndexable } from '@/lib/site';
import legal from '@/content/legal.json';
import { issues, issueUrl, topics, activeTopics, guides, writtenGuides, linkByUrl, type CuratedLink } from '@/lib/content';

export const dynamic = 'force-static';

const page = (path: string) => new URL(path, site.canonicalUrl).href;
// Written-guide text uses **bold** and `code` markers; llms.txt gets the words without them.
const strip = (text: string) => text.replace(/\*\*|`/g, '');

export function GET() {
  const content = isIndexable ? [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    '## Website',
    `- [${site.name}](${site.canonicalUrl}): Community homepage, latest issue and recent picks.`,
    `- [Newsletter archive](${page('/newsletter/')}): Every issue of ${site.newsletter.title}.`,
    `- [Link library](${page('/links/')}): Curated articles and releases featured in ${site.newsletter.title}, with author credit.`,
    ...activeTopics.map(topic => `- [${topics[topic].label} links](${page(`/links/${topic}/`)}): ${topics[topic].description}`),
    ...guides.map(guide => `- [${guide.title}](${page(`/guides/${guide.slug}/`)}): ${guide.description}`),
    ...writtenGuides.map(guide => `- [${guide.title}](${page(`/guides/${guide.slug}/`)}): ${guide.description}`),
    `- [Posts](${page('/posts/')}): Visual explainers from our social channels, with links to the original articles.`,
    `- [Sponsor](${page('/sponsor/')}): Audience figures and sponsorship options.`,
    `- [About](${page('/about/')}): Who runs the site, how articles are chosen and credited, and how sponsored content is labeled.`,
    `- [Privacy and cookies](${page('/privacy/')}): What personal data the site uses and why.`,
    `- [Terms of use](${page('/terms/')}): Terms for using the site and its curated links.`,
    '',
    // Each guide's reading order, so answer engines can cite the right step and the original article.
    ...guides.flatMap(guide => [
      `## Guide: ${guide.title}`,
      '',
      `${guide.intro} Reviewed ${guide.reviewedLabel}. Full guide: ${page(`/guides/${guide.slug}/`)}`,
      '',
      ...guide.sections.flatMap((section, i) => [
        `### Step ${i + 1}: ${section.title}`,
        section.intro,
        ...section.links.map(linkByUrl).filter((link): link is CuratedLink => !!link)
          .map(link => `- [${link.title}](${link.url})${link.author ? ` by ${link.author}` : ''}`),
        '',
      ]),
    ]),
    // Written guides: the section outline and sources, so answer engines can cite the right section.
    ...writtenGuides.flatMap(guide => [
      `## Guide: ${guide.title}`,
      '',
      `${guide.intro} By ${legal.owner}. Updated ${guide.reviewedLabel}. Full guide: ${page(`/guides/${guide.slug}/`)}`,
      '',
      '### Key takeaways',
      ...guide.takeaways.map(item => `- ${strip(item)}`),
      '',
      '### Sections',
      ...guide.sections.map((section, i) => `- ${i + 1}. [${section.title}](${page(`/guides/${guide.slug}/#${section.id}`)})`),
      '',
      ...guide.sections.flatMap(section => section.blocks.flatMap(block => 'faq' in block ? [
        '### Frequently asked questions',
        ...block.faq.flatMap(item => [`Q: ${item.q}`, `A: ${strip(item.a)}`, '']),
      ] : [])),
      '### Sources',
      ...guide.sources.map(source => `- [${source.title}](${source.url}), ${source.publisher}`),
      '',
    ]),
    '## Newsletter',
    `- [${site.newsletter.title}](${site.newsletter.url}): ${site.newsletter.description}`,
    ...issues.slice(0, 5).map(issue => `- [Issue ${issue.number}](${issueUrl(issue)})`),
    '',
    '## Official community channels',
    ...socialLinks.map(link => `- [${link.label}](${link.url})`),
    '',
  ].join('\n') : '# Preview deployment\n\nThis deployment is not intended for indexing.\n';

  return new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
