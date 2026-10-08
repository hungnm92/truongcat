export function Logo({ size = 84 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" role="img" aria-label="Trường Cát Mệnh Lý">
      <rect x="6" y="6" width="84" height="84" rx="10" fill="#7a1f1f" />
      <rect x="12" y="12" width="72" height="72" rx="6" fill="none" stroke="#e9d9a8" strokeWidth="2" />
      <circle cx="48" cy="40" r="19" fill="none" stroke="#e9d9a8" strokeWidth="2" />
      <path d="M48 21a19 19 0 0 1 0 38a9.5 9.5 0 0 1 0-19a9.5 9.5 0 0 0 0-19z" fill="#e9d9a8" />
      <circle cx="48" cy="30.5" r="2.8" fill="#7a1f1f" />
      <circle cx="48" cy="49.5" r="2.8" fill="#e9d9a8" />
      <text x="48" y="76" textAnchor="middle" fontFamily="'Noto Serif', serif" fontWeight="700" fontSize="10.5" fill="#e9d9a8" letterSpacing=".3" textLength="62" lengthAdjust="spacingAndGlyphs">TRƯỜNG CÁT</text>
    </svg>
  )
}
