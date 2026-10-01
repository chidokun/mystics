export function NumerologyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="8" y="8" width="32" height="32" rx="2" />
      <path d="M18.7 8V40M29.3 8V40M8 18.7H40M8 29.3H40" strokeWidth="1" />
      <path d="M10 38L38 10" strokeLinecap="round" />
      <path d="M31 10H38V17" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
