import { site } from '@/lib/site';

// Google Analytics sets cookies. Visitors in the EU/EEA, the UK and Switzerland must
// opt in first, so for them it loads only after Accept analytics in the cookie banner
// (Google's "basic" consent mode: nothing is sent before that). Everywhere else it
// loads by default, and Cookie settings in the footer turns it off.
// The choice is kept in localStorage under consentKey and expires after a year.
// Vercel Web Analytics is cookieless and is not gated by this choice.
export const consentKey = 'dotnetdevs-consent';
export const consentMaxAgeDays = 365;

// The site is a static export with no server, so the region comes from the browser's
// time zone. The match is deliberately wide: every Europe/ zone (which also covers
// non-EEA countries), the EEA zones outside that prefix (Atlantic islands, Cyprus,
// Ceuta, Svalbard, the French overseas regions), legacy aliases, and UTC or unknown
// zones, which privacy browsers report. When in doubt, ask.
export const consentZonePattern =
  '^(Europe/|Atlantic/(Canary|Madeira|Azores|Reykjavik|Faroe|Faeroe|Jan_Mayen)$|Asia/(Nicosia|Famagusta)$|Africa/Ceuta$|Arctic/Longyearbyen$|' +
  'America/(Cayenne|Martinique|Guadeloupe|Marigot|St_Barthelemy)$|Indian/(Reunion|Mayotte)$|' +
  '(GB|GB-Eire|Eire|Iceland|Poland|Portugal|CET|MET|EET|WET|CEST|UTC|UCT|GMT|Universal|Zulu|Greenwich)$|Etc/)';

// Plain JavaScript shared by the inline loader below and the banner component.
// A browser sending Global Privacy Control is treated as needing to opt in, wherever it is.
const consentRequiredSource = `function(){
    try {
      if (navigator.globalPrivacyControl) return true;
      var zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return !zone || new RegExp(${JSON.stringify(consentZonePattern)}).test(zone);
    } catch (e) { return true; }
  }`;

export function consentRequired(): boolean {
  try {
    if ((navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl) return true;
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return !zone || new RegExp(consentZonePattern).test(zone);
  } catch { return true; }
}

// The exported site is also served locally and on review URLs. Only the canonical
// production hostname should send visits to the owner's analytics property.
const hostname = JSON.stringify(new URL(site.canonicalUrl).hostname);
const measurementId = JSON.stringify(site.googleAnalyticsId);

export const analyticsInitScript = `
(function(){
  if (window.location.hostname !== ${hostname}) return;
  var loaded = false;
  var consentRequired = ${consentRequiredSource};
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
  var choice = null;
  try {
    var saved = JSON.parse(localStorage.getItem(${JSON.stringify(consentKey)}) || 'null');
    var fresh = saved && saved.at && (Date.now() - Date.parse(saved.at)) < ${consentMaxAgeDays} * 864e5;
    if (fresh && (saved.analytics === 'granted' || saved.analytics === 'denied')) choice = saved.analytics;
  } catch (e) {}
  // A saved choice always wins. Without one, load only where opt-in is not required.
  if (choice === 'granted' || (choice === null && !consentRequired())) window.dotnetdevsLoadAnalytics();
})();
`;
