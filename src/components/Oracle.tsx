import { useRef, useState } from 'react'
import { toBlob } from 'html-to-image'
import {
  METHOD_LABEL, TOPIC_OPTIONS, castLines, coinBacksToLine, interpret, timeLines,
  type ChangedLine, type HexInfo, type HexLine, type LineValue, type Method, type Reading, type TopicId,
} from '../lib/iching'
import type { Chart } from '../lib/chart'
import { PALACE_DIR, qimenChart, readQimen, type QMChart, type QMReading } from '../lib/qimen'

const pad = (n: number) => String(n).padStart(2, '0')
const toInput = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
const COIN_OPTS = [
  { backs: 1, label: '1 lưng – Dương ( — )' },
  { backs: 2, label: '2 lưng – Âm ( - - )' },
  { backs: 3, label: '3 lưng – Dương động ( ○ )' },
  { backs: 0, label: '0 lưng – Âm động ( ✕ )' },
]

function Glyph({ yang, moving }: { yang: boolean; moving?: boolean }) {
  return <span className={`glyph ${yang ? 'yang' : 'yin'} ${moving ? 'moving' : ''}`} aria-label={`${yang ? 'Dương' : 'Âm'}${moving ? ' động' : ''}`}><i /><i /></span>
}

function Hexagram({ lines, info }: { lines: { yang: boolean; moving?: boolean }[]; info: HexInfo }) {
  return (
    <div className="hexcard">
      <div className="hexname">{info.name}</div>
      <div className="hex" aria-label={`Quẻ ${info.name}`}>
        {lines.map((l, i) => <div key={i} className={`ln ${l.yang ? '' : 'yin'} ${l.moving ? 'moving' : ''}`}><i /><i /></div>)}
      </div>
      <div className="small">Họ {info.cung} ({info.kind}{info.xungHop ? ` · ${info.xungHop}` : ''}) · quẻ số {info.num}</div>
    </div>
  )
}

const Mark = ({ on, c }: { on: boolean; c: string }) => <td className={on ? 'mk' : 'muted'}>{on ? c : '–'}</td>

function MainTable({ r }: { r: Reading }) {
  const rows = [...r.lines].reverse()
  return (
    <div className="ltable">
      <table className="t">
        <thead><tr><th>Hào</th><th>T/Ư</th><th>Lục thú</th><th>Lục thân</th><th>Can chi</th><th>Phục thần</th><th>TK</th></tr></thead>
        <tbody>
          {rows.map((l) => (
            <tr key={l.pos} className={`${l.moving ? 'mv' : ''} ${r.dungThan?.pos === l.pos ? 'dung' : ''}`}>
              <td><Glyph yang={l.yang} moving={l.moving} /> <span className="small">{l.pos}</span></td>
              <td>{l.the ? 'Thế' : l.ung ? 'Ứng' : ''}</td>
              <td className="small">{l.lucThu}</td>
              <td>{l.lucThan}</td>
              <td>{l.can} {l.chi}-{l.hanh}</td>
              <td className="small">{l.phuc ? `${l.phuc.lucThan} ${l.phuc.can} ${l.phuc.chi}-${l.phuc.hanh}` : ''}</td>
              <td>{l.tuanKhong ? 'K' : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ChangedTable({ r }: { r: Reading }) {
  const rows = [...(r.changedLines as ChangedLine[])].reverse()
  return (
    <div className="ltable">
      <table className="t">
        <thead><tr><th>Lục thân</th><th>Can chi</th><th>TK</th><th>Biến hóa</th><th>Hào</th></tr></thead>
        <tbody>
          {rows.map((c) => {
            const src = r.lines[c.pos - 1]
            return (
              <tr key={c.pos} className={c.moving ? 'mv' : ''}>
                <td>{c.lucThan}</td>
                <td>{c.can} {c.chi}-{c.hanh}</td>
                <td>{c.tuanKhong ? 'K' : ''}</td>
                <td className="small">{c.moving ? src.bien?.hoa.join(', ') || '—' : ''}</td>
                <td><Glyph yang={c.yang} /></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function StateTable({ rows, quai }: { rows: (HexLine | ChangedLine)[]; quai: boolean }) {
  return (
    <div className="ltable">
      <table className="t">
        <thead><tr><th>Hào</th><th>Vượng suy</th>{quai && <th>Quái thân</th>}<th>Lộc</th><th>Mã</th><th>Quý</th><th>Đào</th>{quai && <th>Trạng thái</th>}</tr></thead>
        <tbody>
          {[...rows].reverse().map((l) => (
            <tr key={l.pos} className={l.moving ? 'mv' : ''}>
              <td>{l.can} {l.chi}</td>
              <td className={['Vượng', 'Tướng'].includes(l.vuongSuy) ? 'cat' : ['Tù', 'Tử'].includes(l.vuongSuy) ? 'hung' : ''}>{l.vuongSuy}</td>
              {quai && <Mark on={(l as HexLine).quaiThan} c="QT" />}
              <Mark on={l.loc} c="L" /><Mark on={l.ma} c="M" /><Mark on={l.quy} c="Q" /><Mark on={l.dao} c="Đ" />
              {quai && <td className="small">{(l as HexLine).notes.join(', ')}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Oracle({ chart }: { chart: Chart }) {
  const [q, setQ] = useState('')
  const [topic, setTopic] = useState<TopicId>('auto')
  const [method, setMethod] = useState<Method>('auto')
  const [when, setWhen] = useState(toInput(new Date()))
  const [backs, setBacks] = useState<(number | null)[]>([null, null, null, null, null, null])
  const [reading, setReading] = useState<Reading | null>(null)
  const [maiHoa, setMaiHoa] = useState('')
  const [qm, setQm] = useState<{ chart: QMChart; read: QMReading } | null>(null)
  const [casting, setCasting] = useState(false)
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const cast = () => {
    const text = q.trim()
    if (text.length < 4) { setErr('Hãy ghi rõ điều bạn đang trăn trở (ít nhất vài chữ).'); return }
    const time = new Date(when)
    if (Number.isNaN(time.getTime())) { setErr('Thời điểm lập quẻ không hợp lệ.'); return }
    if (method === 'manual' && backs.some((b) => b === null)) { setErr('Hãy nhập đủ kết quả 6 lần gieo.'); return }
    setErr(''); setCasting(true); setReading(null); setMaiHoa('')
    setTimeout(() => {
      let vals: LineValue[]
      if (method === 'manual') vals = backs.map((b) => coinBacksToLine(b as number))
      else if (method === 'time') { const t = timeLines(time); vals = t.values; setMaiHoa(t.detail) }
      else vals = castLines(text, time)
      setReading(interpret(text, vals, time, chart.input.gender, topic, method))
      const qc = qimenChart(time)
      setQm({ chart: qc, read: readQimen(qc, text) })
      setCasting(false)
    }, method === 'auto' ? 1400 : 500)
  }

  const flash = (m: string) => { setMsg(m); setTimeout(() => setMsg(''), 3500) }
  const copyText = async () => {
    if (!reading) return
    const n = reading.ngayThang
    const t = [
      'Trường Cát Mệnh Lý – Gieo quẻ Lục Hào',
      `Thời gian: ${reading.time.toLocaleString('vi-VN')} · giờ ${n.hourGZ}, ngày ${n.dayGZ}, tháng ${n.monthGZ}, năm ${n.yearGZ}`,
      `Việc cần xem: ${reading.topic.label} · Câu hỏi: ${reading.question}`,
      `Quẻ: ${reading.main.name}${reading.changed ? ` → ${reading.changed.name}` : ''}`,
      ...[...reading.lines].reverse().map((l) => `Hào ${l.pos}${l.moving ? ' (động)' : ''}: ${l.the ? 'Thế ' : l.ung ? 'Ứng ' : ''}${l.lucThan} ${l.can} ${l.chi}-${l.hanh} · ${l.lucThu} · ${l.vuongSuy}${l.tuanKhong ? ' · TK' : ''}`),
      `Kết luận: ${reading.verdict.level}`, '', ...reading.paragraphs,
    ].join('\n')
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

  const n = reading?.ngayThang
  return (
    <section>
      <div className="card oracle-hero" style={{ marginBottom: 16 }}>
        <div className="eyebrow">✧ Huyền cơ linh ứng · Vạn việc do tâm ✧</div>
        <h2>Gieo quẻ Trường Cát</h2>
        <p className="small serif" style={{ fontStyle: 'italic' }}>“Thành tâm thì linh — mỗi việc một quẻ, chớ gieo đi gieo lại.”</p>

        <div className="sub" style={{ justifyContent: 'center' }} role="tablist" aria-label="Phương pháp lập quẻ">
          {(Object.keys(METHOD_LABEL) as Method[]).map((m) => (
            <button key={m} role="tab" aria-selected={method === m} className={method === m ? 'on' : ''} onClick={() => setMethod(m)}>{METHOD_LABEL[m]}</button>
          ))}
        </div>

        <div className="grid2" style={{ textAlign: 'left', gap: 14 }}>
          <div className="field">
            <label htmlFor="topic">Việc cần xem</label>
            <select id="topic" value={topic} onChange={(e) => setTopic(e.target.value as TopicId)}>
              {TOPIC_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="when">Thời điểm lập quẻ</label>
            <div className="row">
              <input id="when" type="datetime-local" value={when} onChange={(e) => setWhen(e.target.value)} />
              <button className="btn ghost sm" style={{ flex: 'none' }} onClick={() => setWhen(toInput(new Date()))}>Bây giờ</button>
            </div>
          </div>
        </div>
        <div className="field" style={{ textAlign: 'left' }}>
          <label htmlFor="q">Điều bạn đang trăn trở</label>
          <textarea id="q" rows={3} maxLength={300} placeholder="Ví dụ: Tôi có nên bán căn nhà đang ở trong năm nay không?" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>

        {method === 'manual' && (
          <div className="card" style={{ textAlign: 'left', background: '#fffdf8', marginBottom: 14 }}>
            <div className="label">Gieo 3 đồng xu 6 lần, ghi số mặt lưng (sấp) mỗi lần. Lần 1 là hào 1 (dưới cùng).</div>
            <div className="coins">
              {backs.map((b, i) => (
                <div className="field" key={i} style={{ marginBottom: 0 }}>
                  <label htmlFor={`coin-${i}`}>Lần {i + 1} · hào {i + 1}</label>
                  <select id={`coin-${i}`} value={b ?? ''} onChange={(e) => setBacks(backs.map((x, k) => (k === i ? Number(e.target.value) : x)))}>
                    <option value="" disabled>Chọn…</option>
                    {COIN_OPTS.map((o) => <option key={o.backs} value={o.backs}>{o.label}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}
        {method === 'time' && <p className="small">Quẻ được lập từ năm, tháng, ngày âm lịch và giờ của thời điểm đã chọn (phép Mai Hoa Dịch Số), luôn có một hào động.</p>}

        {err && <div className="err" role="alert">{err}</div>}
        <button className="btn red" disabled={casting} onClick={cast}>{casting ? 'Đang lập quẻ…' : 'Thành tâm thỉnh quẻ'}</button>
        {casting && <p className="small pulse">☯ Sáu hào đang hiện…</p>}
      </div>

      {reading && n && (
        <div ref={ref} className="card que-sheet">
          <div className="que-head">
            <div>
              <h3 style={{ margin: 0, letterSpacing: '.06em', textTransform: 'uppercase' }}>Trang Dịch quái</h3>
              <table className="kv">
                <tbody>
                  <tr><td>Thời gian lập quẻ</td><td><b>{reading.time.toLocaleString('vi-VN')}</b> (giờ {n.hourGZ.split(' ')[1]}, ngày {n.lunar} âm lịch)</td></tr>
                  <tr><td>Can chi</td><td>Giờ <b>{n.hourGZ}</b>, ngày <b>{n.dayGZ}</b>, tháng <b>{n.monthGZ}</b>, năm <b>{n.yearGZ}</b></td></tr>
                  <tr><td>Tiết khí</td><td><b>{n.jieqi}</b> · Nhật thần <b>{n.dayChi}</b> · Nguyệt lệnh <b>{n.monthChi}</b> · Tuần không <b>{n.tuanKhong.join(', ')}</b></td></tr>
                  <tr><td>Phương pháp</td><td>Lục hào · {METHOD_LABEL[reading.method]}</td></tr>
                  <tr><td>Việc cần xem</td><td style={{ color: 'var(--red)' }}><b>{reading.topic.label}</b> — {reading.question}</td></tr>
                </tbody>
              </table>
              {maiHoa && <p className="small">{maiHoa}</p>}
            </div>
          </div>

          <div className="que-grid">
            <div>
              <Hexagram info={reading.main} lines={reading.lines} />
              <MainTable r={reading} />
            </div>
            {reading.changed && reading.changedLines && (
              <div>
                <Hexagram info={reading.changed} lines={reading.changedLines.map((l) => ({ yang: l.yang }))} />
                <ChangedTable r={reading} />
              </div>
            )}
          </div>
          <div className="que-grid" style={{ marginTop: 12 }}>
            <StateTable rows={reading.lines} quai />
            {reading.changedLines && <StateTable rows={reading.changedLines} quai={false} />}
          </div>
          <p className="small">Hào đỏ là hào động · dòng vàng là Dụng thần · TK: Tuần không · QT: Quái thân · L: Lộc thần · M: Dịch mã · Q: Quý nhân · Đ: Đào hoa. Lục thân của quẻ biến tính theo cung quẻ chủ.</p>

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
                      <div className="small">{c.star}{c.extra ? ' + Cầm' : ''}</div>
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
            <div className="small">Độ đồng thuận: {reading.verdict.consensus.toFixed(1)} · Dụng thần: {reading.dungThan ? `${reading.dungThan.lucThan} ${reading.dungThan.chi}${reading.dungThan.phuc ? ' (phục thần)' : ''}` : 'không hiện'}</div>
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
          <button className="btn sm" onClick={() => { setReading(null); setQm(null); setQ(''); setBacks([null, null, null, null, null, null]); setWhen(toInput(new Date())) }}>Gieo một quẻ khác</button>
        </div>
      )}
      {msg && <p className="small" style={{ textAlign: 'center' }}>{msg}</p>}
    </section>
  )
}
