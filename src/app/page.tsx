import type { Metadata } from 'next';
import { CommunityPage } from '@/components/CommunityPage';
import { site } from '@/lib/site';
import { communityStructuredData, serializeJsonLd } from '@/lib/seo';

export const metadata: Metadata = { alternates: { canonical: site.canonicalUrl } };

export default function HomePage() {
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(communityStructuredData) }} />
    <CommunityPage />
  </>;
}
