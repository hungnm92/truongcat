// Hình trang trí tự vẽ cho Trường Cát.
const TRI = ['☰', '☱', '☲', '☳', '☴', '☵', '☶', '☷']

export function YinYang({ size = 64, fg = '#efe2bf', bg = '#1d3a2c' }: { size?: number; fg?: string; bg?: string }) {
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" aria-hidden>
      <circle r="48" fill={bg} stroke={fg} strokeWidth="2" />
      <path d="M0 -46a46 46 0 0 1 0 92a23 23 0 0 1 0 -46a23 23 0 0 0 0 -46z" fill={fg} />
      <circle cy="-23" r="6" fill={fg} />
      <circle cy="23" r="6" fill={bg} />
    </svg>
  )
}

export function Mandala({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="-130 -130 260 260" aria-hidden>
      <defs>
        <radialGradient id="glow" r="0.6"><stop offset="0" stopColor="#d9bd7a" stopOpacity=".35" /><stop offset="1" stopColor="#d9bd7a" stopOpacity="0" /></radialGradient>
      </defs>
      <circle r="125" fill="url(#glow)" />
      <rect x="-82" y="-82" width="164" height="164" fill="none" stroke="#d9bd7a55" transform="rotate(45)" />
      <rect x="-82" y="-82" width="164" height="164" fill="none" stroke="#d9bd7a33" />
      <circle r="100" fill="none" stroke="#d9bd7a44" strokeDasharray="2 5" />
      <circle r="62" fill="none" stroke="#d9bd7a77" />
      {TRI.map((t, i) => {
        const a = (i * 45 * Math.PI) / 180
        return <text key={t} x={Math.sin(a) * 82} y={-Math.cos(a) * 82} fontSize="17" fill="#d9bd7a" textAnchor="middle" dominantBaseline="central">{t}</text>
      })}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 * Math.PI) / 180
        return <circle key={i} cx={Math.sin(a) * 112} cy={-Math.cos(a) * 112} r={i % 3 === 0 ? 2.6 : 1.4} fill="#efe2bf" opacity=".8" />
      })}
      <g transform="translate(-34 -34)"><foreignObject width="68" height="68"><YinYang size={68} /></foreignObject></g>
    </svg>
  )
}

export function Orbit() {
  const dots = [
    [0.2, 70], [1.4, 95], [2.3, 70], [3.1, 120], [4.0, 95], [4.9, 120], [5.7, 70], [0.9, 120],
  ] as const
  return (
    <svg viewBox="-150 -150 300 300" style={{ width: '100%', maxWidth: 330, display: 'block', margin: '0 auto' }} aria-hidden>
      <circle r="145" fill="#1d3a2c" />
      <circle r="145" fill="none" stroke="#d9bd7a" strokeOpacity=".5" strokeWidth="3" />
      {[70, 95, 120].map((r) => <circle key={r} r={r} fill="none" stroke="#d9bd7a" strokeOpacity=".25" strokeDasharray={r === 95 ? '3 6' : undefined} />)}
      <polygon points={dots.map(([a, r]) => `${Math.cos(a) * r},${Math.sin(a) * r}`).join(' ')} fill="none" stroke="#d9bd7a" strokeOpacity=".3" />
      {dots.map(([a, r], i) => <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={i % 3 ? 3 : 5} fill="#efe2bf" />)}
      <circle r="30" fill="#6e1f1c" />
      <circle r="30" fill="none" stroke="#d9bd7a" strokeWidth="2" />
      <path d="M0 -30a30 30 0 0 1 0 60a15 15 0 0 1 0 -30a15 15 0 0 0 0 -30z" fill="#efe2bf" opacity=".9" />
    </svg>
  )
}
