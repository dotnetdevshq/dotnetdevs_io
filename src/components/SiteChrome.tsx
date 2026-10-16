import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { BrandMark } from './BrandMark';
import { ThemeToggle } from './ThemeToggle';
import { site, isDesignPreview, validDestination } from '@/lib/site';

export const navigation = [
  { href: '/newsletter/', label: 'Newsletter' },
  { href: '/links/', label: 'Links' },
  { href: '/sponsor/', label: 'Sponsor' },
] as const;

type Section = (typeof navigation)[number]['href'] | 'home';

export function SiteChrome({ current, children }: { current: Section; children: React.ReactNode }) {
  return <div className="site-shell">
    <a className="skip-link" href="#main">Skip to content</a>
    {isDesignPreview && <aside className="preview-notice"><strong>Local design preview</strong><span>Unconfigured channels are non-clickable samples. They are omitted from the production build.</span></aside>}
    <header className="masthead">
      <Link href="/" className="wordmark" aria-label={`${site.brand} home`}>
        {site.logo ? <Image className="brand-logo" src={site.logo} alt="" width={500} height={500} unoptimized /> : <BrandMark />}
        {!site.logo && <span>{site.brand}</span>}
      </Link>
      <div className="masthead-actions">
        <nav className="site-nav" aria-label="Main">
          {navigation.map(item => <Link key={item.href} href={item.href} aria-current={current === item.href ? 'page' : undefined}>{item.label}</Link>)}
        </nav>
        <ThemeToggle />
      </div>
    </header>
    <main id="main" tabIndex={-1}>{children}</main>
    <footer className="footer">
      <span>© {new Date().getFullYear()} {site.brand}</span>
      {navigation.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}
      <Link href="/guides/">Guides</Link>
      <Link href="/posts/">Posts</Link>
      {validDestination(site.contact.url, true) && <a href={site.contact.url!}>{site.contact.label}<ArrowUpRight size={14} aria-hidden="true" /></a>}
      <span className="footer-symbol" aria-hidden="true">{'</>'}</span>
    </footer>
  </div>;
}
