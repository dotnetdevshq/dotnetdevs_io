import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { SiteChrome } from '@/components/SiteChrome';
import { ExternalLink } from '@/components/ExternalLink';
import { PlaybookRules } from '@/components/PlaybookRules';
import { pageMetadata } from '@/lib/page-meta';
import { playbookPageStructuredData, serializeJsonLd } from '@/lib/seo';
import { playbook, playbookPages, playbookPageBySlug, ruleFile, sourceUrl, repositoryUrl, rulesSnapshot } from '@/lib/playbook';
import { formatDate } from '@/lib/content';
import legal from '@/content/legal.json';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return playbookPages.map(page => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = playbookPageBySlug((await params).slug);
  if (!page) return {};
  return pageMetadata(`/playbook/${page.slug}/`, page.seoTitle, page.description, { modified: page.reviewed });
}

export default async function PlaybookLayerPage({ params }: Props) {
  const page = playbookPageBySlug((await params).slug);
  if (!page) notFound();
  // With more than one rule file on a page, section ids get a prefix so they stay unique.
  const files = page.sources.map(source => ({
    source,
    file: ruleFile(source.path, page.sources.length > 1 ? `${source.label.split(' ')[0].toLowerCase()}-` : ''),
  }));
  const index = playbookPages.indexOf(page);
  const next = playbookPages[index + 1];
  return <SiteChrome current="/playbook/">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(playbookPageStructuredData(page)) }} />
    <div className="container page">
      <nav className="breadcrumb" aria-label="Breadcrumb"><Link href="/playbook/">Playbook</Link><span aria-hidden="true">/</span><span>{page.shortTitle}</span></nav>
      <section className="guide-hero" aria-labelledby="page-title">
        <p className="kicker">Playbook · By <Link href="/about/">{legal.owner}</Link> · Reviewed <time dateTime={page.reviewed}>{page.reviewedLabel}</time> · {playbook.dotnet}</p>
        <h1 id="page-title">{page.title}</h1>
      </section>

      <div className="with-sidebar">
        <aside className="sidebar sidebar-sticky">
          <nav aria-labelledby="toc-heading">
            <h2 id="toc-heading" className="sidebar-heading">On this page</h2>
            <ul className="side-list">
              <li><a href="#answer">The short answer</a></li>
              <li><a href="#enforced">What the build enforces</a></li>
              {files.map(({ source }, i) => <li key={source.path}><a href={`#rules-${i + 1}`}>{source.label}</a></li>)}
              <li><a href="#use">Use these rules</a></li>
            </ul>
          </nav>
          <nav aria-labelledby="layers-heading">
            <h2 id="layers-heading" className="sidebar-heading">In the playbook</h2>
            <ul className="side-list">
              {playbookPages.map(other => <li key={other.slug}><Link href={`/playbook/${other.slug}/`} aria-current={other.slug === page.slug ? 'page' : undefined}>{other.shortTitle}</Link></li>)}
            </ul>
          </nav>
        </aside>

        <article className="main-column prose">
          <h2 id="answer">{page.question}</h2>
          <p className="lead">{page.answer}</p>
          <ul>{page.takeaways.map(takeaway => <li key={takeaway}>{takeaway}</li>)}</ul>

          <h2 id="enforced">What the build enforces</h2>
          <p>A rule in a file is a request. These checks make the request binding: they fail the build whether or not the agent, or a person, read the rules.</p>
          <div className="table-wrap"><table>
            <thead><tr><th scope="col">Check</th><th scope="col">What it does</th></tr></thead>
            <tbody>{page.enforcedBy.map(check => <tr key={check.name}>
              <td>{check.test ? <code>{check.name}</code> : check.name}</td>
              <td>{check.what}</td>
            </tr>)}</tbody>
          </table></div>
          <p>Rules without a check are still worth writing down, but they rely on review.</p>

          {files.map(({ source, file }, i) => <section key={source.path} aria-labelledby={`rules-${i + 1}`}>
            <h2 id={`rules-${i + 1}`}>{source.label}</h2>
            <p className="updated">Shown as written in <ExternalLink href={sourceUrl(source.path)}><code>{source.path}</code></ExternalLink>, the file the agent reads. Snapshot of <time dateTime={rulesSnapshot.committed}>{formatDate(rulesSnapshot.committed)}</time>.</p>
            <PlaybookRules file={file} />
          </section>)}

          <h2 id="use">Use these rules</h2>
          <p>Copy {page.sources.length > 1 ? 'the files' : 'the file'} into the matching folder of your solution and change what does not fit your team. The rules refer to a small sample solution in the <ExternalLink href={repositoryUrl}>playbook repository</ExternalLink>, so every rule has real code to point at. Sections marked as opinions are choices, not facts.</p>
          <p>The file uses the <ExternalLink href="https://agents.md">AGENTS.md</ExternalLink> format, which many AI coding tools read. A tool that needs its own file name gets a one-line file that points to it, never a copy.</p>

          {next
            ? <p><Link className="button" href={`/playbook/${next.slug}/`}>Next: {next.shortTitle}<ArrowRight size={18} aria-hidden="true" /></Link></p>
            : <p><Link className="button" href="/playbook/">Back to the playbook<ArrowRight size={18} aria-hidden="true" /></Link></p>}
        </article>
      </div>
    </div>
  </SiteChrome>;
}
