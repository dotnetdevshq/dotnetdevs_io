import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { type CuratedLink, topics, sourceName, issueByNumber, issueUrl } from '@/lib/content';

export function LinkCard({ link, headingLevel = 3 }: { link: CuratedLink; headingLevel?: 2 | 3 }) {
  const Heading = `h${headingLevel}` as 'h2' | 'h3';
  const issue = issueByNumber(link.issue);
  return <article className="link-card">
    <Heading className="link-title"><a href={link.url}>{link.title}<ArrowUpRight size={16} aria-hidden="true" /></a></Heading>
    <p className="link-meta">
      {link.author && <><span>{link.author}</span><span aria-hidden="true"> · </span></>}
      <span>{sourceName(link.url)}</span>
    </p>
    {link.note && <p className="link-note">{link.note}</p>}
    <div className="link-footer">
      <ul className="topic-chips" aria-label="Topics">
        {link.topics.filter(t => topics[t]).map(t => <li key={t}><Link href={`/links/${t}/`}>{topics[t].label}</Link></li>)}
      </ul>
      {issue && <a className="link-issue" href={issueUrl(issue)}>In Issue {issue.number}</a>}
    </div>
  </article>;
}
