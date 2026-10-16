import Link from 'next/link';
import { SiteChrome } from './SiteChrome';
import { LinkCard } from './LinkCard';
import { ArrowRight } from 'lucide-react';
import { type CuratedLink, topics, activeTopics, linksForTopic, links as allLinks, issueByNumber, issueUrl, formatDate, guides } from '@/lib/content';

export function LinkLibrary({ topic, links }: { topic?: string; links: CuratedLink[] }) {
  const heading = topic ? topics[topic].label : 'The link library';
  const intro = topic
    ? `${topics[topic].description} Every link was featured in The .NET Insider.`
    : 'Articles, releases and tools featured in The .NET Insider, with credit to the original authors. Browse by topic or start with the most recent picks.';
  return <SiteChrome current="/links/">
    <section className="page-intro" aria-labelledby="page-title">
      <p className="eyebrow">{topic ? 'Link library · Topic' : 'Curated by dotnetdevs.io'}</p>
      <h1 id="page-title">{heading}</h1>
      <p className="intro-copy">{intro}</p>
    </section>
    <nav className="topic-nav" aria-label="Topics">
      <ul>
        <li><Link href="/links/" aria-current={!topic ? 'page' : undefined}>All <span>{allLinks.length}</span></Link></li>
        {activeTopics.map(t => <li key={t}><Link href={`/links/${t}/`} aria-current={topic === t ? 'page' : undefined}>{topics[t].label} <span>{linksForTopic(t).length}</span></Link></li>)}
      </ul>
    </nav>
    {guides.length > 0 && <div className="content-section">
      <Link className="callout-card" href={guides.length === 1 ? `/guides/${guides[0].slug}/` : '/guides/'}>
        <span><strong>{guides.length === 1 ? `Guide: ${guides[0].title}` : 'Reading paths'}</strong><p>{guides.length === 1 ? guides[0].description : 'Articles from the library, put in a sensible order.'}</p></span>
        <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </div>}
    {topic
      ? <section className="content-section" aria-label={`${heading} links`}>
          <div className="link-list">{links.map(link => <LinkCard key={link.url} link={link} headingLevel={2} />)}</div>
        </section>
      : [...new Set(links.map(link => link.issue))].map(n => {
          const issue = issueByNumber(n);
          return <section key={n} className="content-section" aria-labelledby={`issue-${n}`}>
            <div className="section-heading">
              <h2 id={`issue-${n}`}>Issue {n}</h2>
              {issue && <a className="section-link" href={issueUrl(issue)}>{formatDate(issue.date)}</a>}
            </div>
            <div className="link-list">{links.filter(link => link.issue === n).map(link => <LinkCard key={link.url} link={link} />)}</div>
          </section>;
        })}
    <p className="page-note">Links point to the original articles. Short descriptions are dotnetdevs.io commentary, not the authors&apos; words.</p>
  </SiteChrome>;
}
