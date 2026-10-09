import { useEffect, useRef, useState } from 'react'
import { toBlob } from 'html-to-image'
import { SON24, starTone, type Cell, type HKChart } from '../lib/fengshui'

const DIRS: { cell: Exclude<Cell, 'C'>; deg: number; label: string }[] = [
  { cell: 'N', deg: 0, label: 'BẮC' }, { cell: 'NE', deg: 45, label: 'ĐÔNG BẮC' }, { cell: 'E', deg: 90, label: 'ĐÔNG' },
  { cell: 'SE', deg: 135, label: 'ĐÔNG NAM' }, { cell: 'S', deg: 180, label: 'NAM' }, { cell: 'SW', deg: 225, label: 'TÂY NAM' },
  { cell: 'W', deg: 270, label: 'TÂY' }, { cell: 'NW', deg: 315, label: 'TÂY BẮC' },
]
const TONE_COLOR = { cat: '#2f6b3f', binh: '#7a7062', hung: '#a12a2a' } as const
const R = { deg: 203, tick: 192, sonOut: 180, sonIn: 156, dirIn: 132 }

const rad = (d: number) => (d * Math.PI) / 180
const pt = (deg: number, r: number) => [Math.sin(rad(deg)) * r, -Math.cos(rad(deg)) * r] as const
/** Xoay chữ theo tiếp tuyến, lật ở nửa dưới cho dễ đọc. */
const tangent = (screenDeg: number) => { const s = ((screenDeg % 360) + 360) % 360; return s > 90 && s < 270 ? s + 180 : s }

export function FlyingStarDial({ hk, facing }: { hk: HKChart; facing: number }) {
  const [mode, setMode] = useState<'house' | 'north'>('house')
  const [img, setImg] = useState<string | null>(null)
  const [opacity, setOpacity] = useState(0.85)
  const [scale, setScale] = useState(1)
  const [imgRot, setImgRot] = useState(0)
  const [msg, setMsg] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => () => { if (img) URL.revokeObjectURL(img) }, [img])

  // Góc màn hình = góc la bàn + rot. "Theo nhà": hướng nhà quay xuống dưới như bản vẽ mặt bằng.
  const rot = mode === 'house' ? 180 - facing : 0
  const S = (deg: number) => deg + rot
  const sitting = (facing + 180) % 360
  const tonCell = DIRS.find((d) => Math.abs(((sitting - d.deg + 540) % 360) - 180) <= 22.5)?.cell
  const huongCell = DIRS.find((d) => Math.abs(((facing - d.deg + 540) % 360) - 180) <= 22.5)?.cell
  const side = 210 * scale

  const onFile = (f?: File) => {
    if (!f) return
    if (!f.type.startsWith('image/')) { setMsg('Vui lòng chọn file ảnh (png, jpg, webp…).'); return }
    setImg(URL.createObjectURL(f)); setMsg('')
  }
  const save = async () => {
    if (!ref.current) return
    try {
      const blob = await toBlob(ref.current, { backgroundColor: '#fbf6ec', pixelRatio: 2 })
      if (!blob) throw new Error()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = `phi-tinh-${hk.tonSon}-${hk.huong}.png`; a.click(); URL.revokeObjectURL(url)
    } catch { setMsg('Không tạo được ảnh.') }
  }

  const badge = (cell: Cell, x: number, y: number) => {
    const c = hk.cells[cell]
    const ring = cell === tonCell ? '#2f5b8a' : cell === huongCell ? '#a12a2a' : '#d9bd7a'
    return (
      <g key={cell} transform={`translate(${x} ${y})`}>
        <rect x={-25} y={-25} width={50} height={50} rx={9} fill="#fffdf8" fillOpacity=".92" stroke={ring} strokeWidth={cell === tonCell || cell === huongCell ? 2 : 1} />
        <text y={-4} textAnchor="middle" fontFamily="Playfair Display, serif" fontWeight="700" fontSize="19" fill={TONE_COLOR[starTone(c.van, hk.van)]}>{c.van}</text>
        <text y={10} textAnchor="middle" fontSize="10" fontWeight="600">
          <tspan fill={TONE_COLOR[starTone(c.son, hk.van)]}>{c.son}</tspan><tspan fill="#7a7062"> · </tspan><tspan fill={TONE_COLOR[starTone(c.huong, hk.van)]}>{c.huong}</tspan>
        </text>
        <text y={21} textAnchor="middle" fontSize="7.5" fill={c.year === 5 || c.year === 2 ? '#a12a2a' : '#7a7062'}>năm {c.year}</text>
        {cell === tonCell && <text y={-29} textAnchor="middle" fontSize="7" fontWeight="700" fill="#2f5b8a" letterSpacing=".1em">TỌA</text>}
        {cell === huongCell && <text y={-29} textAnchor="middle" fontSize="7" fontWeight="700" fill="#a12a2a" letterSpacing=".1em">HƯỚNG</text>}
      </g>
    )
  }

  return (
    <div>
      <div className="row" style={{ flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        <div className="sub" style={{ margin: 0, flex: 'none' }}>
          <button className={mode === 'house' ? 'on' : ''} onClick={() => setMode('house')}>Theo nhà (cửa xuống dưới)</button>
          <button className={mode === 'north' ? 'on' : ''} onClick={() => setMode('north')}>Bắc lên trên</button>
        </div>
        <label className="btn ghost sm" style={{ flex: 'none', cursor: 'pointer' }}>
          🏠 {img ? 'Đổi mặt bằng' : 'Tải ảnh mặt bằng'}
          <input type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
        {img && <button className="btn ghost sm" style={{ flex: 'none' }} onClick={() => setImg(null)}>Bỏ ảnh</button>}
        <button className="btn ghost sm" style={{ flex: 'none' }} onClick={save}>⬇ Lưu ảnh la bàn</button>
      </div>
      {img && (
        <div className="row small" style={{ flexWrap: 'wrap', gap: 14, marginBottom: 8 }}>
          <label style={{ flex: '1 1 160px' }}>Độ đậm ảnh <input type="range" min={0.2} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(+e.target.value)} style={{ width: '100%' }} /></label>
          <label style={{ flex: '1 1 160px' }}>Tỉ lệ <input type="range" min={0.5} max={1.6} step={0.05} value={scale} onChange={(e) => setScale(+e.target.value)} style={{ width: '100%' }} /></label>
          <button className="btn ghost sm" style={{ flex: 'none' }} onClick={() => setImgRot((r) => (r + 90) % 360)}>↻ Xoay ảnh 90°</button>
        </div>
      )}
      {msg && <p className="err">{msg}</p>}

      <div ref={ref} className="dial-wrap">
        <svg viewBox="-215 -215 430 430" className="dial" role="img" aria-label={`La bàn phi tinh tọa ${hk.tonSon} hướng ${hk.huong}`}>
          <defs><clipPath id="dial-clip"><circle r={R.dirIn} /></clipPath></defs>
          <circle r={R.tick} fill="#fffdf8" stroke="#2b2620" strokeWidth="1.2" />
          {img && (
            <g clipPath="url(#dial-clip)">
              <image href={img} x={-side / 2} y={-side / 2} width={side} height={side} opacity={opacity} preserveAspectRatio="xMidYMid meet" transform={`rotate(${imgRot})`} />
            </g>
          )}

          {/* vạch độ */}
          {Array.from({ length: 360 }, (_, d) => {
            const len = d % 10 === 0 ? 11 : d % 5 === 0 ? 7 : 3.5
            const [x1, y1] = pt(S(d), R.tick), [x2, y2] = pt(S(d), R.tick - len)
            return <line key={d} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2b2620" strokeWidth={d % 10 === 0 ? 0.9 : 0.5} />
          })}
          {Array.from({ length: 36 }, (_, k) => {
            const d = k * 10, [x, y] = pt(S(d), R.deg)
            return <text key={d} x={x} y={y} fontSize="8.5" textAnchor="middle" dominantBaseline="central" fill={d % 90 === 0 ? '#a12a2a' : '#2b2620'} fontWeight={d % 90 === 0 ? 700 : 400} transform={`rotate(${tangent(S(d))} ${x} ${y})`}>{d}</text>
          })}

          {/* vòng 24 sơn */}
          <circle r={R.sonOut} fill="none" stroke="#2b2620" strokeWidth=".8" />
          <circle r={R.sonIn} fill="none" stroke="#2b2620" strokeWidth=".8" />
          {SON24.map((s, i) => {
            const center = i * 15
            const [bx1, by1] = pt(S(center + 7.5), R.sonIn), [bx2, by2] = pt(S(center + 7.5), R.sonOut)
            const [x, y] = pt(S(center), (R.sonIn + R.sonOut) / 2)
            const on = s === hk.tonSon || s === hk.huong
            return (
              <g key={s}>
                <line x1={bx1} y1={by1} x2={bx2} y2={by2} stroke="#2b2620" strokeWidth=".6" />
                <text x={x} y={y} fontSize="9.5" fontWeight={on ? 800 : 600} textAnchor="middle" dominantBaseline="central" fill={s === hk.huong ? '#a12a2a' : s === hk.tonSon ? '#2f5b8a' : '#2b2620'} transform={`rotate(${tangent(S(center))} ${x} ${y})`}>{s.toUpperCase()}</text>
              </g>
            )
          })}

          {/* vòng 8 hướng + đường chia cung qua tâm */}
          <circle r={R.dirIn} fill="none" stroke="#2b2620" strokeWidth=".8" />
          {DIRS.map((d) => {
            const [lx1, ly1] = pt(S(d.deg + 22.5), 0), [lx2, ly2] = pt(S(d.deg + 22.5), R.sonIn)
            const [x, y] = pt(S(d.deg), (R.dirIn + R.sonIn) / 2)
            return (
              <g key={d.cell}>
                <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="#2b2620" strokeOpacity=".45" strokeWidth=".7" strokeDasharray="3 3" />
                <text x={x} y={y} fontSize="8.5" fontWeight="700" letterSpacing=".08em" textAnchor="middle" dominantBaseline="central" fill="#1d3a2c" transform={`rotate(${tangent(S(d.deg))} ${x} ${y})`}>{d.label}</text>
              </g>
            )
          })}
          {/* 24 tia mảnh như bản vẽ */}
          {SON24.map((_, i) => {
            const [x2, y2] = pt(S(i * 15 + 7.5), R.dirIn)
            return <line key={i} x1={0} y1={0} x2={x2} y2={y2} stroke="#2b2620" strokeOpacity=".12" strokeWidth=".5" />
          })}

          {/* trục tọa – hướng */}
          {(() => {
            const [hx, hy] = pt(S(facing), R.dirIn - 4), [tx, ty] = pt(S(sitting), R.dirIn - 4)
            return (
              <g>
                <line x1={tx} y1={ty} x2={hx} y2={hy} stroke="#a12a2a" strokeWidth="1.4" strokeDasharray="6 4" />
                <circle cx={hx} cy={hy} r="4" fill="#a12a2a" />
                <circle cx={tx} cy={ty} r="4" fill="#2f5b8a" />
              </g>
            )
          })()}

          {/* sao phi tinh trong từng cung */}
          {DIRS.map((d) => { const [x, y] = pt(S(d.deg), 92); return badge(d.cell, x, y) })}
          {badge('C', 0, 0)}
        </svg>
      </div>
      <p className="small center-text">
        Hướng nhà {Math.round(facing)}° ({hk.huong}) – tọa {hk.tonSon}. Ô viền đỏ là cung hướng, viền xanh là cung tọa. Mỗi ô: sao vận (lớn), sơn · hướng, sao năm {hk.year}.
        {img ? ' Ảnh mặt bằng chỉ hiển thị trên máy bạn, không được tải lên đâu.' : ' Có thể tải ảnh mặt bằng (cửa chính đặt ở cạnh dưới ảnh) để xem sao rơi vào phòng nào.'}
      </p>
    </div>
  )
}
