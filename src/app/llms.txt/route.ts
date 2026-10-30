import { site, socialLinks, isIndexable } from '@/lib/site';
import { issues, issueUrl, topics, activeTopics, guides, linkByUrl, type CuratedLink } from '@/lib/content';

export const dynamic = 'force-static';

const page = (path: string) => new URL(path, site.canonicalUrl).href;

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
    `- [Posts](${page('/posts/')}): Visual explainers from our social channels, with links to the original articles.`,
    `- [Sponsor](${page('/sponsor/')}): Audience figures and sponsorship options.`,
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
