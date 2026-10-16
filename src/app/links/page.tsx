import type { Metadata } from 'next';
import { LinkLibrary } from '@/components/LinkLibrary';
import { pageMetadata } from '@/lib/page-meta';
import { links } from '@/lib/content';

export const metadata: Metadata = pageMetadata('/links/', 'Curated .NET link library',
  'Articles, releases and tools for C# and .NET developers, curated from The .NET Insider and organized by topic.');

export default function LinksPage() {
  return <LinkLibrary links={links} />;
}
