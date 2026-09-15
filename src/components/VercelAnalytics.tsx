'use client';

import { Analytics } from '@vercel/analytics/next';
import { useEffect, useState } from 'react';

export function VercelAnalytics({ hostname }: { hostname: string }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(window.location.hostname === hostname);
  }, [hostname]);

  return enabled ? <Analytics /> : null;
}
