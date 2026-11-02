import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SiteChrome } from '@/components/SiteChrome';
import { pageMetadata } from '@/lib/page-meta';
import { site, socialLinks, externalProps, validDestination } from '@/lib/site';
import { issues, links, guides, formatDate } from '@/lib/content';
import { aboutStructuredData, serializeJsonLd } from '@/lib/seo';
import legal from '@/content/legal.json';

const description = `Who runs ${site.brand} and ${site.newsletter.title}, how articles are chosen and credited, and how sponsored content is labeled.`;

export const metadata: Metadata = pageMetadata('/about/', `About ${site.brand}`, description);

export default function AboutPage() {
  const first = issues[issues.length - 1];
  const email = validDestination(site.contact.url, true) ? site.contact.url!.replace(/^mailto:/, '') : null;
  return <SiteChrome current="/about/">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(aboutStructuredData) }} />
    <div className="container page">
      <article className="prose" aria-labelledby="page-title">
        <p className="eyebrow">About</p>
        <h1 id="page-title">About {site.brand}</h1>
        <p className="lead">{site.brand} is the home of {site.newsletter.title} and the .NET Developers community channels. It helps C# and .NET developers keep up with what changed in the ecosystem, why it matters, and what they can do with it.</p>

        <h2 id="who">Who runs it</h2>
        <p>{site.brand} is run by {legal.owner}, a software engineer in {legal.city}, {legal.country}, who works primarily with C# and .NET. He selects the articles, writes the summaries and guides, and runs the community channels. It is an independent project, not affiliated with Microsoft.</p>

        <h2 id="what">What you will find here</h2>
        <ul>
          <li><Link href="/newsletter/">{site.newsletter.title}</Link>: a roundup of .NET news, practical articles and developer tools, with {issues.length} issues since {formatDate(first.date)}.</li>
          <li><Link href="/links/">The library</Link>: {links.length} articles featured in the newsletter, organized by topic and credited to their authors.</li>
          <li><Link href="/guides/">Reading guides</Link>: {guides.length} step-by-step reading orders through a single topic.</li>
          <li><Link href="/posts/">Posts</Link>: visual explainers from our social channels, each linked to the original article.</li>
        </ul>

        <h2 id="editorial">Editorial and sponsorship policy</h2>
        <h3>How articles are chosen</h3>
        <p>Articles are picked for practical value: real changes in .NET, ASP.NET Core, EF Core, Aspire, cloud and AI development, and techniques developers can apply. We read articles before summarizing them and check version-specific details against the original.</p>
        <h3>Credit to authors</h3>
        <p>Every link goes to the original article and names its author where we know it. Summaries describe the author&apos;s work in our own words. Our opinions appear as labeled notes, kept separate from what the author wrote. Authors can ask for a correction or removal at any time.</p>
        <h3>Sponsored content</h3>
        <p>Sponsors help keep {site.brand} free. Sponsored placements in the newsletter and on social channels are always labeled as sponsored, and sponsor placements are not added to the article library. Audience figures shared with sponsors on the <Link href="/sponsor/">sponsor page</Link> come from platform dashboards and carry the date they were collected.</p>

        <h2 id="contact">Contact and channels</h2>
        <p>{email ? <>Write to <a href={`mailto:${email}`}>{email}</a> for questions, corrections or sponsorships. </> : null}Follow along on {socialLinks.map((link, i) => <span key={link.id}>{i > 0 && (i === socialLinks.length - 1 ? ' and ' : ', ')}<a href={link.url} {...externalProps(link.url)}>{link.label}</a></span>)}.</p>
        <p><a className="button" href={site.newsletter.subscribeUrl} {...externalProps(site.newsletter.subscribeUrl)}>Subscribe to {site.newsletter.title}<ArrowRight size={18} aria-hidden="true" /></a></p>
      </article>
    </div>
  </SiteChrome>;
}
