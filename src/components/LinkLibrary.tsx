import Link from 'next/link';
import { SiteChrome } from './SiteChrome';
import { LinkCard } from './LinkCard';
import { type CuratedLink, topics, activeTopics, linksForTopic, links as allLinks } from '@/lib/content';

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
    <section className="content-section" aria-label={`${heading} links`}>
      <div className="link-list">{links.map(link => <LinkCard key={link.url} link={link} headingLevel={2} />)}</div>
    </section>
    <p className="page-note">Links point to the original articles. Short descriptions are dotnetdevs.io commentary, not the authors&apos; words.</p>
  </SiteChrome>;
}
