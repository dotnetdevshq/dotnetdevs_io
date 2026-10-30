import issuesData from '@/content/issues.json';
import linksData from '@/content/links.json';
import mediaKitData from '@/content/media-kit.json';
import guidesData from '@/content/guides.json';
import postsData from '@/content/posts.json';
import { site } from '@/lib/site';

export type Issue = { number: number; date: string; slug: string; tags: string[]; summary?: string };
export type CuratedLink = {
  title: string; url: string; author: string | null; issue: number; topics: string[]; note: string | null;
};

// Editorial topics for the link library. The key is the URL slug under /links/.
export const topics: Record<string, { label: string; description: string }> = {
  releases: { label: '.NET releases', description: 'Previews, release candidates, servicing updates and what changed in each.' },
  csharp: { label: 'C#', description: 'Language features, new syntax and practical C# techniques.' },
  'aspnet-core': { label: 'ASP.NET Core', description: 'Web APIs, Blazor, middleware, authentication and hosting.' },
  data: { label: 'Data & EF Core', description: 'EF Core, SQL, concurrency and working with data in .NET.' },
  aspire: { label: 'Aspire', description: 'Building, running and deploying distributed apps with Aspire.' },
  ai: { label: 'AI, agents & MCP', description: 'Building AI features, agents and MCP servers with .NET.' },
  tooling: { label: 'Tooling', description: 'Visual Studio, VS Code, the .NET CLI, NuGet and developer workflow.' },
  testing: { label: 'Testing', description: 'MSTest, xUnit, test strategy and testing what you ship.' },
  architecture: { label: 'Architecture', description: 'Design patterns, domain modelling and code quality.' },
  performance: { label: 'Performance', description: 'Runtime performance, Native AOT and trimming.' },
  security: { label: 'Security', description: 'Authentication, tokens, supply chain and security updates.' },
  observability: { label: 'Observability', description: 'Logging, tracing, metrics and diagnostics for .NET apps.' },
  clients: { label: 'MAUI & desktop', description: 'Cross-platform and Windows client apps with .NET MAUI, WinUI and WinForms.' },
};

export const issues: Issue[] = [...issuesData].sort((a, b) => b.number - a.number);
export const links: CuratedLink[] = [...(linksData as CuratedLink[])].sort((a, b) => b.issue - a.issue);
export const mediaKit = mediaKitData;
export const latestIssue = issues[0];

export const issueUrl = (issue: Issue) => new URL(`/p/${issue.slug}`, site.newsletter.url).href;
export const issueByNumber = (n: number) => issues.find(issue => issue.number === n);
export const linksForTopic = (topic: string) => links.filter(link => link.topics.indexOf(topic) !== -1);
// Only topics that have at least one link get a page, so no empty topic pages are published.
export const activeTopics = Object.keys(topics).filter(topic => linksForTopic(topic).length > 0);

export function sourceName(url: string): string {
  const host = new URL(url).hostname.replace(/^www\./, '');
  if (host === 'devblogs.microsoft.com') {
    const blog = new URL(url).pathname.split('/')[1];
    const blogs: Record<string, string> = { dotnet: '.NET Blog', visualstudio: 'Visual Studio Blog', aspire: 'Aspire Blog', devops: 'Azure DevOps Blog', commandline: 'Windows Command Line Blog' };
    return blogs[blog] || 'Microsoft Dev Blogs';
  }
  return host;
}

// Dates are formatted in UTC at build time so output never depends on the build machine's locale.
export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

export const pageUrl = (path: string) => new URL(path, site.canonicalUrl).href;

export type GuideSection = { title: string; intro: string; links: string[] };
export type Guide = {
  slug: string; title: string; seoTitle?: string; description: string; about?: string[];
  reviewed: string; reviewedLabel: string; intro: string; sections: GuideSection[];
};
export const guides: Guide[] = guidesData;
export const guideBySlug = (slug: string) => guides.find(guide => guide.slug === slug);
export const linkByUrl = (url: string) => links.find(link => link.url === url);
// Rendered by scripts/render-brand-assets.mjs; one 1200 × 630 card per guide.
export const guideImagePath = (guide: Guide) => `/og/guides/${guide.slug}.png`;

export type Post = {
  slug: string; title: string; image: string; imageAlt: string; topics: string[];
  source: { title: string; url: string; author: string; published: string };
  summary: string; caveats?: string;
};
export const posts: Post[] = postsData;
