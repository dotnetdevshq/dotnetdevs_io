import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteChrome } from '@/components/SiteChrome';
import { LinkCard } from '@/components/LinkCard';
import { pageMetadata } from '@/lib/page-meta';
import { site, externalProps } from '@/lib/site';
import { guides, guideBySlug, linkByUrl, type CuratedLink } from '@/lib/content';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return guides.map(guide => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = guideBySlug((await params).slug);
  return guide ? pageMetadata(`/guides/${guide.slug}/`, guide.title, guide.description) : {};
}

export default async function GuidePage({ params }: Props) {
  const guide = guideBySlug((await params).slug);
  if (!guide) notFound();
  const articleCount = guide.sections.reduce((n, s) => n + s.links.length, 0);
  return <SiteChrome current="/guides/">
    <div className="container page">
      <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/guides/">Guides</Link><span aria-hidden="true">/</span><span>{guide.title}</span></nav>
      <section className="guide-hero" aria-labelledby="page-title">
        <p className="kicker">Guide · {guide.sections.length} steps · {articleCount} articles · Reviewed {guide.reviewedLabel}</p>
        <h1 id="page-title">{guide.title}</h1>
        <p className="lead">{guide.intro}</p>
      </section>

      <div className="with-sidebar">
        <aside className="sidebar">
          <nav aria-labelledby="toc-heading">
            <h2 id="toc-heading" className="sidebar-heading">In this guide</h2>
            <ol className="side-list toc-list">
              {guide.sections.map((section, i) => <li key={section.title}><a href={`#step-${i + 1}`}><span className="toc-number">{i + 1}</span><span>{section.title}</span></a></li>)}
            </ol>
          </nav>
          <a className="side-callout" href={site.newsletter.subscribeUrl} {...externalProps(site.newsletter.subscribeUrl)}>
            <strong>Get the next issue</strong>
            <span className="muted small">New articles on these topics land in {site.newsletter.title} first.</span>
          </a>
        </aside>

        <div className="main-column steps">
          {guide.sections.map((section, i) => <section key={section.title} id={`step-${i + 1}`} className="step-card" aria-labelledby={`step-${i + 1}-title`}>
            <div className="step-heading">
              <span className="step-number" aria-hidden="true">{i + 1}</span>
              <div>
                <h2 id={`step-${i + 1}-title`}>{section.title}</h2>
                <p className="muted">{section.intro}</p>
              </div>
            </div>
            <div className="row-list">{section.links.map(linkByUrl).filter((l): l is CuratedLink => !!l).map(link => <LinkCard key={link.url} link={link} />)}</div>
          </section>)}
          <p className="page-note">Step introductions are dotnetdevs.io commentary. Every article belongs to its author; see <Link href="/links/">the full library</Link> for everything we have featured.</p>
        </div>
      </div>
    </div>
  </SiteChrome>;
}
