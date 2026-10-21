// The <·> mark, inlined so it is crisp at any size and needs no request. Source: public/brand/mark.svg.
export function LogoMark({ size = 40 }: { size?: number }) {
  return <svg className="logo-mark" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
    <rect width="64" height="64" rx="16" fill="#6341b5" />
    <path d="M25 19 12.5 32 25 45M39 19 51.5 32 39 45" fill="none" stroke="#fff" strokeWidth="5.2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="32" cy="32" r="4.6" fill="#fff" />
  </svg>;
}
