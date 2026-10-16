import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteChrome } from '@/components/SiteChrome';
import { LinkCard } from '@/components/LinkCard';
import { pageMetadata } from '@/lib/page-meta';
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
  return <SiteChrome current="/links/">
    <section className="page-intro" aria-labelledby="page-title">
      <p className="eyebrow"><Link href="/guides/">Guides</Link> · Reviewed {guide.reviewedLabel}</p>
      <h1 id="page-title">{guide.title}</h1>
      <p className="intro-copy">{guide.intro}</p>
    </section>
    <nav className="guide-toc" aria-label="In this guide">
      <ol>{guide.sections.map((section, i) => <li key={section.title}><a href={`#step-${i + 1}`}>{section.title}</a></li>)}</ol>
    </nav>
    {guide.sections.map((section, i) => <section key={section.title} id={`step-${i + 1}`} className="content-section guide-step" aria-labelledby={`step-${i + 1}-title`}>
      <div className="guide-step-heading">
        <span className="guide-step-number" aria-hidden="true">{i < 9 ? `0${i + 1}` : i + 1}</span>
        <div><h2 id={`step-${i + 1}-title`}>{section.title}</h2><p>{section.intro}</p></div>
      </div>
      <div className="link-list">{section.links.map(linkByUrl).filter((l): l is CuratedLink => !!l).map(link => <LinkCard key={link.url} link={link} />)}</div>
    </section>)}
    <p className="page-note">Section introductions are dotnetdevs.io commentary. Each article belongs to its author; see <Link href="/links/">the full link library</Link> for everything we have featured.</p>
  </SiteChrome>;
}
