import type { Metadata } from 'next';
import { site, isStaging, isDesignPreview } from '@/lib/site';
import { themeInitScript } from '@/lib/theme';
import './globals.css';
const image = new URL(site.sharingImage, site.canonicalUrl).href;
export const metadata: Metadata = {
  metadataBase: new URL(site.canonicalUrl), title: site.title, description: site.description,
  alternates: { canonical: site.canonicalUrl },
  robots: isStaging || isDesignPreview ? { index: false, follow: false } : { index: true, follow: true },
  icons: { icon: [{ url: site.icon || site.logo || '/favicon.svg', type: (site.icon || site.logo) ? 'image/png' : 'image/svg+xml' }], apple: site.icon || site.logo || '/apple-touch-icon.png' },
  openGraph: { type: 'website', locale: 'en_US', url: site.canonicalUrl, siteName: site.brand, title: site.title, description: site.description, images: [{ url: image, width: 1200, height: 630, alt: `${site.brand} — ${site.newsletter.title}` }] },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description, images: [image] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeInitScript }} /></head><body>{children}</body></html>;
}
