import type { Metadata } from 'next';
import Script from 'next/script';
import { site, isIndexable } from '@/lib/site';
import { themeInitScript } from '@/lib/theme';
import { analyticsInitScript } from '@/lib/analytics';
import './globals.css';
const image = new URL(site.sharingImage, site.canonicalUrl).href;
export const metadata: Metadata = {
  metadataBase: new URL(site.canonicalUrl), title: site.title, description: site.description,
  applicationName: site.name,
  robots: isIndexable
    ? { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 }
    : { index: false, follow: false },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION } : undefined,
  },
  icons: { icon: [{ url: site.icon || site.logo || '/favicon.svg', type: (site.icon || site.logo) ? 'image/png' : 'image/svg+xml' }], apple: site.icon || site.logo || '/apple-touch-icon.png' },
  openGraph: { type: 'website', locale: 'en_US', url: site.canonicalUrl, siteName: site.name, title: site.title, description: site.description, images: [{ url: image, width: 1200, height: 630, alt: `${site.name} — ${site.newsletter.title}` }] },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description, images: [{ url: image, alt: `${site.name} — ${site.newsletter.title}` }] },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" suppressHydrationWarning>
    <head>
      <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      {isIndexable && <link rel="describedby" href="/llms.txt" type="text/plain" />}
    </head>
    <body>
      {children}
      {isIndexable && process.env.NODE_ENV === 'production' && site.googleAnalyticsId &&
        <Script id="google-analytics" strategy="afterInteractive">{analyticsInitScript}</Script>}
    </body>
  </html>;
}
