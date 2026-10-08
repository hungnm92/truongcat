import { useState } from 'react'
import { dayInfo, lunarOfSolar } from '../lib/calendar'
import { THU, pad2 } from '../lib/vn'

export function CalendarModal({ onClose }: { onClose: () => void }) {
  const t = new Date()
  const [y, setY] = useState(t.getFullYear())
  const [m, setM] = useState(t.getMonth() + 1)
  const [d, setD] = useState(t.getDate())
  const dim = new Date(y, m, 0).getDate()
  const day = Math.min(d, dim)
  const info = dayInfo(y, m, day)
  const first = new Date(y, m - 1, 1).getDay()
  const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: dim }, (_, i) => i + 1)]
  while (cells.length % 7) cells.push(null)

  const shift = (delta: number) => {
    const dt = new Date(y, m - 1 + delta, 1)
    setY(dt.getFullYear()); setM(dt.getMonth() + 1)
  }

  return (
    <div className="modal-bg" onClick={onClose} role="dialog" aria-modal="true" aria-label="Lịch vạn niên">
      <div className="modal narrow modal-body" onClick={(e) => e.stopPropagation()}>
        <div className="row" style={{ marginBottom: 12 }}>
          <div style={{ flex: 3 }}><div className="eyebrow">Lịch vạn niên</div><h2 style={{ margin: 0 }}>Tháng {m} / {y}</h2></div>
          <button className="btn ghost sm" style={{ flex: 'none' }} onClick={onClose}>Đóng ✕</button>
        </div>
        <div className="row" style={{ marginBottom: 10 }}>
          <button className="btn ghost sm" style={{ flex: 'none' }} onClick={() => shift(-1)} aria-label="Tháng trước">‹</button>
          <select aria-label="Ngày" value={day} onChange={(e) => setD(+e.target.value)}>
            {Array.from({ length: dim }, (_, i) => <option key={i} value={i + 1}>Ngày {i + 1}</option>)}
          </select>
          <select aria-label="Tháng" value={m} onChange={(e) => setM(+e.target.value)}>
            {Array.from({ length: 12 }, (_, i) => <option key={i} value={i + 1}>Tháng {i + 1}</option>)}
          </select>
          <input aria-label="Năm" type="number" value={y} min={1900} max={2100} onChange={(e) => setY(Math.min(2100, Math.max(1900, +e.target.value || y)))} />
          <button className="btn ghost sm" style={{ flex: 'none' }} onClick={() => shift(1)} aria-label="Tháng sau">›</button>
        </div>
        <table className="cal">
          <thead><tr>{THU.map((w) => <th key={w}>{w === 'Chủ nhật' ? 'CN' : 'T' + (THU.indexOf(w) + 1)}</th>)}</tr></thead>
          <tbody>
            {Array.from({ length: cells.length / 7 }, (_, r) => (
              <tr key={r}>
                {cells.slice(r * 7, r * 7 + 7).map((c, i) => {
                  if (!c) return <td key={i} style={{ cursor: 'default', border: 0 }} />
                  const l = lunarOfSolar(y, m, c)
                  return (
                    <td key={i} className={`${c === day ? 'sel' : ''} ${l.d === 1 ? 'hd' : ''} ${y === t.getFullYear() && m === t.getMonth() + 1 && c === t.getDate() ? 'today' : ''}`} onClick={() => setD(c)}>
                      {c}<small>{l.d === 1 ? `1/${l.m}` : l.d}</small>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="card" style={{ marginTop: 12 }}>
          <div className="label">{info.solar.weekday}, {pad2(day)}/{pad2(m)}/{y}</div>
          <div className="big">Âm lịch {info.lunar.d}/{info.lunar.m}{info.lunar.leap ? ' nhuận' : ''} · {info.lunar.dayGZ}</div>
          <p className="small" style={{ margin: '4px 0' }}>Tháng {info.lunar.monthGZ} · Năm {info.lunar.yearGZ} · Nạp âm ngày {info.napAm}{info.tietKhi ? ` · Tiết ${info.tietKhi}` : ''}</p>
          <div>
            <span className="chip">Trực {info.truc}</span>
            <span className={`chip ${info.thanSat.hoangDao ? 'good' : 'bad'}`}>{info.thanSat.name} ({info.thanSat.hoangDao ? 'Hoàng đạo' : 'Hắc đạo'})</span>
            <span className={`chip ${info.tu.cat ? 'good' : 'bad'}`}>Sao {info.tu.name}</span>
            <span className="chip">Xung tuổi {info.chiXung}</span>
            {info.tamNuong && <span className="chip bad">Tam Nương</span>}
            {info.nguyetKy && <span className="chip bad">Nguyệt Kỵ</span>}
            {info.duongCongKy && <span className="chip bad">Dương Công Kỵ</span>}
          </div>
        </div>
      </div>
    </div>
  )
}
