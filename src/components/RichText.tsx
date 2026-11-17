import { Fragment, type ReactNode } from 'react';
import { externalProps } from '@/lib/site';
import type { WrittenBlock } from '@/lib/content';

// Inline markup for written guides: **bold**, `code` and [text](url). Bold may contain code or links.
const TOKEN = /(\*\*.+?\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\))/g;

export function inline(text: string): ReactNode {
  return text.split(TOKEN).filter(Boolean).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return <strong key={i}>{inline(part.slice(2, -2))}</strong>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) return <a key={i} href={link[2]} {...externalProps(link[2])}>{inline(link[1])}</a>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function Block({ block }: { block: WrittenBlock }) {
  if ('p' in block) return <p>{inline(block.p)}</p>;
  if ('ul' in block) return <ul>{block.ul.map((item, i) => <li key={i}>{inline(item)}</li>)}</ul>;
  if ('ol' in block) return <ol>{block.ol.map((item, i) => <li key={i}>{inline(item)}</li>)}</ol>;
  if ('checklist' in block) return <ul className="checklist">{block.checklist.map((item, i) => <li key={i}><span className="check-box" aria-hidden="true" /><span>{inline(item)}</span></li>)}</ul>;
  if ('faq' in block) return <div className="faq-list">{block.faq.map(item => <div key={item.q} className="faq-item">
    <h3>{inline(item.q)}</h3>
    <p>{inline(item.a)}</p>
  </div>)}</div>;
  return <div className="table-wrap"><table>
    <thead><tr>{block.table.head.map(cell => <th key={cell} scope="col">{inline(cell)}</th>)}</tr></thead>
    <tbody>{block.table.rows.map((row, r) => <tr key={r}>{row.map((cell, c) => <td key={c}>{inline(cell)}</td>)}</tr>)}</tbody>
  </table></div>;
}
