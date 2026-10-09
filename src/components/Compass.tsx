import { useMemo, useState } from 'react'
import {
  adviseDirection, cungPhi, vanOfYear, vanLabel, DIR_ORDER, PURPOSE_LABEL, QUAI_DIR, QUAI_SYMBOL, SON24, STAR_NOTE, TRACH_MEANING, batTrach, starTone, sonOfDegree, quaiOfDegree,
  type Cell, type Purpose, type Quai,
} from '../lib/fengshui'
import type { Chart } from '../lib/chart'
import { lunarOfSolar } from '../lib/calendar'
import { FlyingStarDial } from './FlyingStarDial'

const GRID: { cell: Cell; label: string }[] = [
  { cell: 'SE', label: 'Đông Nam' }, { cell: 'S', label: 'Nam' }, { cell: 'SW', label: 'Tây Nam' },
  { cell: 'E', label: 'Đông' }, { cell: 'C', label: 'Trung cung' }, { cell: 'W', label: 'Tây' },
  { cell: 'NE', label: 'Đông Bắc' }, { cell: 'N', label: 'Bắc' }, { cell: 'NW', label: 'Tây Bắc' },
]

function Dial({ deg }: { deg: number }) {
  const R = 150
  return (
    <svg viewBox="-170 -170 340 340" className="compass" role="img" aria-label={`La bàn chỉ ${Math.round(deg)} độ, sơn ${sonOfDegree(deg)}`}>
      <circle r={R + 12} fill="#fffaf0" stroke="#1f3a2e" strokeWidth="3" />
      <circle r={R - 34} fill="none" stroke="#d9ccaa" />
      {SON24.map((s, i) => {
        const a = (i * 15 * Math.PI) / 180
        const tx = Math.sin(a) * (R - 16), ty = -Math.cos(a) * (R - 16)
        const lx1 = Math.sin(a + 0.1309) * (R - 34), ly1 = -Math.cos(a + 0.1309) * (R - 34)
        const lx2 = Math.sin(a + 0.1309) * R, ly2 = -Math.cos(a + 0.1309) * R
        return (
          <g key={s}>
            <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="#d9ccaa" />
            <text x={tx} y={ty} fontSize="10" textAnchor="middle" dominantBaseline="middle" fill={['Tý', 'Ngọ', 'Mão', 'Dậu'].includes(s) ? '#7a1f1f' : '#2a2a24'} transform={`rotate(${i * 15} ${tx} ${ty})`}>{s}</text>
          </g>
        )
      })}
      {DIR_ORDER.map((q, i) => {
        const a = (i * 45 * Math.PI) / 180
        return <text key={q} x={Math.sin(a) * 82} y={-Math.cos(a) * 82} textAnchor="middle" dominantBaseline="middle" fontSize="18" fill="#1f3a2e">{QUAI_SYMBOL[q]}</text>
      })}
      <g transform={`rotate(${deg})`}>
        <polygon points="0,-132 7,0 -7,0" fill="#7a1f1f" />
        <polygon points="0,132 7,0 -7,0" fill="#1f3a2e" opacity=".55" />
        <circle r="6" fill="#b8913a" />
      </g>
      <text y="-60" textAnchor="middle" fontSize="12" fill="#6d675a">Bắc</text>
    </svg>
  )
}

export function Compass({ chart }: { chart: Chart }) {
  const [purpose, setPurpose] = useState<Purpose>('nha')
  const [deg, setDeg] = useState(0)
  const [applied, setApplied] = useState<number | null>(null)
  const [buildYear, setBuildYear] = useState(new Date().getFullYear())
  const [viewYear, setViewYear] = useState(chart.input.viewYear)
  const van = vanOfYear(buildYear)
  const ly = lunarOfSolar(chart.effective.y, chart.effective.m, chart.effective.d)
  const menh: Quai = cungPhi(ly.y, chart.input.gender)
  const advice = useMemo(() => (applied === null ? null : adviseDirection(applied, purpose, menh, van, viewYear)), [applied, purpose, menh, van, viewYear])
  const table = batTrach(menh)

  const setDegree = (v: number) => setDeg(Math.min(360, Math.max(0, Number.isFinite(v) ? v : 0)) % 360)

  return (
    <section>
      <h3>Phong thủy: Bát Trạch và Huyền Không</h3>
      <div className="card" style={{ marginBottom: 14 }}>
        <div className="label">Mệnh chủ (cung phi)</div>
        <div className="big">{QUAI_SYMBOL[menh]} {menh} · {QUAI_DIR[menh]}</div>
        <p className="small" style={{ margin: 0 }}>Tính theo năm âm lịch {ly.y} và giới tính {chart.input.gender}. Thuộc nhóm {['Khảm', 'Ly', 'Chấn', 'Tốn'].includes(menh) ? 'Đông Tứ Mệnh' : 'Tây Tứ Mệnh'}.</p>
      </div>

      <p className="label">Bạn muốn xem hướng để làm gì?</p>
      <div className="sub">
        {(Object.keys(PURPOSE_LABEL) as Purpose[]).map((p) => (
          <button key={p} className={purpose === p ? 'on' : ''} onClick={() => { setPurpose(p); setApplied(null) }}>
            {p === 'nha' ? '🏠' : p === 'banlamviec' ? '💼' : '🛏️'} {PURPOSE_LABEL[p]}
          </button>
        ))}
      </div>

      <div className="grid2">
        <div className="card">
          <Dial deg={deg} />
          <div className="field">
            <label htmlFor="deg">{purpose === 'nha' ? 'Hướng mặt tiền nhà (độ, 0° = Bắc)' : purpose === 'banlamviec' ? 'Hướng mặt nhìn khi ngồi (độ)' : 'Hướng đầu giường (độ)'}</label>
            <input id="deg" type="range" min={0} max={359} step={1} value={deg} onChange={(e) => setDegree(+e.target.value)} />
            <div className="row">
              <input type="number" aria-label="Số độ" min={0} max={360} value={Math.round(deg)} onChange={(e) => setDegree(+e.target.value)} />
              <span className="small" style={{ flex: 2 }}>Sơn {sonOfDegree(deg)} · {QUAI_DIR[quaiOfDegree(deg)]}</span>
            </div>
          </div>
          {purpose === 'nha' && (
            <div className="grid2" style={{ gap: 10 }}>
              <div className="field">
                <label htmlFor="by">Năm xây / nhập trạch</label>
                <input id="by" type="number" min={1900} max={2100} value={buildYear} onChange={(e) => setBuildYear(Number(e.target.value) || buildYear)} />
                <span className="small">{vanLabel(van)}</span>
              </div>
              <div className="field">
                <label htmlFor="vy">Năm xem lưu niên</label>
                <input id="vy" type="number" min={1900} max={2200} value={viewYear} onChange={(e) => setViewYear(Number(e.target.value) || viewYear)} />
              </div>
            </div>
          )}
          <button className="btn red" onClick={() => setApplied(deg)}>Ấn định tọa hướng</button>
        </div>

        <div className="card">
          {!advice ? (
            <>
              <h3>Bát trạch cho mệnh {menh}</h3>
              <table className="t">
                <tbody>
                  {(Object.keys(table) as (keyof typeof table)[]).map((k) => (
                    <tr key={k}><td><b>{k}</b></td><td>{table[k].dir}</td><td className="small">{TRACH_MEANING[k]}</td></tr>
                  ))}
                </tbody>
              </table>
              <p className="small">Xoay la bàn bằng thanh trượt rồi bấm "Ấn định tọa hướng" để nhận nhận định.</p>
            </>
          ) : (
            <>
              <div className="label">Kết luận</div>
              <h3>{advice.verdict}: {advice.dirQuality}</h3>
              {advice.lines.map((l, i) => <p key={i} style={{ margin: '6px 0' }}>{l}</p>)}
              <p className="small"><b>Bốn hướng tốt của bạn:</b> {advice.bestDirs.map((b) => `${b.star} – ${b.dir}`).join('; ')}.</p>
            </>
          )}
        </div>
      </div>

      {advice && purpose === 'nha' && (
        <div className="card" style={{ marginTop: 14 }}>
          <h3>Phi tinh {advice.hk.pattern ? '· ' + advice.hk.pattern : ''}</h3>
          <p className="small">Tọa {advice.hk.tonSon} hướng {advice.hk.huong} · {vanLabel(advice.hk.van)}{advice.hk.theQuai ? ` · kiêm ${Math.abs(advice.hk.kiem)}°, dùng Thế quái` : ''}. Mỗi ô: sao vận (lớn), sơn tinh · hướng tinh, và sao lưu niên {advice.hk.year}.</p>
          <FlyingStarDial hk={advice.hk} facing={applied ?? deg} />
          <details style={{ marginTop: 10 }}>
            <summary className="small" style={{ cursor: 'pointer' }}>Xem dạng bảng 9 cung</summary>
          <div className="hk">
            {GRID.map((g) => {
              const c = advice.hk.cells[g.cell]
              return (
                <div key={g.cell} title={`${STAR_NOTE[c.van]}`}>
                  <div className="dir">{g.label}</div>
                  <div className={`v ${starTone(c.van, advice.hk.van)}`}>{c.van}</div>
                  <div><span className={starTone(c.son, advice.hk.van)}>{c.son}</span> · <span className={starTone(c.huong, advice.hk.van)}>{c.huong}</span></div>
                  <div className="small">Năm: <b className={c.year === 5 || c.year === 2 ? 'hung' : ''}>{c.year}</b></div>
                </div>
              )
            })}
          </div>
          </details>
          <ul className="dots" style={{ marginTop: 10 }}>{advice.hk.annualWarn.map((t, i) => <li key={i}>{t}</li>)}</ul>
          <p className="small">Xanh: sao đương vận và sinh khí · Xám: bình · Đỏ: sao suy/sát. Thế quái tự áp dụng khi hướng lệch quá 4.5° khỏi chính giữa sơn. Kết quả là tham khảo; nên khảo sát thực địa trước khi quyết định lớn.</p>
        </div>
      )}
    </section>
  )
}
