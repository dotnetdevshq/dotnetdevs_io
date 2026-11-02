import { externalProps } from '@/lib/site';

export function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} {...externalProps(href)}>{children}</a>;
}
