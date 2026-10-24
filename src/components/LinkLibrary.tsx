import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SiteChrome } from './SiteChrome';
import { LinkCard } from './LinkCard';
import { LibrarySearch, type SearchItem } from './LibrarySearch';
import { type CuratedLink, topics, activeTopics, linksForTopic, links as allLinks, issueByNumber, issueUrl, formatDate, guides, sourceName } from '@/lib/content';
import { externalProps } from '@/lib/site';

const VISIBLE_ISSUES = 2;

function IssueGroup({ n, links }: { n: number; links: CuratedLink[] }) {
  const issue = issueByNumber(n);
  return <section className="issue-group" aria-labelledby={`issue-${n}`}>
    <div className="group-heading">
      <h2 id={`issue-${n}`}>Issue {n}</h2>
      {issue && <a href={issueUrl(issue)} {...externalProps(issueUrl(issue))}>{formatDate(issue.date)} · Read the issue<ArrowUpRight size={14} aria-hidden="true" /></a>}
    </div>
    <div className="row-list">{links.filter(link => link.issue === n).map(link => <LinkCard key={link.url} link={link} showIssue={false} />)}</div>
  </section>;
}

export function LinkLibrary({ topic, links }: { topic?: string; links: CuratedLink[] }) {
  const heading = topic ? topics[topic].label : 'The link library';
  const intro = topic
    ? `${topics[topic].description} ${links.length} links, all featured in The .NET Insider.`
    : `Every article, release and tool featured in The .NET Insider. ${allLinks.length} links, with credit to the original authors.`;
  const issueNumbers = [...new Set(links.map(link => link.issue))];
  const recent = issueNumbers.slice(0, VISIBLE_ISSUES);
  const older = issueNumbers.slice(VISIBLE_ISSUES);
  const searchItems: SearchItem[] = links.map(link => {
    const issue = issueByNumber(link.issue);
    return { title: link.title, url: link.url, meta: `${link.author ? `${link.author} · ` : ''}${sourceName(link.url)}`, issue: link.issue, issueUrl: issue ? issueUrl(issue) : '' };
  });
  const guide = guides[0];

  return <SiteChrome current="/links/">
    <div className="container page">
      <section className="page-intro" aria-labelledby="page-title">
        <p className="eyebrow">{topic ? 'Library topic' : 'Curated by dotnetdevs.io'}</p>
        <h1 id="page-title">{heading}</h1>
        <p className="lead">{intro}</p>
      </section>

      <div className="with-sidebar">
        <aside className="sidebar">
          <nav aria-labelledby="topics-heading">
            <h2 id="topics-heading" className="sidebar-heading">Topics</h2>
            <ul className="side-list">
              <li><Link href="/links/" aria-current={!topic ? 'page' : undefined}><span>All links</span><span className="count">{allLinks.length}</span></Link></li>
              {activeTopics.map(t => <li key={t}><Link href={`/links/${t}/`} aria-current={topic === t ? 'page' : undefined}><span>{topics[t].label}</span><span className="count">{linksForTopic(t).length}</span></Link></li>)}
            </ul>
          </nav>
          {guide && <Link className="side-callout" href={`/guides/${guide.slug}/`}>
            <span className="kicker">Guide</span>
            <strong>{guide.title}</strong>
            <span className="muted small">{guide.sections.reduce((n, s) => n + s.links.length, 0)} articles in reading order<ArrowRight size={14} aria-hidden="true" /></span>
          </Link>}
        </aside>

        <div className="main-column">
          <LibrarySearch items={searchItems} placeholder={`Search ${links.length} links by title, author or source`}>
            {topic
              ? <div className="row-list">{links.map(link => <LinkCard key={link.url} link={link} headingLevel={2} />)}</div>
              : <>
                  {recent.map(n => <IssueGroup key={n} n={n} links={links} />)}
                  {older.length > 0 && <details className="more-issues">
                    <summary>Show Issues {older[0]} to {older[older.length - 1]}</summary>
                    {older.map(n => <IssueGroup key={n} n={n} links={links} />)}
                  </details>}
                </>}
          </LibrarySearch>
          <p className="page-note">Links go to the original articles. Short descriptions are dotnetdevs.io commentary, not the authors&apos; words.</p>
        </div>
      </div>
    </div>
  </SiteChrome>;
}
