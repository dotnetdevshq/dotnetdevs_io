import playbookData from '@/content/playbook.json';
import rulesData from '@/content/playbook-rules.json';

export type PlaybookCheck = { name: string; test: boolean; what: string };
export type PlaybookSource = { label: string; path: string };
export type PlaybookPage = {
  slug: string; title: string; shortTitle: string; seoTitle: string; description: string; about: string[];
  reviewed: string; reviewedLabel: string; question: string; answer: string;
  takeaways: string[]; enforcedBy: PlaybookCheck[]; sources: PlaybookSource[];
};

export const playbook = playbookData;
export const playbookPages: PlaybookPage[] = playbookData.pages;
export const playbookPageBySlug = (slug: string) => playbookPages.find(page => page.slug === slug);

// The rule files are a snapshot of the playbook repository at one commit,
// written by scripts/sync-playbook.mjs. The repository stays the source of truth.
export const rulesSnapshot: { repository: string; commit: string; committed: string; files: Record<string, string> } = rulesData;
export const repositoryUrl = `https://github.com/${rulesSnapshot.repository}`;
export const sourceUrl = (path: string) => `${repositoryUrl}/blob/${rulesSnapshot.commit}/${path}`;

// The subset of Markdown that the rule files use: level 2 headings, paragraphs,
// bullet lists (an item may contain further blocks), tables, and fenced code.
export type Block =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: Block[][] }
  | { type: 'code'; text: string }
  | { type: 'table'; head: string[]; rows: string[][] };
export type RuleSection = { id: string; title: string; blocks: Block[] };
export type RuleFile = { path: string; intro: Block[]; sections: RuleSection[] };

const cells = (line: string) => line.trim().replace(/^\||\|$/g, '').split('|').map(cell => cell.trim());

function parseBlocks(lines: string[]): Block[] {
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '') { i++; continue; }
    if (line.startsWith('```')) {
      const end = lines.indexOf('```', i + 1);
      if (end === -1) throw new Error('Unclosed code block in a playbook rule file');
      blocks.push({ type: 'code', text: lines.slice(i + 1, end).join('\n') });
      i = end + 1;
    } else if (line.startsWith('|')) {
      const table: string[] = [];
      while (i < lines.length && lines[i].startsWith('|')) table.push(lines[i++]);
      blocks.push({ type: 'table', head: cells(table[0]), rows: table.slice(2).map(cells) });
    } else if (line.startsWith('- ')) {
      const items: Block[][] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        const item = [lines[i++].slice(2)];
        // Indented lines, and blank lines followed by an indented line, continue the item.
        while (i < lines.length && (lines[i].startsWith('  ') || (lines[i].trim() === '' && (lines[i + 1] ?? '').startsWith('  ')))) item.push(lines[i++].slice(2));
        items.push(parseBlocks(item));
        while (i < lines.length && lines[i].trim() === '' && (lines[i + 1] ?? '').startsWith('- ')) i++;
      }
      blocks.push({ type: 'list', items });
    } else if (line.startsWith('#')) {
      throw new Error(`Unsupported heading in a playbook rule file: ${line}`);
    } else {
      const paragraph: string[] = [];
      while (i < lines.length && lines[i].trim() !== '' && !/^(- |\||```|#)/.test(lines[i])) paragraph.push(lines[i++].trim());
      blocks.push({ type: 'paragraph', text: paragraph.join(' ') });
    }
  }
  return blocks;
}

const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function ruleFile(path: string, idPrefix = ''): RuleFile {
  const text = rulesSnapshot.files[path];
  if (!text) throw new Error(`Playbook rule file missing from the snapshot: ${path}. Run node scripts/sync-playbook.mjs`);
  // Drop the level 1 title. The page supplies its own heading.
  const [intro, ...parts] = text.split(/^## /m);
  return {
    path,
    intro: parseBlocks(intro.split('\n').slice(1)),
    sections: parts.map(part => {
      const [title, ...body] = part.split('\n');
      return { id: `${idPrefix}${slugify(title)}`, title: title.trim(), blocks: parseBlocks(body) };
    }),
  };
}
