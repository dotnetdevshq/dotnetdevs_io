import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteChrome } from '@/components/SiteChrome';
import { pageMetadata } from '@/lib/page-meta';
import { site, validDestination } from '@/lib/site';
import legal from '@/content/legal.json';

const description = `The terms for using ${site.brand}: curated third-party links, author credit, our own content, sponsored placements, and the limits of what we promise.`;

export const metadata: Metadata = pageMetadata('/terms/', 'Terms of use', description, { modified: legal.termsUpdated });

export default function TermsPage() {
  const email = validDestination(site.contact.url, true) ? site.contact.url!.replace(/^mailto:/, '') : null;
  const contact = email ? <a href={`mailto:${email}`}>{email}</a> : 'the contact address on this site';
  return <SiteChrome current="/terms/">
    <div className="container page">
      <article className="prose" aria-labelledby="page-title">
        <p className="eyebrow">Legal</p>
        <h1 id="page-title">Terms of use</h1>
        <p className="updated">Last updated {legal.termsUpdatedLabel}</p>

        <p className="lead">These terms apply to the website {site.brand}, run by {legal.owner}. By using the site you agree to them. They are short on purpose.</p>

        <h2 id="what">What this site is</h2>
        <p>{site.brand} is a free resource for C# and .NET developers. It holds the archive of {site.newsletter.title}, a library of articles chosen by hand, reading guides, and visual posts from our social channels. No account is needed to use it.</p>

        <h2 id="third-party">Links to other people&apos;s work</h2>
        <p>Most links on this site lead to articles, documentation, videos and tools published by other people and companies. That work belongs to its authors and publishers, and we credit and link to the original wherever we know the author. We do not control those sites and are not responsible for their content, availability or privacy practices. If you are an author and want a link removed or a credit corrected, write to {contact} and we will fix it.</p>

        <h2 id="our-content">Our own content</h2>
        <p>Summaries, notes, guide introductions, visual posts and the site design are the work of {site.brand}. Notes in the library are labeled as our commentary. You are welcome to quote short parts with a link back to the page. Please ask before republishing larger parts or the visual posts.</p>

        <h2 id="sponsored">Sponsored content</h2>
        <p>{site.brand} is funded partly by sponsors. Sponsored placements in the newsletter and on our channels are always labeled as sponsored. Sponsor placements are not added to the article library. More detail is in the <Link href="/about/#editorial">editorial and sponsorship policy</Link>.</p>

        <h2 id="no-warranty">No warranty</h2>
        <p>Content here is for information. We check what we publish, but .NET moves quickly, and code samples, version details and links can go out of date or may not fit your setup. Test anything before you rely on it in production. The site is provided as it is, without any warranty, and to the extent the law allows, {site.brand} is not liable for losses caused by using it or the sites it links to.</p>

        <h2 id="use">Fair use of the site</h2>
        <p>Please do not try to disrupt the site or misuse it, for example by overloading it with automated requests. Reading, sharing and linking to any page is welcome, and search engines and AI assistants may index and cite it.</p>

        <h2 id="privacy">Privacy</h2>
        <p>How we handle personal data and cookies is described in the <Link href="/privacy/">privacy and cookie policy</Link>.</p>

        <h2 id="law">Governing law and changes</h2>
        <p>These terms are governed by the laws of {legal.country}. Nothing in them limits rights you have under the consumer protection laws of your own country. We may update these terms; the date at the top shows the latest version. Questions are welcome at {contact}.</p>
      </article>
    </div>
  </SiteChrome>;
}
