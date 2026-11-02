'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { consentKey, consentMaxAgeDays } from '@/lib/analytics';

type Choice = 'granted' | 'denied';
const openEvent = 'dotnetdevs:cookie-settings';

type AnalyticsWindow = Window & { dotnetdevsLoadAnalytics?: () => void; gtag?: unknown };

function readChoice(): Choice | null {
  try {
    const saved = JSON.parse(window.localStorage.getItem(consentKey) || 'null');
    if (!saved?.at || Date.now() - Date.parse(saved.at) > consentMaxAgeDays * 864e5) return null;
    return saved.analytics === 'granted' || saved.analytics === 'denied' ? saved.analytics : null;
  } catch { return null; }
}

// Remove Google Analytics cookies (_ga, _ga_<id>) on this host and the parent domain.
function clearAnalyticsCookies() {
  const host = window.location.hostname;
  const domains = ['', host, `.${host.replace(/^www\./, '')}`];
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0].trim();
    if (!name.startsWith('_ga')) continue;
    for (const domain of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${domain ? `; domain=${domain}` : ''}`;
    }
  }
}

// Asks once, before any analytics cookie is set. Both choices are equally easy, and
// "Cookie settings" in the footer reopens it so the choice can be changed later.
export function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(readChoice() === null);
    const reopen = () => setOpen(true);
    window.addEventListener(openEvent, reopen);
    return () => window.removeEventListener(openEvent, reopen);
  }, []);

  function choose(choice: Choice) {
    const previous = readChoice();
    try { window.localStorage.setItem(consentKey, JSON.stringify({ analytics: choice, at: new Date().toISOString(), v: 1 })); } catch { /* Storage blocked: ask again next visit. */ }
    setOpen(false);
    const w = window as AnalyticsWindow;
    if (choice === 'granted') { w.dotnetdevsLoadAnalytics?.(); return; }
    clearAnalyticsCookies();
    // Analytics was already running on this page: stop it by reloading without it.
    if (previous === 'granted' && w.gtag) window.location.reload();
  }

  if (!open) return null;
  return <section className="cookie-banner" aria-label="Cookie choices">
    <div className="cookie-banner-inner">
      <p>
        <strong>Cookies on dotnetdevs.io.</strong> We would like to use Google Analytics cookies to see which pages and
        articles are useful. They are only set if you accept. No advertising cookies are used.{' '}
        <Link href="/privacy/#cookies">Privacy and cookies</Link>
      </p>
      <div className="cookie-actions">
        <button type="button" className="button button-small button-secondary" onClick={() => choose('denied')}>Reject</button>
        <button type="button" className="button button-small button-secondary" onClick={() => choose('granted')}>Accept analytics</button>
      </div>
    </div>
  </section>;
}

export function CookieSettingsButton() {
  return <button type="button" className="footer-button" onClick={() => window.dispatchEvent(new Event(openEvent))}>Cookie settings</button>;
}
