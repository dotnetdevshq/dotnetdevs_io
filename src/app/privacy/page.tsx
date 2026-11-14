import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteChrome } from '@/components/SiteChrome';
import { ExternalLink } from '@/components/ExternalLink';
import { pageMetadata } from '@/lib/page-meta';
import { site, validDestination } from '@/lib/site';
import legal from '@/content/legal.json';

const description = `How ${site.brand} handles personal data and cookies: what we collect, why, who processes it, how long it is kept, and how to use your rights.`;

export const metadata: Metadata = pageMetadata('/privacy/', 'Privacy and cookie policy', description, { modified: legal.privacyUpdated });

export default function PrivacyPage() {
  const email = validDestination(site.contact.url, true) ? site.contact.url!.replace(/^mailto:/, '') : null;
  const contact = email ? <a href={`mailto:${email}`}>{email}</a> : 'the contact address on this site';
  return <SiteChrome current="/privacy/">
    <div className="container page">
      <article className="prose" aria-labelledby="page-title">
        <p className="eyebrow">Legal</p>
        <h1 id="page-title">Privacy and cookie policy</h1>
        <p className="updated">Last updated {legal.privacyUpdatedLabel}</p>

        <p className="lead">{site.brand} is a static website. You can read everything on it without an account, and it has no forms. This page explains the small amount of personal data involved in running it.</p>

        <h2 id="who">Who is responsible</h2>
        <p>{site.brand} and {site.newsletter.title} are run by {legal.owner}, based in {legal.city}, {legal.country}. He is the controller of the personal data described here. For any privacy question or request, write to {contact}.</p>

        <h2 id="what">What we collect and why</h2>
        <div className="table-wrap"><table>
          <thead><tr><th scope="col">Data</th><th scope="col">Purpose</th><th scope="col">Legal basis</th></tr></thead>
          <tbody>
            <tr><td>Technical request data (IP address, browser, page requested, time) in the hosting provider&apos;s logs</td><td>Delivering the site, keeping it secure, fixing errors</td><td>Legitimate interest in running a working, secure website</td></tr>
            <tr><td>Aggregated visit counts from Vercel Web Analytics, without cookies</td><td>Seeing which pages are read, without identifying anyone</td><td>Legitimate interest</td></tr>
            <tr><td>Google Analytics data (pages viewed, approximate location, device and browser type, a cookie identifier)</td><td>Understanding which pages and articles are useful</td><td>In the EU/EEA, the UK and Switzerland: your consent, given in the cookie banner. Elsewhere: legitimate interest in understanding how the site is used, which you can switch off in Cookie settings</td></tr>
            <tr><td>Your email address and message, if you write to us</td><td>Replying to you, including about sponsorships</td><td>Legitimate interest in answering, or steps toward an agreement you asked about</td></tr>
          </tbody>
        </table></div>
        <p>We do not sell personal data, use it for advertising, or combine it with other sources to build profiles.</p>

        <h2 id="cookies">Cookies and local storage</h2>
        <p>Google Analytics is the only service on this site that sets cookies. Advertising features and Google signals are switched off.</p>
        <ul>
          <li><strong>In the EU/EEA, the United Kingdom and Switzerland</strong>, it loads only after you choose <strong>Accept analytics</strong> in the cookie banner. If you reject, or ignore the banner, no analytics cookies are set.</li>
          <li><strong>Everywhere else</strong>, it is on by default and no banner is shown. You can turn it off at any time with <strong>Cookie settings</strong> at the bottom of every page.</li>
        </ul>
        <p>We work out which of the two applies from your browser&apos;s time zone setting, which is read on your device and not sent to us. If the time zone is European, unknown or UTC, or your browser sends a Global Privacy Control signal, we ask first.</p>
        <div className="table-wrap"><table>
          <thead><tr><th scope="col">Name</th><th scope="col">Set by</th><th scope="col">Purpose</th><th scope="col">Duration</th></tr></thead>
          <tbody>
            <tr><td><code>_ga</code></td><td>Google Analytics, when it is on</td><td>Distinguishes visitors</td><td>2 years</td></tr>
            <tr><td><code>_ga_&lt;id&gt;</code></td><td>Google Analytics, when it is on</td><td>Keeps session state</td><td>2 years</td></tr>
            <tr><td><code>dotnetdevs-consent</code> (local storage)</td><td>{site.brand}</td><td>Remembers your cookie choice</td><td>Asked again after 12 months</td></tr>
            <tr><td><code>dotnetdevs-theme</code> (local storage)</td><td>{site.brand}</td><td>Remembers light or dark mode, if you pick one</td><td>Until you clear it</td></tr>
            <tr><td><code>dotnetdevs-pet</code> (local storage)</td><td>{site.brand}</td><td>Remembers that you hid Bucksy, the site pet</td><td>Until you show him again or clear it</td></tr>
          </tbody>
        </table></div>
        <p>The three local storage entries stay in your browser and are never sent to us. You can change your cookie choice at any time with <strong>Cookie settings</strong> at the bottom of every page. Choosing Reject removes the Google Analytics cookies.</p>

        <h2 id="processors">Services that process data for us</h2>
        <ul>
          <li><strong>Vercel</strong> hosts the site and provides cookieless Web Analytics. See the <ExternalLink href="https://vercel.com/legal/privacy-policy">Vercel privacy policy</ExternalLink>.</li>
          <li><strong>Google</strong> provides Google Analytics, as described under cookies above. See the <ExternalLink href="https://policies.google.com/privacy">Google privacy policy</ExternalLink>.</li>
          <li><strong>Email provider</strong>: messages sent to {contact} are stored in our mailbox.</li>
        </ul>
        <p>These providers may process data outside Georgia and the European Economic Area, including in the United States. They use standard safeguards, such as the European Commission&apos;s standard contractual clauses, for those transfers.</p>

        <h2 id="newsletter">The newsletter and other sites</h2>
        <p>Subscribing to {site.newsletter.title} happens on <ExternalLink href={site.newsletter.url}>{site.newsletter.url.replace(/^https:\/\//, '')}</ExternalLink>, which runs on Beehiiv. Your subscription data is handled there under the <ExternalLink href="https://www.beehiiv.com/privacy">Beehiiv privacy policy</ExternalLink>, and every email has an unsubscribe link. The LinkedIn edition is handled by LinkedIn.</p>
        <p>This site links to articles, tools and social platforms run by others. Once you leave {site.brand}, their own privacy policies apply.</p>

        <h2 id="retention">How long we keep data</h2>
        <ul>
          <li>Google Analytics data: no longer than 14 months.</li>
          <li>Hosting logs: as long as Vercel keeps them, which is a short period for operations and security.</li>
          <li>Emails: as long as needed to handle the conversation and any agreement that follows, and then deleted when no longer needed.</li>
        </ul>

        <h2 id="rights">Your rights</h2>
        <p>Under the Law of Georgia on Personal Data Protection and, where it applies to you, the EU General Data Protection Regulation (GDPR), you can ask to access, correct or delete your personal data, restrict or object to its use, and receive a copy of it. You can withdraw consent, or object to analytics, at any time through Cookie settings; this does not affect anything done before.</p>
        <p>To use these rights, write to {contact}. We will answer within one month. If you think your data has been mishandled, you can complain to the Personal Data Protection Service of Georgia or to the data protection authority in your own country.</p>

        <h2 id="children">Children</h2>
        <p>This site is written for working developers and is not directed at children under 16. We do not knowingly collect their data.</p>

        <h2 id="changes">Changes to this policy</h2>
        <p>When this policy changes, we update the date at the top of the page. See also our <Link href="/terms/">terms of use</Link>.</p>
      </article>
    </div>
  </SiteChrome>;
}
