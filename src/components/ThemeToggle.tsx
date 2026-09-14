'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    const system = window.matchMedia('(prefers-color-scheme: dark)');
    const sync = () => setDark(document.documentElement.dataset.theme
      ? document.documentElement.dataset.theme === 'dark'
      : system.matches);
    sync();
    system.addEventListener('change', sync);
    return () => system.removeEventListener('change', sync);
  }, []);

  function toggle() {
    const next = dark ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    setDark(!dark);
    try { window.localStorage.setItem('dotnetdevs-theme', next); } catch { /* Remain usable when storage is blocked. */ }
  }

  const label = dark ? 'Switch to light mode' : 'Switch to dark mode';
  return <button type="button" className="theme-toggle" data-ready={dark !== null} disabled={dark === null} onClick={toggle} aria-label={label} title={label}>
    {dark ? <Sun size={19} aria-hidden="true" /> : <Moon size={19} aria-hidden="true" />}
  </button>;
}
