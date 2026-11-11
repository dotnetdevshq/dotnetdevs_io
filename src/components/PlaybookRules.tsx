import { Fragment } from 'react';
import { ExternalLink } from './ExternalLink';
import type { Block, RuleFile } from '@/lib/playbook';

// Inline Markdown used by the rule files: `code`, [text](url) and **bold**.
function Inline({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g);
  return <>{parts.map((part, i) => {
    if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) return <ExternalLink key={i} href={link[2]}><Inline text={link[1]} /></ExternalLink>;
    return <Fragment key={i}>{part}</Fragment>;
  })}</>;
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return <>{blocks.map((block, i) => {
    if (block.type === 'paragraph') return <p key={i}><Inline text={block.text} /></p>;
    if (block.type === 'code') return <pre key={i} className="code-block"><code>{block.text}</code></pre>;
    if (block.type === 'table') return <div key={i} className="table-wrap"><table>
      <thead><tr>{block.head.map(cell => <th key={cell} scope="col"><Inline text={cell} /></th>)}</tr></thead>
      <tbody>{block.rows.map((row, r) => <tr key={r}>{row.map((cell, c) => <td key={c}><Inline text={cell} /></td>)}</tr>)}</tbody>
    </table></div>;
    return <ul key={i}>{block.items.map((item, j) => <li key={j}>
      {/* A one-paragraph item renders inline, so the list keeps its normal spacing. */}
      {item.length === 1 && item[0].type === 'paragraph' ? <Inline text={item[0].text} /> : <Blocks blocks={item} />}
    </li>)}</ul>;
  })}</>;
}

// Renders one rule file from the repository snapshot, section by section.
export function PlaybookRules({ file }: { file: RuleFile }) {
  return <>
    <Blocks blocks={file.intro} />
    {file.sections.map(section => <section key={section.id} aria-labelledby={section.id}>
      <h3 id={section.id}>{section.title}</h3>
      <Blocks blocks={section.blocks} />
    </section>)}
  </>;
}
