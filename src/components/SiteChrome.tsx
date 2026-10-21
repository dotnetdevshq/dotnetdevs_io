import Link from 'next/link';
import { Menu } from 'lucide-react';
import { LogoMark } from './LogoMark';
import { ThemeToggle } from './ThemeToggle';
import { site, isDesignPreview, validDestination } from '@/lib/site';

export const navigation = [
  { href: '/newsletter/', label: 'Newsletter' },
  { href: '/links/', label: 'Library' },
  { href: '/guides/', label: 'Guides' },
  { href: '/posts/', label: 'Posts' },
] as const;

type Section = (typeof navigation)[number]['href'] | '/sponsor/' | 'home';

function NavLinks({ current }: { current: Section }) {
  return <>{navigation.map(item => <Link key={item.href} href={item.href} aria-current={current === item.href ? 'page' : undefined}>{item.label}</Link>)}</>;
}

export function SiteChrome({ current, children }: { current: Section; children: React.ReactNode }) {
  return <div className="site">
    <a className="skip-link" href="#main">Skip to content</a>
    {isDesignPreview && <aside className="preview-notice"><strong>Local design preview</strong><span>Unconfigured channels are non-clickable samples. They are omitted from the production build.</span></aside>}
    <header className="site-header">
      <div className="container header-row">
        <Link href="/" className="wordmark" aria-label={`${site.brand} home`}>
          <LogoMark size={40} />
          <span>{site.brand}</span>
        </Link>
        <nav className="site-nav" aria-label="Main"><NavLinks current={current} /></nav>
        <div className="header-actions">
          <ThemeToggle />
          <a className="button button-small" href={site.newsletter.subscribeUrl}>Subscribe</a>
          {/* A details element keeps the phone menu working without JavaScript. */}
          <details className="mobile-menu">
            <summary aria-label="Menu"><Menu size={20} aria-hidden="true" /></summary>
            <nav aria-label="Main">
              <NavLinks current={current} />
              <span className="menu-theme"><span>Theme</span><ThemeToggle /></span>
            </nav>
          </details>
        </div>
      </div>
    </header>
    <main id="main" tabIndex={-1}>{children}</main>
    <footer className="site-footer">
      <div className="container footer-row">
        <span>© {new Date().getFullYear()} {site.brand}</span>
        <NavLinks current={current} />
        <Link className="footer-sponsor" href="/sponsor/" aria-current={current === '/sponsor/' ? 'page' : undefined}>Sponsor us</Link>
        {validDestination(site.contact.url, true) && <a href={site.contact.url!}>{site.contact.url!.replace(/^mailto:/, '')}</a>}
      </div>
    </footer>
  </div>;
}
