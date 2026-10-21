'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export type SearchItem = { title: string; url: string; meta: string; issue: number; issueUrl: string };

// Filters the server-rendered library in the browser. Without JavaScript the full list (children) still renders.
export function LibrarySearch({ items, children, placeholder }: { items: SearchItem[]; children: React.ReactNode; placeholder: string }) {
  const [query, setQuery] = useState('');
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const active = query.trim().length >= 2;
  // A few hundred short strings: filtering on every keystroke is instant, no memoization needed.
  const results = !active ? [] : items.filter(item => {
    const haystack = `${item.title} ${item.meta}`.toLowerCase();
    return terms.every(term => haystack.indexOf(term) !== -1);
  });

  return <>
    <form role="search" className="library-search" onSubmit={event => event.preventDefault()}>
      <label htmlFor="library-q" className="sr-only">Search the library</label>
      <Search className="search-icon" size={18} aria-hidden="true" />
      <input id="library-q" type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={placeholder} autoComplete="off" />
    </form>
    {active
      ? <section aria-live="polite" aria-label="Search results">
          <p className="results-count">{results.length === 0 ? `No links match “${query.trim()}”.` : `${results.length} ${results.length === 1 ? 'link matches' : 'links match'} “${query.trim()}”`}</p>
          <ul className="row-list">
            {results.map(item => <li key={item.url} className="row-card">
              <a className="row-title" href={item.url}>{item.title}</a>
              <div className="row-meta-line"><span className="row-meta">{item.meta}</span><a className="row-issue" href={item.issueUrl}>Issue {item.issue}</a></div>
            </li>)}
          </ul>
        </section>
      : children}
  </>;
}
