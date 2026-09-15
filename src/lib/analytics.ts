import { site } from '@/lib/site';

// The exported site is also served locally and on review URLs. Only the canonical
// production hostname should send visits to the owner's analytics property.
const hostname = JSON.stringify(new URL(site.canonicalUrl).hostname);
const measurementId = JSON.stringify(site.googleAnalyticsId);

export const analyticsInitScript = `
if (window.location.hostname === ${hostname}) {
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', ${measurementId});
  var googleTag = document.createElement('script');
  googleTag.async = true;
  googleTag.src = 'https://www.googletagmanager.com/gtag/js?id=' + ${measurementId};
  document.head.appendChild(googleTag);
}
`;
