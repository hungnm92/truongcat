import { useMemo, useState } from 'react'
import type { Chart } from '../lib/chart'
import { levelIcon, readPalace } from '../lib/readings'
import { ChartBoard, PalacePicker } from './ChartBoard'

export function Chart12({ chart }: { chart: Chart }) {
  const [sel, setSel] = useState('Mệnh')
  const reading = useMemo(() => readPalace(chart, sel), [chart, sel])
  const sp = chart.astro.surroundedPalaces(sel as never)
  const good = reading.level === 'Rất tốt' || reading.level === 'Tốt'
  return (
    <section>
      <ChartBoard chart={chart} year={chart.input.viewYear} selected={sel} onSelect={setSel} />
      <PalacePicker chart={chart} selected={sel} onSelect={setSel} />
      <div className="card">
        <div className="row" style={{ alignItems: 'baseline', flexWrap: 'wrap' }}>
          <div style={{ flex: '3 1 260px' }}>
            <div className="eyebrow">Luận cung · {reading.decadal}</div>
            <h2 style={{ margin: '4px 0' }}>{levelIcon(reading.level)} {reading.headline}</h2>
          </div>
          <span className={`lvl ${good ? 'good' : reading.level === 'Cần thận trọng' ? 'bad' : ''}`} style={{ flex: 'none' }}>{reading.level} · {reading.score > 0 ? '+' : ''}{reading.score}</span>
        </div>
        {reading.stars.length > 0 && <div style={{ margin: '6px 0 10px' }}>{reading.stars.map((s) => <span key={s} className="chip">{s}</span>)}</div>}
        <div className="serif" style={{ fontSize: '1.02rem' }}>
          {reading.paragraphs.map((t, i) => <p key={i} style={{ margin: '8px 0' }}>{t}</p>)}
        </div>
        <p className="small">Tam hợp: {sp.wealth.name}, {sp.career.name} · Xung chiếu: {sp.opposite.name}. Điểm = sao bản cung + 70% đối cung + 50% hai cung tam hợp.</p>
      </div>
    </section>
  )
}
