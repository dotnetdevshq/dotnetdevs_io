import { site } from '@/lib/site';

// Google Analytics sets cookies, so it loads only after a visitor accepts analytics
// in the cookie banner (Google's "basic" consent mode: nothing is sent before that).
// The choice is kept in localStorage under consentKey and expires after a year.
// Vercel Web Analytics is cookieless and is not gated by this choice.
export const consentKey = 'dotnetdevs-consent';
export const consentMaxAgeDays = 365;

// The exported site is also served locally and on review URLs. Only the canonical
// production hostname should send visits to the owner's analytics property.
const hostname = JSON.stringify(new URL(site.canonicalUrl).hostname);
const measurementId = JSON.stringify(site.googleAnalyticsId);

export const analyticsInitScript = `
(function(){
  if (window.location.hostname !== ${hostname}) return;
  var loaded = false;
  window.dotnetdevsLoadAnalytics = function(){
    if (loaded) return;
    loaded = true;
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    gtag('js', new Date());
    gtag('config', ${measurementId}, { allow_google_signals: false, allow_ad_personalization_signals: false });
    var googleTag = document.createElement('script');
    googleTag.async = true;
    googleTag.src = 'https://www.googletagmanager.com/gtag/js?id=' + ${measurementId};
    document.head.appendChild(googleTag);
  };
  try {
    var saved = JSON.parse(localStorage.getItem(${JSON.stringify(consentKey)}) || 'null');
    var fresh = saved && saved.at && (Date.now() - Date.parse(saved.at)) < ${consentMaxAgeDays} * 864e5;
    if (fresh && saved.analytics === 'granted') window.dotnetdevsLoadAnalytics();
  } catch (e) {}
})();
`;
