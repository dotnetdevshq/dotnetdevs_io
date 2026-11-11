import { site, socialLinks, isIndexable } from '@/lib/site';
import { playbook, playbookPages, repositoryUrl } from '@/lib/playbook';
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
    `- [${playbook.title}](${page('/playbook/')}): ${playbook.description}`,
    ...playbookPages.map(layer => `- [${layer.title}](${page(`/playbook/${layer.slug}/`)}): ${layer.description}`),
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
    // The playbook as question and answer, so answer engines can quote the short answer and cite the page.
    `## ${playbook.title}`,
    '',
    `${playbook.lead} Covers ${playbook.dotnet}. Reviewed ${playbook.reviewedLabel}. Template repository: ${repositoryUrl}`,
    '',
    ...playbookPages.flatMap(layer => [
      `### ${layer.question}`,
      `${layer.answer} Full rules: ${page(`/playbook/${layer.slug}/`)}`,
      ...layer.takeaways.map(takeaway => `- ${takeaway}`),
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
