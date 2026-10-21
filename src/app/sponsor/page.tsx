import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import { SiteChrome } from '@/components/SiteChrome';
import { pageMetadata } from '@/lib/page-meta';
import { site, validDestination } from '@/lib/site';
import { mediaKit } from '@/lib/content';

export const metadata: Metadata = pageMetadata('/sponsor/', 'Sponsor dotnetdevs.io',
  `Reach C# and .NET developers through ${site.newsletter.title} and the .NET Developers community channels.`);

export default function SponsorPage() {
  const contact = validDestination(site.contact.url, true) ? site.contact.url! : null;
  return <SiteChrome current="/sponsor/">
    <div className="container page">
    <section className="page-intro" aria-labelledby="page-title">
      <p className="eyebrow">Sponsorships</p>
      <h1 id="page-title">Reach .NET developers</h1>
      <p className="lead">dotnetdevs.io runs {site.newsletter.title} and the .NET Developers channels on LinkedIn, Facebook, Instagram and more. Sponsorships put developer tools and services in front of people who build with C# and .NET every day.</p>
      {contact && <a className="button" href={`${contact}?subject=Sponsorship%20enquiry`}>Ask about sponsoring<ArrowRight size={18} aria-hidden="true" /></a>}
    </section>

    <section className="content-section" aria-labelledby="audience-title">
      <div className="section-heading"><h2 id="audience-title">Audience</h2><p>As of {mediaKit.asOfLabel}</p></div>
      <ul className="stat-grid">
        {mediaKit.audience.map(stat => <li key={stat.label} className="stat-card">
          <span className="stat-value">{stat.value}</span>
          <span className="stat-label">{stat.label}</span>
          <span className="stat-detail">{stat.detail}</span>
        </li>)}
      </ul>
    </section>

    <section className="content-section" aria-labelledby="engagement-title">
      <div className="section-heading"><h2 id="engagement-title">Engagement</h2><p>Figures collected {mediaKit.asOfLabel}</p></div>
      <ul className="stat-grid">
        {mediaKit.engagement.map(stat => <li key={stat.label} className="stat-card">
          <span className="stat-value">{stat.value}</span>
          <span className="stat-label">{stat.label}</span>
          <span className="stat-detail">{stat.period}</span>
        </li>)}
      </ul>
    </section>

    <section className="content-section" aria-labelledby="who-title">
      <div className="section-heading"><h2 id="who-title">Who reads it</h2><p>{mediaKit.demographicsSource}</p></div>
      <dl className="fact-list">
        {mediaKit.demographics.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}
      </dl>
    </section>

    <section className="content-section" aria-labelledby="offer-title">
      <div className="section-heading"><h2 id="offer-title">What we offer</h2><p>Packages are put together per campaign</p></div>
      <ul className="offer-grid">
        {mediaKit.offerings.map(offer => <li key={offer.title} className="offer-card"><h3>{offer.title}</h3><p>{offer.description}</p></li>)}
      </ul>
    </section>

    <ul className="page-note-list">{mediaKit.notes.map(note => <li key={note}>{note}</li>)}</ul>
    {contact && <p className="page-note">For rates and availability, write to <a href={contact}>{contact.replace(/^mailto:/, '')}</a>.</p>}
    </div>
  </SiteChrome>;
}
