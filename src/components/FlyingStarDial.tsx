import { useEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent } from 'react'
import { toBlob } from 'html-to-image'
import { SON24, STAR_NOTE, starTone, type Cell, type HKChart } from '../lib/fengshui'
import { DIR_VI, KHUYET, houseCenter, nineGrid, normRect, type CenterMode, type GridCell, type Rect } from '../lib/plan'

const DIRS: { cell: Exclude<Cell, 'C'>; deg: number; label: string }[] = [
  { cell: 'N', deg: 0, label: 'BẮC' }, { cell: 'NE', deg: 45, label: 'ĐÔNG BẮC' }, { cell: 'E', deg: 90, label: 'ĐÔNG' },
  { cell: 'SE', deg: 135, label: 'ĐÔNG NAM' }, { cell: 'S', deg: 180, label: 'NAM' }, { cell: 'SW', deg: 225, label: 'TÂY NAM' },
  { cell: 'W', deg: 270, label: 'TÂY' }, { cell: 'NW', deg: 315, label: 'TÂY BẮC' },
]
const TONE_COLOR = { cat: '#2f6b3f', binh: '#7a7062', hung: '#a12a2a' } as const
const R = { deg: 203, tick: 192, sonOut: 180, sonIn: 156, dirIn: 132 }
const QUAI_HANH: Record<Exclude<Cell, 'C'>, { hanh: string; remedy: string }> = {
  NW: { hanh: 'Kim', remedy: 'vật kim loại, chuông gió, màu trắng/ánh kim' },
  W: { hanh: 'Kim', remedy: 'vật kim loại, màu trắng/ánh kim' },
  SW: { hanh: 'Thổ', remedy: 'đá, gốm sứ, đèn vàng ấm' },
  NE: { hanh: 'Thổ', remedy: 'đá, gốm sứ, màu vàng/nâu đất' },
  E: { hanh: 'Mộc', remedy: 'cây xanh, đồ gỗ' },
  SE: { hanh: 'Mộc', remedy: 'cây xanh, đồ gỗ' },
  N: { hanh: 'Thủy', remedy: 'bể cá, nước, màu xanh đậm/đen' },
  S: { hanh: 'Hỏa', remedy: 'đèn sáng, màu đỏ' },
}

const rad = (d: number) => (d * Math.PI) / 180
const pt = (deg: number, r: number) => [Math.sin(rad(deg)) * r, -Math.cos(rad(deg)) * r] as const
const tangent = (screenDeg: number) => { const s = ((screenDeg % 360) + 360) % 360; return s > 90 && s < 270 ? s + 180 : s }

interface Plan { url: string; W: number; H: number; frame: Rect; cuts: Rect[]; centerMode: CenterMode }
type Handle = 'nw' | 'ne' | 'sw' | 'se' | 'move'
type Drag = { kind: 'frame' | 'cut'; idx: number; handle: Handle; sx: number; sy: number; r0: Rect }

// ---------------- La bàn ----------------
export function Dial({ hk, facing, mode, plan, center, opacity }: { hk: HKChart; facing: number; mode: 'house' | 'north'; plan: Plan | null; center: { x: number; y: number } | null; opacity: number }) {
  const rot = mode === 'house' ? 180 - facing : 0
  const S = (deg: number) => deg + rot
  const sitting = (facing + 180) % 360
  const near = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180) <= 22.5
  const tonCell = DIRS.find((d) => near(sitting, d.deg))?.cell
  const huongCell = DIRS.find((d) => near(facing, d.deg))?.cell

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

  // Ảnh: tâm nhà trùng tâm la bàn, khung nhà vừa trong vòng 8 hướng. Bản vẽ đặt cửa ở dưới nên ở chế độ "Bắc lên trên" phải xoay ảnh.
  let planLayer = null
  if (plan && center) {
    const s = (R.dirIn - 4) / (0.5 * Math.hypot(plan.frame.w, plan.frame.h))
    const t = `rotate(${rot - (180 - facing)}) scale(${s}) translate(${-center.x} ${-center.y})`
    const f = plan.frame
    planLayer = (
      <g clipPath="url(#dial-clip)">
        <g transform={t}>
          <image href={plan.url} x={0} y={0} width={plan.W} height={plan.H} opacity={opacity} />
          <rect x={f.x} y={f.y} width={f.w} height={f.h} fill="none" stroke="#a12a2a" strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
          {[1, 2].map((k) => (
            <g key={k}>
              <line x1={f.x + (f.w * k) / 3} y1={f.y} x2={f.x + (f.w * k) / 3} y2={f.y + f.h} stroke="#a12a2a" strokeOpacity=".5" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />
              <line x1={f.x} y1={f.y + (f.h * k) / 3} x2={f.x + f.w} y2={f.y + (f.h * k) / 3} stroke="#a12a2a" strokeOpacity=".5" strokeDasharray="4 3" vectorEffect="non-scaling-stroke" />
            </g>
          ))}
          {plan.cuts.map((c, i) => <rect key={i} x={c.x} y={c.y} width={c.w} height={c.h} fill="#a12a2a" fillOpacity=".18" />)}
        </g>
      </g>
    )
  }

  return (
    <svg viewBox="-215 -215 430 430" className="dial" role="img" aria-label={`La bàn phi tinh tọa ${hk.tonSon} hướng ${hk.huong}`}>
      <defs><clipPath id="dial-clip"><circle r={R.dirIn} /></clipPath></defs>
      <circle r={R.tick} fill="#fffdf8" stroke="#2b2620" strokeWidth="1.2" />
      {planLayer}
      {Array.from({ length: 360 }, (_, d) => {
        const len = d % 10 === 0 ? 11 : d % 5 === 0 ? 7 : 3.5
        const [x1, y1] = pt(S(d), R.tick), [x2, y2] = pt(S(d), R.tick - len)
        return <line key={d} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#2b2620" strokeWidth={d % 10 === 0 ? 0.9 : 0.5} />
      })}
      {Array.from({ length: 36 }, (_, k) => {
        const d = k * 10, [x, y] = pt(S(d), R.deg)
        return <text key={d} x={x} y={y} fontSize="8.5" textAnchor="middle" dominantBaseline="central" fill={d % 90 === 0 ? '#a12a2a' : '#2b2620'} fontWeight={d % 90 === 0 ? 700 : 400} transform={`rotate(${tangent(S(d))} ${x} ${y})`}>{d}</text>
      })}
      <circle r={R.sonOut} fill="none" stroke="#2b2620" strokeWidth=".8" />
      <circle r={R.sonIn} fill="none" stroke="#2b2620" strokeWidth=".8" />
      {SON24.map((s, i) => {
        const center = i * 15
        const [bx1, by1] = pt(S(center + 7.5), R.sonIn), [bx2, by2] = pt(S(center + 7.5), R.sonOut)
        const [x, y] = pt(S(center), (R.sonIn + R.sonOut) / 2)
        return (
          <g key={s}>
            <line x1={bx1} y1={by1} x2={bx2} y2={by2} stroke="#2b2620" strokeWidth=".6" />
            <text x={x} y={y} fontSize="9.5" fontWeight={s === hk.tonSon || s === hk.huong ? 800 : 600} textAnchor="middle" dominantBaseline="central" fill={s === hk.huong ? '#a12a2a' : s === hk.tonSon ? '#2f5b8a' : '#2b2620'} transform={`rotate(${tangent(S(center))} ${x} ${y})`}>{s.toUpperCase()}</text>
          </g>
        )
      })}
      <circle r={R.dirIn} fill="none" stroke="#2b2620" strokeWidth=".8" />
      {DIRS.map((d) => {
        const [lx2, ly2] = pt(S(d.deg + 22.5), R.sonIn)
        const [x, y] = pt(S(d.deg), (R.dirIn + R.sonIn) / 2)
        return (
          <g key={d.cell}>
            <line x1={0} y1={0} x2={lx2} y2={ly2} stroke="#2b2620" strokeOpacity=".45" strokeWidth=".7" strokeDasharray="3 3" />
            <text x={x} y={y} fontSize="8.5" fontWeight="700" letterSpacing=".08em" textAnchor="middle" dominantBaseline="central" fill="#1d3a2c" transform={`rotate(${tangent(S(d.deg))} ${x} ${y})`}>{d.label}</text>
          </g>
        )
      })}
      {SON24.map((_, i) => { const [x2, y2] = pt(S(i * 15 + 7.5), R.dirIn); return <line key={i} x1={0} y1={0} x2={x2} y2={y2} stroke="#2b2620" strokeOpacity=".12" strokeWidth=".5" /> })}
      {(() => {
        const [hx, hy] = pt(S(facing), R.dirIn - 4), [tx, ty] = pt(S(sitting), R.dirIn - 4)
        return (
          <g>
            <line x1={tx} y1={ty} x2={hx} y2={hy} stroke="#a12a2a" strokeWidth="1.4" strokeDasharray="6 4" />
            <circle cx={hx} cy={hy} r="4" fill="#a12a2a" /><circle cx={tx} cy={ty} r="4" fill="#2f5b8a" />
          </g>
        )
      })()}
      {DIRS.map((d) => { const [x, y] = pt(S(d.deg), 92); return badge(d.cell, x, y) })}
      {badge('C', 0, 0)}
    </svg>
  )
}

// ---------------- Mặt bằng cửu cung ----------------
export function PlanEditor({ plan, setPlan, hk, grid, center }: { plan: Plan; setPlan: (p: Plan) => void; hk: HKChart; grid: GridCell[]; center: { x: number; y: number } }) {
  const svgRef = useRef<SVGSVGElement>(null)
  const drag = useRef<Drag | null>(null)
  const u = Math.max(plan.W, plan.H)
  const hr = u * 0.014 // bán kính tay nắm
  const minSize = u * 0.03

  const toSvg = (e: RPointerEvent) => {
    const svg = svgRef.current!
    const p = svg.createSVGPoint(); p.x = e.clientX; p.y = e.clientY
    return p.matrixTransform(svg.getScreenCTM()!.inverse())
  }
  const start = (e: RPointerEvent, kind: Drag['kind'], idx: number, handle: Handle) => {
    e.stopPropagation(); e.preventDefault()
    const p = toSvg(e)
    svgRef.current!.setPointerCapture(e.pointerId)
    drag.current = { kind, idx, handle, sx: p.x, sy: p.y, r0: kind === 'frame' ? plan.frame : plan.cuts[idx] }
  }
  const move = (e: RPointerEvent) => {
    const d = drag.current
    if (!d) return
    const p = toSvg(e), dx = p.x - d.sx, dy = p.y - d.sy, r = d.r0
    let n: Rect =
      d.handle === 'move' ? { ...r, x: r.x + dx, y: r.y + dy }
      : d.handle === 'nw' ? { x: r.x + dx, y: r.y + dy, w: r.w - dx, h: r.h - dy }
      : d.handle === 'ne' ? { x: r.x, y: r.y + dy, w: r.w + dx, h: r.h - dy }
      : d.handle === 'sw' ? { x: r.x + dx, y: r.y, w: r.w - dx, h: r.h + dy }
      : { x: r.x, y: r.y, w: r.w + dx, h: r.h + dy }
    n = normRect(n)
    n.w = Math.max(minSize, Math.min(n.w, plan.W)); n.h = Math.max(minSize, Math.min(n.h, plan.H))
    n.x = Math.min(Math.max(0, n.x), plan.W - n.w); n.y = Math.min(Math.max(0, n.y), plan.H - n.h)
    if (d.kind === 'frame') setPlan({ ...plan, frame: n })
    else setPlan({ ...plan, cuts: plan.cuts.map((c, i) => (i === d.idx ? n : c)) })
  }
  const end = () => { drag.current = null }

  const handles = (r: Rect, kind: Drag['kind'], idx: number, color: string) =>
    ([['nw', r.x, r.y], ['ne', r.x + r.w, r.y], ['sw', r.x, r.y + r.h], ['se', r.x + r.w, r.y + r.h]] as const).map(([h, x, y]) => (
      <circle key={h} cx={x} cy={y} r={hr} fill="#fff" stroke={color} strokeWidth={hr * 0.35} style={{ cursor: `${h}-resize`, touchAction: 'none' }} onPointerDown={(e) => start(e, kind, idx, h)} />
    ))

  const f = plan.frame
  const fs = Math.min(f.w, f.h) / 3 // cỡ ô nhỏ nhất, dùng để co chữ
  return (
    <svg ref={svgRef} viewBox={`0 0 ${plan.W} ${plan.H}`} className="plan-svg" onPointerMove={move} onPointerUp={end} onPointerCancel={end} role="img" aria-label="Mặt bằng chia cửu cung">
      <image href={plan.url} x={0} y={0} width={plan.W} height={plan.H} />
      {/* làm mờ phần ngoài khung */}
      <path d={`M0 0H${plan.W}V${plan.H}H0Z M${f.x} ${f.y}V${f.y + f.h}H${f.x + f.w}V${f.y}Z`} fill="#1d160b" fillOpacity=".35" fillRule="evenodd" />
      <g transform={`translate(${center.x} ${center.y})`}>
        <line x1={-f.w * 0.48} x2={f.w * 0.48} stroke="#2f5b8a" strokeOpacity=".35" strokeWidth={hr * 0.15} />
        <line y1={-f.h * 0.48} y2={f.h * 0.48} stroke="#2f5b8a" strokeOpacity=".35" strokeWidth={hr * 0.15} />
      </g>
      {grid.map((g) => {
        const c = hk.cells[g.dir]
        const cx = g.rect.x + g.rect.w / 2, cy = g.rect.y + g.rect.h / 2
        const k = fs * 0.2
        const miss = g.missing >= 0.3
        return (
          <g key={`${g.row}-${g.col}`}>
            <rect x={g.rect.x} y={g.rect.y} width={g.rect.w} height={g.rect.h} fill={miss ? '#a12a2a' : '#fffdf8'} fillOpacity={miss ? 0.12 : 0.05} stroke="#a12a2a" strokeOpacity=".55" strokeDasharray={`${k * 0.4} ${k * 0.3}`} strokeWidth={k * 0.06} />
            <g transform={`translate(${cx} ${cy})`}>
              <rect x={-k * 2.2} y={-k * 2.1} width={k * 4.4} height={k * 4.1} rx={k * 0.4} fill="#fffdf8" fillOpacity=".88" stroke="#d9bd7a" strokeWidth={k * 0.05} />
              <text y={-k * 1.35} textAnchor="middle" fontSize={k * 0.55} fontWeight="700" fill="#1d3a2c" letterSpacing=".05em">{DIR_VI[g.dir].toUpperCase()}</text>
              <text y={k * 0.25} textAnchor="middle" fontSize={k * 1.5} fontWeight="700" fontFamily="Playfair Display, serif" fill={TONE_COLOR[starTone(c.van, hk.van)]}>{c.van}</text>
              <text y={k * 1.15} textAnchor="middle" fontSize={k * 0.75} fontWeight="600">
                <tspan fill={TONE_COLOR[starTone(c.son, hk.van)]}>{c.son}</tspan><tspan fill="#7a7062"> · </tspan><tspan fill={TONE_COLOR[starTone(c.huong, hk.van)]}>{c.huong}</tspan>
              </text>
              <text y={k * 1.8} textAnchor="middle" fontSize={k * 0.5} fill={c.year === 5 || c.year === 2 ? '#a12a2a' : '#7a7062'}>năm {c.year}{miss ? ' · KHUYẾT' : ''}</text>
            </g>
          </g>
        )
      })}
      {plan.cuts.map((c, i) => (
        <g key={i}>
          <rect x={c.x} y={c.y} width={c.w} height={c.h} fill="url(#hatch)" stroke="#a12a2a" strokeWidth={hr * 0.3} style={{ cursor: 'move', touchAction: 'none' }} onPointerDown={(e) => start(e, 'cut', i, 'move')} />
          {handles(c, 'cut', i, '#a12a2a')}
        </g>
      ))}
      <rect x={f.x} y={f.y} width={f.w} height={f.h} fill="none" stroke="#a12a2a" strokeWidth={hr * 0.35} />
      {handles(f, 'frame', 0, '#1d3a2c')}
      <text x={f.x + f.w / 2} y={Math.min(plan.H - hr, f.y + f.h + hr * 2.6)} textAnchor="middle" fontSize={hr * 1.6} fontWeight="700" fill="#a12a2a">▼ HƯỚNG NHÀ</text>
      <defs>
        <pattern id="hatch" width={u * 0.02} height={u * 0.02} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width={u * 0.02} height={u * 0.02} fill="#a12a2a" fillOpacity=".12" />
          <line x1="0" y1="0" x2="0" y2={u * 0.02} stroke="#a12a2a" strokeWidth={u * 0.004} strokeOpacity=".5" />
        </pattern>
      </defs>
    </svg>
  )
}

function KhuyetReport({ grid, hk }: { grid: GridCell[]; hk: HKChart }) {
  const miss = grid.filter((g) => g.dir !== 'C' && g.missing >= 0.3)
  if (!miss.length) return <p className="small" style={{ color: 'var(--good)' }}>✓ Thân nhà vuông vức, không khuyết góc đáng kể.</p>
  return (
    <div className="card tinted-red" style={{ marginTop: 10 }}>
      <div className="col-title r">△ Khuyết góc</div>
      <ul className="dots">
        {miss.map((g) => {
          const d = g.dir as Exclude<Cell, 'C'>
          const k = KHUYET[d], c = hk.cells[d], rm = QUAI_HANH[d]
          const lostGood = [c.son, c.huong].includes(hk.van)
          const lostBad = [c.son, c.huong].some((s) => s === 5 || s === 2)
          return (
            <li key={`${g.row}-${g.col}`}>
              <b>{DIR_VI[d]} ({k.quai})</b> khuyết khoảng {Math.round(g.missing * 100)}%: theo Bát quái liên quan <b>{k.person}</b>, lưu ý sức khỏe {k.body}.{' '}
              {lostGood ? `Cung này có sao vượng ${hk.van} (${STAR_NOTE[hk.van]}) nên khuyết làm giảm phần cát. ` : ''}
              {lostBad ? 'Cung này có sao hung (2 hoặc 5) nên khuyết lại làm nhẹ bớt phần xấu. ' : ''}
              Bổ khuyết theo hành {rm.hanh}: {rm.remedy}.
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function FlyingStarDial({ hk, facing }: { hk: HKChart; facing: number }) {
  const [mode, setMode] = useState<'house' | 'north'>('house')
  const [plan, setPlan] = useState<Plan | null>(null)
  const [opacity, setOpacity] = useState(0.85)
  const [msg, setMsg] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const url = plan?.url

  useEffect(() => () => { if (url) URL.revokeObjectURL(url) }, [url])

  const center = useMemo(() => (plan ? houseCenter(plan.frame, plan.cuts, plan.centerMode) : null), [plan])
  const grid = useMemo(() => (plan && center ? nineGrid(plan.frame, plan.cuts, center, facing) : null), [plan, center, facing])

  const onFile = (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { setMsg('Vui lòng chọn file ảnh (png, jpg, webp…).'); return }
    const u = URL.createObjectURL(file)
    const im = new Image()
    im.onload = () => {
      const W = im.naturalWidth, H = im.naturalHeight
      setPlan({ url: u, W, H, frame: { x: W * 0.05, y: H * 0.05, w: W * 0.9, h: H * 0.9 }, cuts: [], centerMode: 'rect' })
      setMsg('')
    }
    im.onerror = () => setMsg('Không đọc được ảnh này.')
    im.src = u
  }
  const addCut = () => {
    if (!plan) return
    const f = plan.frame
    setPlan({ ...plan, cuts: [...plan.cuts, { x: f.x + (f.w * 2) / 3, y: f.y, w: f.w / 3, h: f.h / 4 }] })
  }
  const save = async () => {
    if (!ref.current) return
    try {
      const blob = await toBlob(ref.current, { backgroundColor: '#fbf6ec', pixelRatio: 2 })
      if (!blob) throw new Error()
      const u = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = u; a.download = `phi-tinh-${hk.tonSon}-${hk.huong}.png`; a.click(); URL.revokeObjectURL(u)
    } catch { setMsg('Không tạo được ảnh.') }
  }

  return (
    <div>
      <div className="row" style={{ flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        <label className="btn ghost sm" style={{ flex: 'none', cursor: 'pointer' }}>
          🏠 {plan ? 'Đổi mặt bằng' : 'Tải ảnh mặt bằng'}
          <input type="file" accept="image/*" hidden onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = '' }} />
        </label>
        {plan && <button className="btn ghost sm" style={{ flex: 'none' }} onClick={() => setPlan(null)}>Bỏ ảnh</button>}
        <div className="sub" style={{ margin: 0, flex: 'none' }} aria-label="Cách xoay la bàn">
          <button className={mode === 'house' ? 'on' : ''} onClick={() => setMode('house')}>La bàn theo nhà</button>
          <button className={mode === 'north' ? 'on' : ''} onClick={() => setMode('north')}>Bắc lên trên</button>
        </div>
        <button className="btn ghost sm" style={{ flex: 'none' }} onClick={save}>⬇ Lưu ảnh</button>
      </div>

      {plan && (
        <div className="plan-tools">
          <p className="small" style={{ margin: 0 }}>
            <b>Bước 1:</b> kéo 4 chấm xanh để khung đỏ ôm đúng <b>thân nhà</b> (phần có mái, dùng thường xuyên). Cửa chính đặt ở cạnh dưới ảnh.{' '}
            <b>Bước 2:</b> nếu nhà có góc lõm (sân lộ thiên, phần thụt vào), bấm "Thêm khuyết góc" rồi kéo vùng gạch chéo vào đúng chỗ.
            La bàn bên cạnh cập nhật theo khung ngay khi bạn kéo.
          </p>
          <div className="row" style={{ flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
            <button className="btn ghost sm" style={{ flex: 'none' }} onClick={() => setPlan({ ...plan, frame: { x: 0, y: 0, w: plan.W, h: plan.H } })}>Khung = cả ảnh</button>
            <button className="btn ghost sm" style={{ flex: 'none' }} onClick={addCut}>＋ Thêm khuyết góc</button>
            {plan.cuts.map((_, i) => <button key={i} className="btn ghost sm" style={{ flex: 'none' }} onClick={() => setPlan({ ...plan, cuts: plan.cuts.filter((__, k) => k !== i) })}>✕ Xóa khuyết {i + 1}</button>)}
            <div className="sub" style={{ margin: 0, flex: 'none' }}>
              <button className={plan.centerMode === 'rect' ? 'on' : ''} onClick={() => setPlan({ ...plan, centerMode: 'rect' })}>Tâm theo khung</button>
              <button className={plan.centerMode === 'centroid' ? 'on' : ''} disabled={!plan.cuts.length} onClick={() => setPlan({ ...plan, centerMode: 'centroid' })}>Trọng tâm thực</button>
            </div>
            <label className="small" style={{ flex: '1 1 160px' }}>Độ đậm ảnh trên la bàn <input type="range" min={0.2} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(+e.target.value)} style={{ width: '100%' }} /></label>
          </div>
        </div>
      )}
      {msg && <p className="err">{msg}</p>}

      <div ref={ref} className={plan ? 'dual' : 'dial-wrap'}>
        {plan && center && grid && (
          <figure className="plan-wrap">
            <figcaption className="label">Mặt bằng cửu cung</figcaption>
            <PlanEditor plan={plan} setPlan={setPlan} hk={hk} grid={grid} center={center} />
          </figure>
        )}
        <figure className="dial-wrap">
          {plan && <figcaption className="label">La bàn phi tinh</figcaption>}
          <Dial hk={hk} facing={facing} mode={mode} plan={plan} center={center} opacity={opacity} />
        </figure>
      </div>
      {grid && <KhuyetReport grid={grid} hk={hk} />}
      <p className="small center-text">
        Hướng nhà {Math.round(facing)}° ({hk.huong}) – tọa {hk.tonSon}. Mỗi ô: sao vận (lớn), sơn · hướng, sao năm {hk.year}.{' '}
        {plan ? 'Tâm la bàn đặt tại tâm nhà (giao điểm hai đường xanh trên mặt bằng). Ảnh chỉ xử lý trên máy bạn, không tải lên đâu.' : 'Tải ảnh mặt bằng (cửa chính ở cạnh dưới ảnh) để chia cửu cung lên bản vẽ.'}
      </p>
    </div>
  )
}
