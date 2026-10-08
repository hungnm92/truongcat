import { useEffect, useMemo, useState } from 'react'
import type { BirthInput, Chart, Journey } from '../lib/chart'
import { buildOverview } from '../lib/readings'
import { JOURNEY_OPTIONS } from './BirthForm'
import { Mandala } from './Art'

const QUOTE = 'Thấy trúng thì vui mà ngẫm, thấy chưa trúng thì nhẹ lòng bỏ qua. Điều đáng giữ là bài học cho chặng đường phía trước.'

function useEscape(fn: () => void) {
  useEffect(() => {
    const on = (e: KeyboardEvent) => e.key === 'Escape' && fn()
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [fn])
}

export function RevealModal({ chart, onBack, onNext }: { chart: Chart; onBack: () => void; onNext: () => void }) {
  useEscape(onBack)
  const ov = useMemo(() => buildOverview(chart), [chart])
  const { input } = chart
  const menh = chart.palaces.find((p) => p.name === 'Mệnh')!
  return (
    <div className="modal-bg" role="dialog" aria-modal="true" aria-label="Thiên cơ soi chiếu">
      <div className="modal">
        <div className="reveal">
          <div className="left">
            <div className="eyebrow">Thiên cơ soi chiếu</div>
            <div className="profile" style={{ margin: '10px 0 16px' }}>
              <div className="avatar">{input.name.trim().charAt(0).toUpperCase() || '☯'}</div>
              <div>
                <div className="serif" style={{ fontSize: '1.3rem', fontWeight: 700 }}>{input.name}</div>
                <span className="chip">{input.day}/{input.month}/{input.year}</span><span className="chip red">{chart.napAm}</span>
              </div>
            </div>
            <div className="divider">Nhận diện cốt cách</div>
            <div className="quote-strip" style={{ fontSize: '.95rem' }}>
              <b style={{ color: 'var(--red)' }}>{ov.title} tại {menh.earthlyBranch}.</b> {ov.look ? `Dáng nét: ${ov.look}.` : ''}
              <p style={{ margin: '8px 0 0' }}>{ov.summary}</p>
            </div>
          </div>
          <div className="right">
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <div style={{ flex: 3 }}>
                <h2 style={{ color: 'var(--red)', letterSpacing: '.06em', textTransform: 'uppercase' }}>Nghiệm lý quá khứ</h2>
                <div className="small serif" style={{ fontStyle: 'italic' }}>“Xét chuyện đã qua để hiểu chuyện đang tới”</div>
              </div>
              <span style={{ flex: 'none', fontSize: '1.6rem' }}>⏳</span>
            </div>
            <div className="past-grid" style={{ marginTop: 16 }}>
              {ov.past.length === 0 && <p className="small">Lá số chưa có năm nào đủ nổi bật để đối chiếu.</p>}
              {ov.past.map((p) => (
                <div className="past" key={p.year}>
                  <div className="row"><span className="yr">{p.year}</span><span className="chip gold" style={{ flex: 'none' }}>{p.age} tuổi</span></div>
                  <div className="label" style={{ margin: '4px 0' }}>Mức tham khảo: <span className="chip">Gợi ý</span></div>
                  <div className="small" style={{ color: 'var(--ink)' }}>{p.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="modal-foot">
          <div className="quote-strip">🙏 {QUOTE}</div>
          <div className="btns">
            <button className="btn ghost" onClick={onBack}>Nhập lại</button>
            <button className="btn" onClick={onNext}>Tiếp tục →</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function JourneyModal({ input, onBack, onDone }: { input: BirthInput; onBack: () => void; onDone: (j: Journey) => void }) {
  useEscape(onBack)
  const [j, setJ] = useState<Journey>(input.journey)
  const fields = [
    ['love', 'Tình trạng tình cảm'], ['children', 'Hoàn cảnh con cái'],
    ['field', 'Lĩnh vực công việc'], ['stage', 'Giai đoạn hiện tại'],
  ] as const
  return (
    <div className="modal-bg" role="dialog" aria-modal="true" aria-label="Hành trình nhân sinh">
      <div className="modal narrow">
        <div className="modal-body">
          <div className="center-text">
            <h2 style={{ textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--red)' }}>Hành trình nhân sinh</h2>
            <p className="small serif" style={{ fontStyle: 'italic' }}>Các mục tùy chọn giúp lời luận sát hoàn cảnh hiện tại; không làm thay đổi lá số.</p>
          </div>
          <div className="grid2" style={{ marginTop: 18 }}>
            {fields.map(([k, label]) => (
              <div className="field" key={k}>
                <label htmlFor={`j-${k}`} style={{ color: 'var(--gold)' }}>◆ {label}</label>
                <select id={`j-${k}`} value={j[k]} onChange={(e) => setJ({ ...j, [k]: e.target.value })}>
                  <option value="">Không muốn cung cấp</option>
                  {JOURNEY_OPTIONS[k].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-foot">
          <div className="btns">
            <button className="btn ghost" onClick={onBack}>Quay lại</button>
            <button className="btn" onClick={() => onDone(j)}>Khai ấn →</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Loading() {
  const [i, setI] = useState(0)
  const msgs = ['Đang an sao…', 'Đang định cục…', 'Đang soi tam phương…']
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % msgs.length), 450)
    return () => clearInterval(t)
  }, [msgs.length])
  return (
    <div className="loading" role="status" aria-live="polite">
      <div>
        <div className="spin" style={{ width: 160, margin: '0 auto' }}><Mandala /></div>
        <p>{msgs[i]}</p>
      </div>
    </div>
  )
}
