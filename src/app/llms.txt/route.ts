import { site, socialLinks, isIndexable } from '@/lib/site';
import { issues, issueUrl, topics, activeTopics } from '@/lib/content';

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
    `- [Sponsor](${page('/sponsor/')}): Audience figures and sponsorship options.`,
    '',
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
