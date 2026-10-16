import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LinkLibrary } from '@/components/LinkLibrary';
import { pageMetadata } from '@/lib/page-meta';
import { topics, activeTopics, linksForTopic } from '@/lib/content';

type Props = { params: Promise<{ topic: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return activeTopics.map(topic => ({ topic }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const info = topics[topic];
  return info ? pageMetadata(`/links/${topic}/`, `${info.label} links for .NET developers`, info.description) : {};
}

export default async function TopicPage({ params }: Props) {
  const { topic } = await params;
  if (activeTopics.indexOf(topic) === -1) notFound();
  return <LinkLibrary topic={topic} links={linksForTopic(topic)} />;
}
