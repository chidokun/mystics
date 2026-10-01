export function LenormandIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <rect x="7" y="11" width="18" height="27" rx="2" transform="rotate(-14 16 24.5)" />
      <rect x="23" y="11" width="18" height="27" rx="2" transform="rotate(14 32 24.5)" />
      <rect x="15" y="8" width="18" height="27" rx="2" fill="var(--icon-bg, var(--surface))" />
      <path d="M24 15L28 21.5L24 28L20 21.5Z" />
    </svg>
  );
}
