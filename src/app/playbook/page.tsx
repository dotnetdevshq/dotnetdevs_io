import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SiteChrome } from '@/components/SiteChrome';
import { ExternalLink } from '@/components/ExternalLink';
import { pageMetadata } from '@/lib/page-meta';
import { playbookHubStructuredData, serializeJsonLd } from '@/lib/seo';
import { playbook, playbookPages, repositoryUrl } from '@/lib/playbook';
import { externalProps } from '@/lib/site';
import legal from '@/content/legal.json';

export const metadata: Metadata = pageMetadata('/playbook/', playbook.seoTitle, playbook.description, { modified: playbook.reviewed });

export default function PlaybookPage() {
  return <SiteChrome current="/playbook/">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(playbookHubStructuredData()) }} />
    <div className="container page">
      <section className="guide-hero" aria-labelledby="page-title">
        <p className="kicker">Playbook · By <Link href="/about/">{legal.owner}</Link> · Reviewed <time dateTime={playbook.reviewed}>{playbook.reviewedLabel}</time> · {playbook.dotnet}</p>
        <h1 id="page-title">{playbook.title}</h1>
        <p className="lead">{playbook.lead}</p>
        <p><a className="button" href={repositoryUrl} {...externalProps(repositoryUrl)}>Get the template on GitHub<ArrowRight size={18} aria-hidden="true" /></a></p>
      </section>

      <article className="prose">
        <h2 id="how">How it works</h2>
        <p>The playbook combines two things, and the second matters more than the first.</p>
        <ul>
          <li><strong>Rules the agent reads.</strong> An <code>AGENTS.md</code> file in the repository root holds the rules that apply everywhere. Each layer and the tests folder have their own file with the rules for that part of the code only.</li>
          <li><strong>Guardrails the build enforces.</strong> Analyzers with warnings treated as errors, architecture tests, integration tests against a real database, and a CI workflow. A violation fails the build whether or not the agent read the rules.</li>
        </ul>
        <p>Everything lives in a public template repository with a small Clean Architecture sample solution, so every rule has real code to apply to. It is released under the MIT license.</p>
      </article>

      <section className="content-section" aria-labelledby="layers-title">
        <div className="section-heading"><h2 id="layers-title">The rules, layer by layer</h2></div>
        <ul className="guide-list">
          {playbookPages.map(page => <li key={page.slug}>
            <Link className="guide-card" href={`/playbook/${page.slug}/`}>
              <span className="kicker">Playbook · Reviewed {page.reviewedLabel}</span>
              <span className="guide-card-title">{page.shortTitle}</span>
              <span className="muted">{page.question}</span>
              <span className="card-action">Read the rules<ArrowRight size={16} aria-hidden="true" /></span>
            </Link>
          </li>)}
        </ul>
      </section>

      <article className="prose">
        <h2 id="principles">Principles</h2>
        <ul>
          <li><strong>Tool-agnostic.</strong> The rules use <ExternalLink href="https://agents.md">AGENTS.md</ExternalLink>, an open format read by many AI coding tools. The playbook does not favor or depend on any single tool.</li>
          <li><strong>Enforce, do not only instruct.</strong> A rule that matters is backed by an analyzer, a test, or a build gate wherever that is possible.</li>
          <li><strong>Small and adaptable.</strong> The sample is deliberately small. Copy what helps and change what does not fit.</li>
          <li><strong>Explained, not only listed.</strong> Every rule comes with its reason. Opinions are labeled as opinions.</li>
        </ul>

        <h2 id="use">Use it in your project</h2>
        <ul>
          <li>Copy the root <code>AGENTS.md</code> and the file for each layer you have, then change what does not fit your team.</li>
          <li>Copy the guardrails that work without any AI tool: <code>.editorconfig</code>, <code>Directory.Build.props</code> with warnings as errors, the architecture tests, and the CI workflow.</li>
          <li>Building the sample needs the .NET 11 SDK. Every project targets both .NET 10 and .NET 11, and CI builds and tests both.</li>
        </ul>

        <h2 id="scope">What it does not cover yet</h2>
        <p>The sample has no user interface layer and no authentication, so there are no rules for either yet. The playbook was started in November 2026 and is still growing. The <ExternalLink href={repositoryUrl}>repository</ExternalLink> has the roadmap.</p>
      </article>
    </div>
  </SiteChrome>;
}
