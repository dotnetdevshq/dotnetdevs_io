import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { SiteChrome } from './SiteChrome';
import { site, socialLinks, isDesignPreview, validDestination, externalProps } from '@/lib/site';
import { issues, latestIssue, links, issueUrl, formatDate, guides, posts, topics, activeTopics, linksForTopic, sourceName, mediaKit } from '@/lib/content';

// "141,445" -> "141K+". Rounded down so the figure never overstates the dated snapshot.
function compact(value: string) {
  const n = Number(value.replace(/[^0-9]/g, ''));
  return n >= 1000 ? `${Math.floor(n / 1000)}K+` : value;
}

export function CommunityPage() {
  const socials = isDesignPreview ? [...site.socials].filter(link => link.enabled).sort((a, b) => a.order - b.order) : socialLinks;
  const latestLinks = latestIssue ? links.filter(link => link.issue === latestIssue.number).slice(0, 4) : [];
  const topicTiles = [...activeTopics].sort((a, b) => linksForTopic(b).length - linksForTopic(a).length).slice(0, 12);
  const linkedIn = mediaKit.audience.find(stat => stat.label.startsWith('LinkedIn page'));
  const guide = guides[0];
  const post = posts[0];

  return <SiteChrome current="home">
    <section className="hero" aria-labelledby="page-title">
      <div className="container hero-row">
        <div className="hero-copy">
          <p className="eyebrow">{site.eyebrow}</p>
          {/* Non-breaking hyphens keep words like "hand-picked" on one line. */}
          <h1 id="page-title">{site.tagline.replace(/-/g, '\u2011')}</h1>
          <p className="lead">{site.description}</p>
          <div className="button-row">
            <a className="button" href={site.newsletter.subscribeUrl} {...externalProps(site.newsletter.subscribeUrl)}>Subscribe free<ArrowRight size={18} aria-hidden="true" /></a>
            <Link className="button button-secondary" href="/links/">Browse the library</Link>
          </div>
          <p className="fine-print">Free. Unsubscribe any time. Past issues are on <a href={site.newsletter.url} {...externalProps(site.newsletter.url)}>{new URL(site.newsletter.url).hostname}</a>.</p>
        </div>
        <ul className="hero-stats" aria-label="At a glance">
          <li><span className="stat-number">{issues.length}</span><span>newsletter issues</span></li>
          <li><span className="stat-number">{links.length}</span><span>curated links</span></li>
          {linkedIn && <li className="stat-accent"><span className="stat-number">{compact(linkedIn.value)}</span><span>developers follow us on LinkedIn</span></li>}
        </ul>
      </div>
    </section>

    <div className="container">
      {latestIssue && <section className="home-section" aria-labelledby="latest-title">
        <div className="section-heading">
          <h2 id="latest-title">Latest issue</h2>
          <Link className="section-link" href="/newsletter/">All {issues.length} issues<ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        <div className="latest-row">
          <a className="feature-card" href={issueUrl(latestIssue)} {...externalProps(issueUrl(latestIssue))}>
            <span className="feature-kicker">Issue {latestIssue.number} · {formatDate(latestIssue.date)}</span>
            {latestIssue.summary && <span className="feature-summary">{latestIssue.summary}</span>}
            <span className="feature-action">Read Issue {latestIssue.number} on {new URL(site.newsletter.url).hostname}<ArrowUpRight size={16} aria-hidden="true" /></span>
          </a>
          <ol className="row-list">
            {latestLinks.map(link => <li key={link.url} className="row-card">
              <a className="row-title" href={link.url} {...externalProps(link.url)}>{link.title}</a>
              <span className="row-meta">{link.author ? `${link.author} · ` : ''}{sourceName(link.url)}</span>
            </li>)}
          </ol>
        </div>
      </section>}

      <section className="home-section" aria-labelledby="topics-title">
        <div className="section-heading">
          <h2 id="topics-title">Browse the library by topic</h2>
          <Link className="section-link" href="/links/">All {links.length} links<ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
        <ul className="topic-tiles">
          {topicTiles.map(t => <li key={t}><Link href={`/links/${t}/`}><span>{topics[t].label}</span><span className="count">{linksForTopic(t).length}</span></Link></li>)}
        </ul>
      </section>

      {(guide || post) && <section className="home-section split-row" aria-label="Guides and posts">
        {guide && <Link className="guide-card" href={`/guides/${guide.slug}/`}>
          <span className="kicker">Guide · {guide.sections.length} steps · {guide.sections.reduce((n, s) => n + s.links.length, 0)} articles</span>
          <span className="guide-card-title">{guide.title}</span>
          <span className="muted">{guide.description}</span>
          <ol>{guide.sections.slice(0, 3).map(section => <li key={section.title}>{section.title}</li>)}</ol>
          <span className="card-action">Start the guide<ArrowRight size={16} aria-hidden="true" /></span>
        </Link>}
        {post && <Link className="post-teaser" href={`/posts/#${post.slug}`}>
          <Image src={post.image} alt="" width={1080} height={1350} unoptimized />
          <span className="post-teaser-body">
            <span className="kicker kicker-muted">Latest post</span>
            <span className="post-teaser-title">{post.title}</span>
            <span className="muted small">Based on {post.source.author}, {sourceName(post.source.url)}</span>
          </span>
        </Link>}
      </section>}

      {socials.length > 0 && <section className="home-section follow-panel" aria-labelledby="follow-title">
        <div>
          <h2 id="follow-title">{site.socialHeading}</h2>
          <p className="muted">{site.socialDescription}</p>
        </div>
        <ul className="channel-list">
          {socials.map(link => {
            const content = <><Image className="channel-icon" src={`/icons/${link.id}.svg`} width={16} height={16} alt="" unoptimized /><span>{link.label}</span></>;
            return <li key={link.id}>{validDestination(link.url) ? <a className={`channel platform-${link.id}`} href={link.url!} {...externalProps(link.url!)}>{content}</a> : <span className="channel social-sample">{content}</span>}</li>;
          })}
        </ul>
      </section>}
    </div>
  </SiteChrome>;
}
