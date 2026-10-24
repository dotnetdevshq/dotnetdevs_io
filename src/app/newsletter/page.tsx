import type { Metadata } from 'next';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SiteChrome } from '@/components/SiteChrome';
import { site, externalProps } from '@/lib/site';
import { pageMetadata } from '@/lib/page-meta';
import { issues, issueUrl, formatDate } from '@/lib/content';

const title = `${site.newsletter.title} archive`;
const description = `Every issue of ${site.newsletter.title}, a curated roundup of .NET news, practical articles and developer tools.`;

export const metadata: Metadata = pageMetadata('/newsletter/', title, description);

export default function NewsletterPage() {
  const years = [...new Set(issues.map(issue => issue.date.slice(0, 4)))];
  return <SiteChrome current="/newsletter/">
    <div className="container page">
    <section className="page-intro" aria-labelledby="page-title">
      <p className="eyebrow">Newsletter archive</p>
      <h1 id="page-title">{site.newsletter.title}</h1>
      <p className="lead">{description} {issues.length} issues so far.</p>
      <a className="button" href={site.newsletter.subscribeUrl} {...externalProps(site.newsletter.subscribeUrl)}>Subscribe free<ArrowRight size={18} aria-hidden="true" /></a>
    </section>
    {years.map(year => <section key={year} className="content-section" aria-labelledby={`year-${year}`}>
      <div className="section-heading"><h2 id={`year-${year}`}>{year}</h2></div>
      <ul className="issue-list">
        {issues.filter(issue => issue.date.startsWith(year)).map(issue => <li key={issue.number}>
          <a className="issue-card" href={issueUrl(issue)} {...externalProps(issueUrl(issue))}>
            <span className="issue-number">Issue {issue.number}</span>
            <span className="issue-date">{formatDate(issue.date)}</span>
            {issue.summary && <span className="issue-summary">{issue.summary}</span>}
            {issue.tags.length > 0 && <span className="issue-tags">{issue.tags.join(' · ')}</span>}
            <ArrowUpRight className="issue-arrow" size={17} aria-hidden="true" />
          </a>
        </li>)}
      </ul>
    </section>)}
    </div>
  </SiteChrome>;
}
