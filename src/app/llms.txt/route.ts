import { site, socialLinks, isIndexable } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
  const content = isIndexable ? [
    `# ${site.name}`,
    '',
    `> ${site.description}`,
    '',
    '## Website',
    `- [${site.name}](${site.canonicalUrl}): Community homepage and official links.`,
    '',
    '## Newsletter',
    `- [${site.newsletter.title}](${site.newsletter.url}): ${site.newsletter.description}`,
    '',
    '## Official community channels',
    ...socialLinks.map(link => `- [${link.label}](${link.url})`),
    '',
  ].join('\n') : '# Preview deployment\n\nThis deployment is not intended for indexing.\n';

  return new Response(content, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
