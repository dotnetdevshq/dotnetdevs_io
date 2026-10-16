import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, BookOpen } from 'lucide-react';
import { SiteChrome } from './SiteChrome';
import { LinkCard } from './LinkCard';
import { site, socialLinks, isDesignPreview, validDestination } from '@/lib/site';
import { latestIssue, links, issueUrl, formatDate } from '@/lib/content';

export function CommunityPage() {
  const socials = isDesignPreview ? [...site.socials].filter(link => link.enabled).sort((a, b) => a.order - b.order) : socialLinks;
  const recentPicks = links.slice(0, 4);
  return <SiteChrome current="home">
    <section className="intro" aria-labelledby="page-title">
      <p className="eyebrow">{site.eyebrow}</p>
      <h1 id="page-title">Your .NET community.</h1>
      <p className="intro-copy">{site.description}</p>
    </section>
    <section aria-labelledby="newsletter-title" className="newsletter-section">
      <a className="newsletter-card" href={site.newsletter.url} aria-labelledby="newsletter-action" aria-describedby="newsletter-description">
        <div className="newsletter-content">
          <span className="newsletter-kicker"><BookOpen size={17} aria-hidden="true" />{site.newsletter.eyebrow}</span>
          <h2 id="newsletter-title">{site.newsletter.title}</h2>
          <p id="newsletter-description">{site.newsletter.description}</p>
          <span className="newsletter-action" id="newsletter-action">{site.newsletter.label}<ArrowRight size={20} aria-hidden="true" /></span>
          <span className="newsletter-domain">{new URL(site.newsletter.url).hostname}<ArrowUpRight size={13} aria-hidden="true" /></span>
        </div>
        <div className="newsletter-art" aria-hidden="true">
          <div className="paper paper-back" />
          <div className="paper paper-front">
            <div className="paper-topline"><span>THE INSIDER</span><span>↗</span></div>
            <div className="paper-monogram">.NET<span>INSIDER</span></div>
            <div className="paper-rule" />
            <div className="paper-bottom"><span>C# / .NET / DEV</span><span>+</span></div>
          </div>
        </div>
      </a>
    </section>
    {latestIssue && <section className="content-section" aria-labelledby="latest-title">
      <div className="section-heading">
        <h2 id="latest-title">Latest issue</h2>
        <Link className="section-link" href="/newsletter/">All {latestIssue.number} issues<ArrowRight size={15} aria-hidden="true" /></Link>
      </div>
      <a className="issue-card issue-card-feature" href={issueUrl(latestIssue)}>
        <span className="issue-number">Issue {latestIssue.number}</span>
        <span className="issue-date">{formatDate(latestIssue.date)}</span>
        {latestIssue.summary && <span className="issue-summary">{latestIssue.summary}</span>}
        <span className="issue-read">Read on {new URL(site.newsletter.url).hostname}<ArrowUpRight size={14} aria-hidden="true" /></span>
      </a>
    </section>}
    {recentPicks.length > 0 && <section className="content-section" aria-labelledby="picks-title">
      <div className="section-heading">
        <h2 id="picks-title">Recent picks</h2>
        <Link className="section-link" href="/links/">Browse the link library<ArrowRight size={15} aria-hidden="true" /></Link>
      </div>
      <div className="link-list">{recentPicks.map(link => <LinkCard key={link.url} link={link} />)}</div>
    </section>}
    {socials.length > 0 && <section className="social-section" aria-labelledby="social-title">
      <div className="section-heading"><h2 id="social-title">{site.socialHeading}</h2><p>{site.socialDescription}</p></div>
      <ul className="social-grid">
        {socials.map(link => {
          const configured = validDestination(link.url);
          const content = <><span className={`platform-icon platform-${link.id}`}><Image src={`/icons/${link.id}.svg`} width={22} height={22} alt="" unoptimized /></span><span className="platform-label">{link.label}</span>{configured ? <ArrowUpRight className="social-arrow" size={19} aria-hidden="true" /> : <span className="sample-label">Preview</span>}</>;
          return <li key={link.id}>{configured ? <a className="social-card" href={link.url!}>{content}</a> : <div className="social-card social-sample">{content}</div>}</li>;
        })}
      </ul>
    </section>}
  </SiteChrome>;
}
