import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, ArrowRight, BookOpen } from 'lucide-react';
import { BrandMark } from './BrandMark';
import { ThemeToggle } from './ThemeToggle';
import { site, socialLinks, isDesignPreview, validDestination } from '@/lib/site';

export function CommunityPage() {
  const links = isDesignPreview ? [...site.socials].filter(link => link.enabled).sort((a, b) => a.order - b.order) : socialLinks;
  return <div className="site-shell">
    <a className="skip-link" href="#main">Skip to content</a>
    {isDesignPreview && <aside className="preview-notice"><strong>Local design preview</strong><span>Unconfigured channels are non-clickable samples. They are omitted from the production build.</span></aside>}
    <header className="masthead">
      <Link href="/" className="wordmark" aria-label={`${site.brand} home`}>
        {site.logo ? <Image className="brand-logo" src={site.logo} alt="" width={500} height={500} unoptimized /> : <BrandMark />}
        <span>{site.brand}</span>
      </Link>
      <div className="masthead-actions"><span className="masthead-note">{site.mastheadNote}</span><ThemeToggle /></div>
    </header>
    <main id="main" tabIndex={-1}>
      <section className="intro" aria-labelledby="page-title">
        <p className="eyebrow">{site.eyebrow}</p>
        <h1 id="page-title">{site.brand}</h1>
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
      {links.length > 0 && <section className="social-section" aria-labelledby="social-title">
        <div className="section-heading"><h2 id="social-title">{site.socialHeading}</h2><p>{site.socialDescription}</p></div>
        <ul className="social-grid">
          {links.map(link => {
            const configured = validDestination(link.url);
            const content = <><span className={`platform-icon platform-${link.id}`}><Image src={`/icons/${link.id}.svg`} width={22} height={22} alt="" unoptimized /></span><span className="platform-label">{link.label}</span>{configured ? <ArrowUpRight className="social-arrow" size={19} aria-hidden="true" /> : <span className="sample-label">Preview</span>}</>;
            return <li key={link.id}>{configured ? <a className="social-card" href={link.url!}>{content}</a> : <div className="social-card social-sample">{content}</div>}</li>;
          })}
        </ul>
      </section>}
    </main>
    <footer className="footer"><span>© {new Date().getFullYear()} {site.brand}</span>{validDestination(site.contact.url, true) && <a href={site.contact.url!}>{site.contact.label}<ArrowUpRight size={14} aria-hidden="true" /></a>}<span className="footer-symbol" aria-hidden="true">{'</>'}</span></footer>
  </div>;
}
