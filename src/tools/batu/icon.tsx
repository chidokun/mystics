/** Bốn cột trụ */
export function BatuIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 10H42M6 40H42" />
      <rect x="9" y="14" width="6" height="22" rx="1" />
      <rect x="17.5" y="14" width="6" height="22" rx="1" />
      <rect x="26" y="14" width="6" height="22" rx="1" />
      <rect x="34.5" y="14" width="6" height="22" rx="1" />
      <path d="M9 25H15M17.5 25H23.5M26 25H32M34.5 25H40.5" strokeWidth="1" />
    </svg>
  );
}
