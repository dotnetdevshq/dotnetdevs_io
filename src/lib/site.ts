import config from '@/config/site.json';
export const site = config;
export function validDestination(value: string | null, allowMail = false): value is string {
  if (!value || value.trim() !== value) return false;
  try {
    const url = new URL(value);
    return (url.protocol === 'https:' && !!url.hostname && !url.username && !url.password) || (allowMail && url.protocol === 'mailto:' && !!url.pathname);
  } catch { return false; }
}
export const socialLinks = site.socials.filter(link => link.enabled && validDestination(link.url)).sort((a, b) => a.order - b.order);
// Samples can only render in a local development process, never a production build.
export const isDesignPreview = process.env.NODE_ENV === 'development' && process.env.SOCIAL_PREVIEW === '1';
export const isStaging = process.env.SITE_NOINDEX === '1'
  || process.env.VERCEL_ENV === 'preview'
  || (process.env.CF_PAGES === '1' && !!process.env.CF_PAGES_BRANCH && process.env.CF_PAGES_BRANCH !== (process.env.SITE_PRODUCTION_BRANCH || 'main'));
export const isIndexable = !isStaging && !isDesignPreview;
