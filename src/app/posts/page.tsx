import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SiteChrome } from '@/components/SiteChrome';
import { pageMetadata } from '@/lib/page-meta';
import { posts, topics, sourceName, formatDate } from '@/lib/content';
import { externalProps } from '@/lib/site';

export const metadata: Metadata = pageMetadata('/posts/', 'Social posts archive',
  'Visual explainers shared on the .NET Developers social channels, each with a summary and a link to the original article.');

export default function PostsPage() {
  return <SiteChrome current="/posts/">
    <div className="container page">
    <section className="page-intro" aria-labelledby="page-title">
      <p className="eyebrow">From our social channels</p>
      <h1 id="page-title">Posts</h1>
      <p className="lead">Cards we have shared on LinkedIn, Instagram and our other channels, with a short summary and a link to the article each one is based on. The ideas and code belong to the original authors.</p>
    </section>
    <section className="content-section" aria-label="All posts">
      <ul className="post-grid">
        {posts.map(post => <li key={post.slug} id={post.slug}>
          <article className="post-card">
            <Image src={post.image} alt={post.imageAlt} width={1080} height={1350} unoptimized />
            <div className="post-body">
              <h2>{post.title}</h2>
              <p className="link-meta">Based on <a className="post-source" href={post.source.url} {...externalProps(post.source.url)}>{post.source.title}<ArrowUpRight size={14} aria-hidden="true" /></a></p>
              <p className="link-meta">{post.source.author} · {sourceName(post.source.url)} · {formatDate(post.source.published)}</p>
              <p>{post.summary}</p>
              {post.caveats && <p><strong>Worth knowing:</strong> {post.caveats}</p>}
              <ul className="topic-chips" aria-label="Topics">
                {post.topics.filter(t => topics[t]).map(t => <li key={t}><Link href={`/links/${t}/`}>{topics[t].label}</Link></li>)}
              </ul>
            </div>
          </article>
        </li>)}
      </ul>
    </section>
    <p className="page-note">Summaries are dotnetdevs.io commentary written from the linked articles.</p>
    </div>
  </SiteChrome>;
}
