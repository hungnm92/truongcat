import { useMemo, useState } from 'react'
import { buildOverview } from '../lib/readings'
import type { Chart } from '../lib/chart'
import { ACTIVITY_LABEL, upcomingDays, type Activity } from '../lib/dayPicker'
import { pad2 } from '../lib/vn'

const ACTS = Object.keys(ACTIVITY_LABEL) as Activity[]

export function Overview({ chart }: { chart: Chart }) {
  const [act, setAct] = useState<Activity>('tongquat')
  const ov = useMemo(() => buildOverview(chart), [chart])
  const days = useMemo(() => (act === 'tongquat' ? [] : upcomingDays(new Date(), 45, act, chart.chiNam)), [act, chart.chiNam])
  const best = days.filter((d) => d.score >= 3).slice(0, 5)

  return (
    <section>
      <div className="sub" role="tablist" aria-label="Mục xem">
        {ACTS.map((a) => (
          <button key={a} role="tab" aria-selected={act === a} className={act === a ? 'on' : ''} onClick={() => setAct(a)}>{ACTIVITY_LABEL[a]}</button>
        ))}
      </div>

      {act === 'tongquat' ? (
        <>
          <div className="card" style={{ borderLeft: '4px solid var(--red)', padding: '26px 28px' }}>
            <div className="headline">
              <div>
                <div className="eyebrow" style={{ color: 'var(--red)' }}>Đường đời · Kết luận trọng tâm</div>
                <h2>Bản đồ định hướng cuộc đời</h2>
                <span className="chip red">{ov.title}</span>
              </div>
              <div className="body">
                <p style={{ marginTop: 0 }}>{ov.summary}</p>
                {ov.look && <p className="small" style={{ marginBottom: 0 }}>Cốt cách: {ov.look}.</p>}
              </div>
            </div>
          </div>
          <div className="grid3" style={{ margin: '16px 0' }}>
            <div className="card tinted-green"><div className="col-title g">✦ Điểm nổi bật</div><ul className="dots">{ov.highlights.map((t, i) => <li key={i}>{t}</li>)}</ul></div>
            <div className="card tinted-red"><div className="col-title r">△ Điều cần thận trọng</div><ul className="dots">{ov.cautions.map((t, i) => <li key={i}>{t}</li>)}</ul></div>
            <div className="card tinted-gold"><div className="col-title k">→ Hành động thực tế</div><ul className="dots">{ov.actions.map((t, i) => <li key={i}>{t}</li>)}</ul></div>
          </div>
          <div className="grid2">
            <div className="card">
              <div className="eyebrow">Chỉ số trực quan</div>
              <h3>Nhịp khí của lá số</h3>
              <p className="small">{ov.gauge}</p>
              <div className="meter-row"><span>Dương khí <b>{ov.yang}%</b></span><span>Âm khí <b>{ov.yin}%</b></span></div>
              <div className="bar"><i style={{ width: `${ov.yang}%`, background: 'var(--gold)' }} /><i style={{ width: `${ov.yin}%`, background: 'var(--green)' }} /></div>
              <div className="meter-row" style={{ marginTop: 14 }}><span>Tỷ trọng cát tinh</span><b>{ov.catRatio}%</b></div>
              <div className="bar"><i style={{ width: `${Math.min(100, ov.catRatio * 2)}%`, background: 'var(--good)' }} /></div>
              <div className="meter-row" style={{ marginTop: 10 }}><span>Tỷ trọng sao thử thách</span><b>{ov.satRatio}%</b></div>
              <div className="bar"><i style={{ width: `${Math.min(100, ov.satRatio * 2)}%`, background: 'var(--bad)' }} /></div>
            </div>
            <div className="card">
              <div className="eyebrow">Nghiệm lý quá khứ</div>
              <h3>Những năm đáng chú ý</h3>
              {ov.past.length === 0 && <p className="small">Chưa có năm nào đủ nổi bật để nêu.</p>}
              {ov.past.map((p) => (
                <div key={p.year} style={{ marginBottom: 10, paddingBottom: 10, borderBottom: '1px dashed var(--line)' }}>
                  <b className="serif" style={{ color: 'var(--red)', fontSize: '1.15rem' }}>{p.year}</b> <span className="chip gold">{p.age} tuổi</span>
                  <div className="small" style={{ color: 'var(--ink)' }}>{p.text}</div>
                </div>
              ))}
              <div className="small">Gợi ý tham khảo, hãy tự đối chiếu với trải nghiệm của bạn.</div>
            </div>
          </div>
        </>
      ) : (
        <div className="card">
          <div className="eyebrow">Trạch nhật</div>
          <h2>Ngày hợp để {ACTIVITY_LABEL[act].toLowerCase()}</h2>
          <p className="small">45 ngày tới, chấm theo Trực, Hoàng/Hắc đạo, nhị thập bát tú, các ngày kỵ và xung tuổi {chart.chiNam} của bạn.</p>
          {best.length > 0 && <div style={{ marginBottom: 10 }}><b className="small">Gợi ý nổi bật: </b>{best.map((d) => <span key={`${d.info.solar.m}-${d.info.solar.d}`} className="chip good">{pad2(d.info.solar.d)}/{pad2(d.info.solar.m)} ({d.level})</span>)}</div>}
          <div style={{ overflowX: 'auto' }}>
            <table className="t">
              <thead><tr><th>Ngày</th><th>Âm lịch</th><th>Can chi</th><th>Đánh giá</th><th>Ghi chú</th></tr></thead>
              <tbody>
                {days.map((r) => (
                  <tr key={`${r.info.solar.y}-${r.info.solar.m}-${r.info.solar.d}`}>
                    <td><b className="serif">{pad2(r.info.solar.d)}/{pad2(r.info.solar.m)}</b> <span className="small">{r.info.solar.weekday.replace('Thứ ', 'T').replace('Chủ nhật', 'CN')}</span></td>
                    <td>{r.info.lunar.d}/{r.info.lunar.m}</td>
                    <td>{r.info.lunar.dayGZ}</td>
                    <td><span className={`chip ${r.score >= 3 ? 'good' : r.score < 0 ? 'bad' : ''}`}>{r.level}</span></td>
                    <td className="small">{[...r.reasons.slice(0, 2), ...r.warnings].join(' · ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <p className="disclaimer">Nội dung luận giải được lập bằng quy tắc tính toán, mang tính tham khảo, không thay thế tư vấn chuyên môn về y tế, pháp lý hay tài chính.</p>
    </section>
  )
}
