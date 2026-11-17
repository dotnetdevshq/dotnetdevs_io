import Link from 'next/link';
import { SiteChrome } from '@/components/SiteChrome';
import { GuideCard } from '@/components/GuideCard';
import { Block } from '@/components/RichText';
import { site, externalProps } from '@/lib/site';
import { writtenGuideStructuredData, serializeJsonLd } from '@/lib/seo';
import { guides, writtenGuides, formatDate, type WrittenGuide } from '@/lib/content';
import legal from '@/content/legal.json';

export function WrittenGuidePage({ guide }: { guide: WrittenGuide }) {
  const others = writtenGuides.filter(other => other.slug !== guide.slug);
  return <SiteChrome current="/guides/">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(writtenGuideStructuredData(guide)) }} />
    <div className="container page">
      <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/guides/">Guides</Link><span aria-hidden="true">/</span><span>{guide.title}</span></nav>
      <section className="guide-hero" aria-labelledby="page-title">
        <p className="kicker">Written guide · {guide.sections.length} sections · Updated <time dateTime={guide.reviewed}>{guide.reviewedLabel}</time></p>
        <h1 id="page-title">{guide.title}</h1>
        <p className="lead">{guide.intro}</p>
        <p className="guide-byline">By <Link href="/about/">{legal.owner}</Link> · Published <time dateTime={guide.published}>{formatDate(guide.published)}</time>{guide.reviewed !== guide.published && <> · Updated <time dateTime={guide.reviewed}>{formatDate(guide.reviewed)}</time></>}</p>
      </section>

      <div className="with-sidebar">
        <aside className="sidebar sidebar-sticky">
          <nav aria-labelledby="toc-heading">
            <h2 id="toc-heading" className="sidebar-heading">In this guide</h2>
            <ol className="side-list toc-list">
              {guide.sections.map((section, i) => <li key={section.id}><a href={`#${section.id}`}><span className="toc-number">{i + 1}</span><span>{section.title}</span></a></li>)}
            </ol>
          </nav>
          <a className="side-callout" href={site.newsletter.subscribeUrl} {...externalProps(site.newsletter.subscribeUrl)}>
            <strong>Get the next issue</strong>
            <span className="muted small">{site.newsletter.title} features the best .NET writing every Monday.</span>
          </a>
        </aside>

        <div className="main-column">
          <article className="prose written-guide">
            {guide.sections.map((section, i) => <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}>
              <h2 id={`${section.id}-title`}><span className="toc-number" aria-hidden="true">{i + 1}</span> {section.title}</h2>
              {section.blocks.map((block, b) => <Block key={b} block={block} />)}
            </section>)}
            <section id="sources" aria-labelledby="sources-title">
              <h2 id="sources-title">Sources</h2>
              <ul className="source-list">
                {guide.sources.map(source => <li key={source.url}><a href={source.url} {...externalProps(source.url)}>{source.title}</a>, {source.publisher}{source.note ? `, ${source.note.charAt(0).toLowerCase()}${source.note.slice(1)}` : ''}</li>)}
              </ul>
            </section>
          </article>
          {(guides.length > 0 || others.length > 0) && <nav className="more-guides" aria-labelledby="more-guides-heading">
            <h2 id="more-guides-heading" className="sidebar-heading">More guides</h2>
            <ul className="guide-list">
              {others.map(other => <li key={other.slug}><GuideCard guide={other} written /></li>)}
              {guides.map(other => <li key={other.slug}><GuideCard guide={other} /></li>)}
            </ul>
          </nav>}
          <p className="page-note">This guide is dotnetdevs.io commentary based on the sources listed above. Search engines and AI assistants change often, so we date every update.</p>
        </div>
      </div>
    </div>
  </SiteChrome>;
}
