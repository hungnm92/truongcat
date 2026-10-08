import { useMemo, useState } from 'react'
import type { Chart } from '../lib/chart'
import { levelIcon, readYear } from '../lib/readings'
import { ChartBoard } from './ChartBoard'

export function YearFortune({ chart }: { chart: Chart }) {
  const [year, setYear] = useState(chart.input.viewYear)
  const [sel, setSel] = useState('Mệnh')
  const safe = Math.min(2200, Math.max(chart.input.year, year))
  const r = useMemo(() => readYear(chart, safe), [chart, safe])
  const max = Math.max(...r.items.map((i) => Math.abs(i.score)), 1)

  return (
    <section>
      <div className="row" style={{ marginBottom: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: '3 1 220px' }}><div className="eyebrow">Vận trình theo năm</div><h2 style={{ margin: 0 }}>Năm {r.canChi} · {safe}</h2></div>
        <div className="row" style={{ flex: 'none', gap: 6 }}>
          <button className="btn ghost sm" onClick={() => setYear(safe - 1)} aria-label="Năm trước">‹</button>
          <input aria-label="Năm xem hạn" type="number" style={{ width: 96, flex: 'none', textAlign: 'center' }} value={safe} onChange={(e) => setYear(Number(e.target.value) || safe)} />
          <button className="btn ghost sm" onClick={() => setYear(safe + 1)} aria-label="Năm sau">›</button>
        </div>
      </div>

      <ChartBoard chart={chart} year={safe} selected={sel} onSelect={setSel} />

      <div className="verdict-hero" style={{ margin: '18px 0' }}>
        <div className="eyebrow">Kết luận vận hạn</div>
        <h2>{r.age} tuổi · Đại vận {r.decadalRange}</h2>
        <p>{r.summary}</p>
        <div>
          {(['Lộc', 'Quyền', 'Khoa', 'Kỵ'] as const).map((k) => <span key={k} className="chip" style={{ background: '#ffffff18', color: '#fff3dc', borderColor: '#ffffff33' }}>Hóa {k}: {r.mutagen[k]}</span>)}
        </div>
      </div>
      <div className="grid3" style={{ marginBottom: 18 }}>
        <div className="card tinted-green"><div className="col-title g">✦ Điểm nổi bật</div><ul className="dots">{r.highlights.map((t, i) => <li key={i}>{t}</li>)}</ul></div>
        <div className="card tinted-red"><div className="col-title r">△ Điều cần thận trọng</div><ul className="dots">{r.cautions.map((t, i) => <li key={i}>{t}</li>)}</ul></div>
        <div className="card tinted-gold"><div className="col-title k">→ Hành động thực tế</div><ul className="dots">{r.actions.map((t, i) => <li key={i}>{t}</li>)}</ul></div>
      </div>

      <div className="section-title" style={{ marginTop: 26 }}>
        <div className="eyebrow">Đại vận – Lưu niên</div>
        <h2>Luận 12 cung năm {safe}</h2>
      </div>
      <div className="fortune">
        {r.items.map((it) => {
          const good = it.level === 'Rất tốt' || it.level === 'Tốt'
          return (
            <div className="card" key={it.palace} style={{ cursor: 'pointer', borderColor: sel === it.palace ? 'var(--red)' : undefined }} onClick={() => setSel(it.palace)}>
              <div className="hd">
                <h4 style={{ margin: 0 }}>{levelIcon(it.level)} {it.palace} <span className="small">({it.branch}) → {it.yearPalace}</span></h4>
                <span className={`lvl ${good ? 'good' : it.level === 'Cần thận trọng' ? 'bad' : ''}`}>{it.level}</span>
              </div>
              <div className="bar" style={{ margin: '10px 0' }} aria-hidden>
                <i style={{ width: `${Math.max(6, ((it.score + max) / (2 * max)) * 100)}%`, background: it.score >= 0 ? 'var(--good)' : 'var(--bad)' }} />
              </div>
              <p className="small" style={{ margin: 0, color: 'var(--ink)' }}>{it.text}</p>
              {it.stars.length > 0 && <div style={{ marginTop: 6 }}>{it.stars.map((s) => <span key={s} className="chip">{s}</span>)}</div>}
            </div>
          )
        })}
      </div>
      <p className="disclaimer">Điểm từng cung = tam phương tứ chính của lá số gốc + ảnh hưởng tứ hóa lưu niên. Đây là mô hình tham khảo, không phải dự đoán chắc chắn.</p>
    </section>
  )
}
