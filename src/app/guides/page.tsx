import type { Metadata } from 'next';
import { SiteChrome } from '@/components/SiteChrome';
import { GuideCard } from '@/components/GuideCard';
import { pageMetadata } from '@/lib/page-meta';
import { guides, writtenGuides } from '@/lib/content';

export const metadata: Metadata = pageMetadata('/guides/', 'Guides for .NET developers',
  'Reading paths through the best articles featured in The .NET Insider, plus written guides from dotnetdevs.io for .NET developers and creators.');

export default function GuidesPage() {
  return <SiteChrome current="/guides/">
    <div className="container page">
    <section className="page-intro" aria-labelledby="page-title">
      <p className="eyebrow">Guides</p>
      <h1 id="page-title">Guides</h1>
      <p className="lead">Reading paths put articles we have featured in The .NET Insider into an order worth reading them in, with links to the original authors. Written guides are our own how-tos.</p>
    </section>
    <section className="content-section" aria-labelledby="reading-heading">
      <h2 id="reading-heading" className="sidebar-heading">Reading paths</h2>
      <ul className="guide-list">
        {guides.map(guide => <li key={guide.slug}><GuideCard guide={guide} /></li>)}
      </ul>
    </section>
    {writtenGuides.length > 0 && <section className="content-section" aria-labelledby="written-heading">
      <h2 id="written-heading" className="sidebar-heading">Written guides</h2>
      <ul className="guide-list">
        {writtenGuides.map(guide => <li key={guide.slug}><GuideCard guide={guide} written /></li>)}
      </ul>
    </section>}
    </div>
  </SiteChrome>;
}
