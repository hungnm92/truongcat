import { useRef, useState } from 'react'
import { toBlob } from 'html-to-image'
import { GRID_BRANCH_ORDER, SHORT_PALACE, laiNhan, palaceByBranch, relations, type Chart } from '../lib/chart'
import { relation } from '../lib/readings'
import { CAT_TINH, SAT_TINH } from '../data/stars'
import { CHI_HANH } from '../lib/vn'

const BR_SHORT: Record<string, string> = { Miếu: 'M', Vượng: 'V', Đắc: 'Đ', Lợi: 'L', Bình: 'B', Bất: 'B', Hạn: 'H', Hãm: 'H' }
const HIDE_ADJ = new Set(['Tuần Không', 'Triệt Lộ'])

/** Toạ độ tâm (0..400) của ô theo chi trên lưới 4x4. */
function centerOf(branch: string) {
  const i = GRID_BRANCH_ORDER.indexOf(branch)
  const col = i % 4, row = Math.floor(i / 4)
  return [col * 100 + 50, row * 100 + 50]
}

export function ChartBoard({ chart, year, selected, onSelect }: { chart: Chart; year: number; selected: string; onSelect: (name: string) => void }) {
  const [msg, setMsg] = useState('')
  const ref = useRef<HTMLDivElement>(null)
  const a = chart.astro
  const h = a.horoscope(`${year}-6-30`)
  const age = h.age.nominalAge
  const rel = relations(chart, selected)
  const sp = a.surroundedPalaces(selected as never)
  const pts = [sp.target, sp.wealth, sp.career, sp.opposite].map((p) => centerOf(String(p.earthlyBranch)))
  const menh = chart.palaces.find((p) => p.name === 'Mệnh')!
  const than = chart.palaces.find((p) => p.isBodyPalace)!
  const start = menh.decadal.range[0]
  const forward = chart.palaces.find((p) => p.decadal.range[0] === start + 10)?.index === (menh.index + 1) % 12

  const copyImage = async () => {
    if (!ref.current) return
    try {
      const blob = await toBlob(ref.current, { backgroundColor: '#fbf6ec', pixelRatio: 2 })
      if (!blob) throw new Error('empty')
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setMsg('Đã sao chép ảnh lá số.')
      } catch {
        const url = URL.createObjectURL(blob)
        const l = document.createElement('a')
        l.href = url; l.download = `la-so-${chart.input.name || 'tu-vi'}.png`; l.click()
        URL.revokeObjectURL(url)
        setMsg('Trình duyệt không cho sao chép, đã tải ảnh về máy.')
      }
    } catch {
      setMsg('Không tạo được ảnh, vui lòng thử lại.')
    }
    setTimeout(() => setMsg(''), 3500)
  }

  return (
    <div className="card" style={{ padding: 16 }}>
      <div className="row" style={{ marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: '3 1 240px' }}>
          <h3 style={{ margin: 0 }}>☯ Mệnh bàn 12 cung</h3>
          <div className="label" style={{ color: 'var(--good)' }}>● Tinh bàn {chart.input.name} · lưu niên {year}</div>
        </div>
        <span className="small" style={{ flex: 'none' }}>{msg}</span>
        <button className="btn ghost sm" style={{ flex: 'none' }} onClick={copyImage}>⧉ Copy ảnh lá số</button>
      </div>
      <div className="chart-scroll">
        <div className="chart-wrap" ref={ref}>
          <div className="chart">
            {GRID_BRANCH_ORDER.map((br, i) => {
              if (br === null) {
                if (i !== 5) return null
                return (
                  <div className="center" key="c">
                    <div className="ttl">— Thiên bàn —</div>
                    <div className="who">{chart.input.name.toUpperCase()}</div>
                    <div className="dates">
                      <span className="chip">DL {chart.input.day}/{chart.input.month}/{chart.input.year}</span>
                      <span className="chip">AL {a.rawDates.lunarDate.lunarDay}/{a.rawDates.lunarDate.lunarMonth} {chart.canNam} {chart.chiNam}</span>
                      <span className="chip">Giờ {chart.input.hour}h{String(chart.input.minute).padStart(2, '0')} ({a.time.replace('Giờ ', '')})</span>
                    </div>
                    <table>
                      <tbody>
                        <tr><td>Mệnh</td><td><b>Cung {menh.earthlyBranch}</b></td><td>Mạng</td><td><b>{chart.napAm}</b></td></tr>
                        <tr><td>Thân</td><td><b>{than.name}</b></td><td>Cục</td><td><b>{a.fiveElementsClass}</b></td></tr>
                        <tr><td>Lai nhân</td><td><b>{laiNhan(chart)}</b></td><td>Âm dương</td><td><b>{['Giáp', 'Bính', 'Mậu', 'Canh', 'Nhâm'].includes(chart.canNam) ? 'Dương' : 'Âm'} {chart.input.gender}</b></td></tr>
                        <tr><td>Mệnh chủ</td><td><b>{a.soul}</b></td><td>Thân chủ</td><td><b>{a.body}</b></td></tr>
                      </tbody>
                    </table>
                    <div className="small">{relation(chart)} Khởi vận {start} tuổi · đi {forward ? 'thuận' : 'nghịch'}.</div>
                    <div className="script" style={{ color: 'var(--green)', fontSize: '1.2rem' }}>Trường Cát Mệnh Lý</div>
                  </div>
                )
              }
              const p = palaceByBranch(chart, br)
              const r = rel[br]
              const isDec = p.decadal.range[0] <= age && age <= p.decadal.range[1]
              const adj = p.adjectiveStars.filter((s) => !HIDE_ADJ.has(s.name))
              const tuan = p.adjectiveStars.some((s) => s.name === 'Tuần Không')
              const triet = p.adjectiveStars.some((s) => s.name === 'Triệt Lộ')
              const luu = (h.yearly.stars?.[p.index] ?? []).map((s) => s.name.replace(/^Lưu /, 'L.'))
              const isTieuHan = String(h.age.earthlyBranch) === br
              return (
                <div
                  key={br}
                  role="button"
                  tabIndex={0}
                  aria-label={`Cung ${p.name} tại ${br}`}
                  className={`cell ${r === 'nguon' ? 'sel' : r === 'tamhop' ? 'trine' : r === 'xung' ? 'opp' : ''} ${isDec ? 'dec' : ''}`}
                  onClick={() => onSelect(p.name)}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(p.name)}
                >
                  <div className="hd">
                    <span className="gz">{p.heavenlyStem} {p.earthlyBranch} <small>({CHI_HANH[br]})</small></span>
                    <span className="pn">{p.name}{p.isBodyPalace && <span className="than">THÂN</span>}</span>
                  </div>
                  {p.majorStars.length ? (
                    <div className="stars-major">
                      {p.majorStars.map((s) => (
                        <span className="star major" key={s.name}>{s.name}<span className="br">({BR_SHORT[s.brightness ?? ''] ?? '-'})</span>{s.mutagen && <span className={`mut ${s.mutagen}`}>{s.mutagen}</span>}</span>
                      ))}
                    </div>
                  ) : <div className="vcd">~ VÔ CHÍNH DIỆU ~</div>}
                  <div className="stars-minor">
                    {p.minorStars.map((s) => (
                      <span key={s.name} className={`star ${CAT_TINH.includes(s.name) ? 'cat' : SAT_TINH.includes(s.name) ? 'sat' : 'minor'}`}>
                        {s.name}{s.brightness ? <span className="br">({BR_SHORT[s.brightness] ?? ''})</span> : null}{s.mutagen && <span className={`mut ${s.mutagen}`}>{s.mutagen}</span>}
                      </span>
                    ))}
                    {adj.map((s) => <span key={s.name} className="star adj">{s.name}</span>)}
                  </div>
                  {luu.length > 0 && <div>{luu.map((n) => <span key={n} className="star luu">{n} </span>)}</div>}
                  {triet && <span className="seal">TRIỆT</span>}
                  {tuan && <span className="seal tuan">TUẦN</span>}
                  <div className="ft">
                    <span>{p.changsheng12}</span>
                    <span className="age" title={isTieuHan ? 'Tiểu hạn năm xem' : 'Đại vận'}>{p.decadal.range[0]}–{p.decadal.range[1]}{isTieuHan ? ' ★' : ''}</span>
                  </div>
                  <div className="tags">
                    <i className="dv">ĐV.{SHORT_PALACE[h.decadal.palaceNames[p.index]]}</i>
                    <i className="ln">LN.{SHORT_PALACE[h.yearly.palaceNames[p.index]]}</i>
                    <i className="th">TH.{SHORT_PALACE[h.age.palaceNames[p.index]]}</i>
                  </div>
                </div>
              )
            })}
          </div>
          <svg className="chart-lines" viewBox="0 0 400 400" preserveAspectRatio="none" aria-hidden>
            {[[0, 1], [0, 2], [1, 2], [0, 3]].map(([x, y], k) => (
              <line key={k} x1={pts[x][0]} y1={pts[x][1]} x2={pts[y][0]} y2={pts[y][1]} stroke={k === 3 ? '#2f5b8a' : '#a12a2a'} strokeOpacity=".4" strokeWidth="1.2" strokeDasharray="5 4" vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
        </div>
      </div>
      <div className="legend">
        <span><i style={{ background: 'var(--red)' }} />Cung đang xem</span>
        <span><i style={{ background: '#5e9b6c' }} />Tam hợp</span>
        <span><i style={{ background: 'var(--blue)' }} />Xung chiếu</span>
        <span><i style={{ border: '1px dashed var(--gold)', background: 'transparent' }} />Đại vận hiện tại</span>
        <span>ĐV/LN/TH: vai trò cung trong Đại vận / Lưu niên / Tiểu hạn {year} · ★ tiểu hạn · <span className="star luu">L.</span> sao lưu niên</span>
      </div>
    </div>
  )
}

const REL_LABEL = { nguon: 'Đang xem', tamhop: 'Tam hợp', xung: 'Xung chiếu', nhihop: 'Nhị hợp', '': '' } as const

export function PalacePicker({ chart, selected, onSelect }: { chart: Chart; selected: string; onSelect: (n: string) => void }) {
  const rel = relations(chart, selected)
  const order = [...chart.palaces].sort((x, y) => {
    const m = chart.palaces.find((p) => p.name === 'Mệnh')!.index
    return ((m - x.index + 12) % 12) - ((m - y.index + 12) % 12)
  })
  return (
    <div className="palace-picker" role="tablist" aria-label="Chọn cung">
      {order.map((p, i) => (
        <button key={p.name} role="tab" aria-selected={selected === p.name} className={selected === p.name ? 'on' : ''} onClick={() => onSelect(p.name)}>
          <em>{String(i + 1).padStart(2, '0')} {REL_LABEL[rel[String(p.earthlyBranch)]]}</em>
          <b>{p.name}</b>
          <span>{p.decadal.range[0]}–{p.decadal.range[1]} tuổi</span>
        </button>
      ))}
    </div>
  )
}
