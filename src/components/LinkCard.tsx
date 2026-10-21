import Link from 'next/link';
import { type CuratedLink, topics, sourceName, issueByNumber, issueUrl } from '@/lib/content';

export function LinkCard({ link, headingLevel = 3, showIssue = true }: { link: CuratedLink; headingLevel?: 2 | 3; showIssue?: boolean }) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3';
  const issue = issueByNumber(link.issue);
  return <article className="row-card">
    <Heading className="row-heading"><a className="row-title" href={link.url}>{link.title}</a></Heading>
    <div className="row-meta-line">
      <span className="row-meta">{link.author ? `${link.author} · ` : ''}{sourceName(link.url)}</span>
      <ul className="topic-chips" aria-label="Topics">
        {link.topics.filter(t => topics[t]).map(t => <li key={t}><Link href={`/links/${t}/`}>{topics[t].label}</Link></li>)}
      </ul>
      {showIssue && issue && <a className="row-issue" href={issueUrl(issue)}>Issue {issue.number}</a>}
    </div>
    {link.note && <p className="row-note">{link.note}</p>}
  </article>;
}
