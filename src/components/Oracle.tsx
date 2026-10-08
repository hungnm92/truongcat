import { useRef, useState } from 'react'
import { toBlob } from 'html-to-image'
import { castLines, interpret, type HexInfo, type LineValue, type Reading } from '../lib/iching'
import type { Chart } from '../lib/chart'
import { PALACE_DIR, qimenChart, readQimen, type QMChart, type QMReading } from '../lib/qimen'

function Hexagram({ lines, info }: { lines: { yang: boolean; moving?: boolean }[]; info: HexInfo }) {
  return (
    <div>
      <div className="hex" aria-label={`Quẻ ${info.name}`}>
        {lines.map((l, i) => (
          <div key={i} className={`ln ${l.yang ? '' : 'yin'} ${l.moving ? 'moving' : ''}`}><i /><i /></div>
        ))}
      </div>
      <div style={{ textAlign: 'center' }}><b>{info.name}</b><div className="small">Quẻ số {info.num} · {info.upper} trên {info.lower}</div></div>
    </div>
  )
}

export function Oracle({ chart }: { chart: Chart }) {
  const [q, setQ] = useState('')
  const [reading, setReading] = useState<Reading | null>(null)
  const [qm, setQm] = useState<{ chart: QMChart; read: QMReading } | null>(null)
  const [casting, setCasting] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const cast = () => {
    const text = q.trim()
    if (text.length < 4) { setErr('Hãy ghi rõ điều bạn đang trăn trở (ít nhất vài chữ).'); return }
    setErr(''); setCasting(true); setReading(null)
    setTimeout(() => {
      const now = new Date()
      const vals = castLines(text, now)
      setReading(interpret(text, vals as LineValue[], now, chart.input.gender))
      const qc = qimenChart(now)
      setQm({ chart: qc, read: readQimen(qc, text) })
      setCasting(false)
    }, 1400)
  }

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3500) }

  const copyText = async () => {
    if (!reading) return
    const t = [`Trường Cát Mệnh Lý – Gieo quẻ`, `Câu hỏi: ${reading.question}`, `Quẻ: ${reading.main.name}${reading.changed ? ` → ${reading.changed.name}` : ''}`, `Kết luận: ${reading.verdict.level}`, '', ...reading.paragraphs].join('\n')
    try { await navigator.clipboard.writeText(t); flash('Đã sao chép lời giải.') } catch { flash('Không sao chép được, hãy chọn và copy thủ công.') }
  }
  const saveImage = async () => {
    if (!ref.current) return
    try {
      const blob = await toBlob(ref.current, { backgroundColor: '#fffaf0', pixelRatio: 2 })
      if (!blob) throw new Error()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = 'que-truong-cat.png'; a.click(); URL.revokeObjectURL(url)
    } catch { flash('Không tạo được ảnh.') }
  }

  return (
    <section>
      <div className="card oracle-hero" style={{ marginBottom: 16 }}>
        <div className="eyebrow">✧ Huyền cơ linh ứng · Vạn việc do tâm ✧</div>
        <h2>Gieo quẻ Trường Cát</h2>
        <p className="small serif" style={{ fontStyle: 'italic' }}>“Thành tâm thì linh — mỗi việc một quẻ, chớ gieo đi gieo lại.”</p>
        <div className="field" style={{ textAlign: 'left' }}>
          <label htmlFor="q">Điều bạn đang trăn trở</label>
          <textarea id="q" rows={3} maxLength={300} placeholder="Ví dụ: Tôi có nên nhận lời mời làm việc mới trong tháng này không?" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        {err && <div className="err" role="alert">{err}</div>}
        <button className="btn red" disabled={casting} onClick={cast}>{casting ? 'Đang gieo quẻ…' : 'Thành tâm thỉnh quẻ'}</button>
        {casting && <p className="small pulse">☯ Sáu hào đang hiện…</p>}
      </div>

      {reading && (
        <div ref={ref} className="card">
          <div className="label">Câu hỏi</div>
          <p style={{ marginTop: 0 }}>{reading.question}</p>
          <div className="hexrow">
            <Hexagram info={reading.main} lines={reading.lines} />
            {reading.changed && <span className="arrow">⟶</span>}
            {reading.changed && (
              <Hexagram info={reading.changed} lines={reading.lines.map((l) => ({ yang: l.moving ? !l.yang : l.yang }))} />
            )}
          </div>
          <p className="small" style={{ textAlign: 'center' }}>Hào đỏ là hào động. Lập quẻ lúc {reading.time.toLocaleString('vi-VN')} · ngày {reading.ngayThang.dayGZ}, tháng {reading.ngayThang.monthGZ}.</p>

          <div style={{ overflowX: 'auto', margin: '10px 0' }}>
            <table className="t">
              <thead><tr><th>Hào</th><th>Lục thần</th><th>Lục thân</th><th>Địa chi</th><th></th></tr></thead>
              <tbody>
                {[...reading.lines].reverse().map((l) => (
                  <tr key={l.pos} className={l.the ? 'the' : ''}>
                    <td>{l.pos}{l.moving ? ' ●' : ''}</td><td>{l.lucThu}</td><td>{l.lucThan}</td><td>{l.chi} ({l.hanh})</td>
                    <td className="small">{l.the ? 'Thế' : l.ung ? 'Ứng' : ''}{reading.dungThan?.pos === l.pos ? ' · Dụng thần' : ''}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>


          {qm && (
            <div className="card" style={{ margin: '14px 0', background: 'var(--paper-2)' }}>
              <div className="eyebrow">Kỳ Môn Độn Giáp · Bàn giờ</div>
              <h3 style={{ margin: '4px 0 8px' }}>{qm.chart.duong ? 'Dương' : 'Âm'} độn {qm.chart.cuc} cục · giờ {qm.chart.hourGZ}</h3>
              <div className="qm">
                {[4, 9, 2, 3, 5, 7, 8, 1, 6].map((p) => {
                  const c = qm.chart.cells[p]
                  if (p === 5) return <div key={p} className="mid"><div className="dir">Trung cung</div><div className="serif" style={{ fontSize: '1.2rem' }}>{c.earth}</div><div className="small">Thiên Cầm</div></div>
                  return (
                    <div key={p} className={qm.read.palace.palace === p ? 'focus' : ''}>
                      <div className="dir">{PALACE_DIR[p]} · {c.quai}</div>
                      <div className="small">{c.god}</div>
                      <div className={`door ${['Khai', 'Hưu', 'Sinh'].includes(c.door) ? 'cat' : ['Thương', 'Kinh', 'Tử'].includes(c.door) ? 'hung' : 'binh'}`}>{c.door} môn</div>
                      <div className="small">{c.star}{c.extra ? ` + Cầm` : ''}</div>
                      <div className="small"><b>{c.heaven}</b> / {c.earth}</div>
                    </div>
                  )
                })}
              </div>
              <p className="small center-text">Mỗi ô: thần · cửa · sao · can thiên bàn / địa bàn. Ô viền đỏ là cung dụng sự.</p>
              {qm.read.lines.map((t, i) => <p key={i} style={{ margin: '6px 0' }}>{t}</p>)}
            </div>
          )}
          <div className="card" style={{ background: '#fbf4df' }}>
            <div className="label">Huyền cơ phán dụng</div>
            <h3 style={{ margin: '2px 0' }}>{reading.verdict.level}</h3>
            <div className="small">Độ đồng thuận: {reading.verdict.consensus.toFixed(1)} · Chủ đề: {reading.topic.label}</div>
          </div>
          {reading.paragraphs.map((t, i) => <p key={i} style={{ margin: '8px 0' }}>{t}</p>)}
          <p className="small">⏳ Ứng kỳ (ước lượng): {reading.ungKy}</p>
          <p className="disclaimer">Quẻ do bạn gieo chỉ để tham khảo và gợi suy ngẫm, không thay thế quyết định có cân nhắc.</p>
        </div>
      )}

      {reading && (
        <div className="actions no-print" style={{ justifyContent: 'center' }}>
          <button className="btn ghost sm" onClick={saveImage}>📸 Lưu ảnh quẻ</button>
          <button className="btn ghost sm" onClick={() => window.print()}>🖨️ In / Lưu PDF</button>
          <button className="btn ghost sm" onClick={copyText}>📋 Sao chép lời giải</button>
          <button className="btn sm" onClick={() => { setReading(null); setQm(null); setQ('') }}>Gieo một quẻ khác</button>
        </div>
      )}
      {msg && <p className="small" style={{ textAlign: 'center' }}>{msg}</p>}
    </section>
  )
}
