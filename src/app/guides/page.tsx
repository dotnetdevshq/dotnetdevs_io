import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SiteChrome } from '@/components/SiteChrome';
import { pageMetadata } from '@/lib/page-meta';
import { guides } from '@/lib/content';

export const metadata: Metadata = pageMetadata('/guides/', 'Guides for .NET developers',
  'Reading paths that put the best articles featured in The .NET Insider into a sensible order, topic by topic.');

export default function GuidesPage() {
  return <SiteChrome current="/links/">
    <section className="page-intro" aria-labelledby="page-title">
      <p className="eyebrow">Guides</p>
      <h1 id="page-title">Reading paths</h1>
      <p className="intro-copy">Each guide puts articles we have featured in The .NET Insider into an order worth reading them in. Links go to the original authors.</p>
    </section>
    <section className="content-section" aria-label="All guides">
      <ul className="issue-list">
        {guides.map(guide => <li key={guide.slug}>
          <Link className="issue-card issue-card-feature" href={`/guides/${guide.slug}/`}>
            <span className="issue-number">{guide.title}</span>
            <span className="issue-date">Reviewed {guide.reviewedLabel}</span>
            <span className="issue-summary">{guide.description}</span>
            <span className="issue-read">Read the guide<ArrowRight size={14} aria-hidden="true" /></span>
          </Link>
        </li>)}
      </ul>
    </section>
  </SiteChrome>;
}
