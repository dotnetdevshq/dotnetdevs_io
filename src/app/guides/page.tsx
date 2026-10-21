import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SiteChrome } from '@/components/SiteChrome';
import { pageMetadata } from '@/lib/page-meta';
import { guides } from '@/lib/content';

export const metadata: Metadata = pageMetadata('/guides/', 'Guides for .NET developers',
  'Reading paths that put the best articles featured in The .NET Insider into a sensible order, topic by topic.');

export default function GuidesPage() {
  return <SiteChrome current="/guides/">
    <div className="container page">
    <section className="page-intro" aria-labelledby="page-title">
      <p className="eyebrow">Guides</p>
      <h1 id="page-title">Reading paths</h1>
      <p className="lead">Each guide puts articles we have featured in The .NET Insider into an order worth reading them in. Links go to the original authors.</p>
    </section>
    <section className="content-section" aria-label="All guides">
      <ul className="guide-list">
        {guides.map(guide => <li key={guide.slug}>
          <Link className="guide-card" href={`/guides/${guide.slug}/`}>
            <span className="kicker">Guide · {guide.sections.length} steps · Reviewed {guide.reviewedLabel}</span>
            <span className="guide-card-title">{guide.title}</span>
            <span className="muted">{guide.description}</span>
            <span className="card-action">Read the guide<ArrowRight size={16} aria-hidden="true" /></span>
          </Link>
        </li>)}
      </ul>
    </section>
    </div>
  </SiteChrome>;
}
