import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Guide, WrittenGuide } from '@/lib/content';

type Props = { guide: Guide | WrittenGuide; written?: boolean };

// One card for both kinds of guide: reading paths (ordered articles) and written how-tos.
export function GuideCard({ guide, written = false }: Props) {
  const kicker = written
    ? `Written guide · ${guide.sections.length} sections · Updated ${guide.reviewedLabel}`
    : `Reading guide · ${guide.sections.length} steps · Reviewed ${guide.reviewedLabel}`;
  return <Link className="guide-card" href={`/guides/${guide.slug}/`}>
    <span className="kicker">{kicker}</span>
    <span className="guide-card-title">{guide.title}</span>
    <span className="muted">{guide.description}</span>
    <span className="card-action">Read the guide<ArrowRight size={16} aria-hidden="true" /></span>
  </Link>;
}
