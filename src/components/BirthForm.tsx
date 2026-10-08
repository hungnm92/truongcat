import { useState } from 'react'
import { NO_JOURNEY, timeIndexOf, validateBirth, type BirthInput } from '../lib/chart'
import { DIA_CHI, PROVINCES, pad2 } from '../lib/vn'
import { lunarOfSolar } from '../lib/calendar'
import { Mandala } from './Art'

export const JOURNEY_OPTIONS = {
  love: ['Độc thân', 'Đang yêu', 'Đã kết hôn', 'Đã ly hôn', 'Góa'],
  children: ['Chưa có', 'Đang mong con', 'Đã có con'],
  field: ['Kinh doanh / Buôn bán', 'Công sở / Văn phòng', 'Kỹ thuật / Công nghệ', 'Sáng tạo / Nghệ thuật', 'Giáo dục', 'Y tế', 'Hành chính / Nhà nước', 'Lao động tự do', 'Khác'],
  stage: ['Đang đi học', 'Đang đi làm', 'Kinh doanh riêng', 'Đang chuyển hướng', 'Đã nghỉ hưu'],
}

export const emptyInput = (): BirthInput => ({
  name: '', day: NaN, month: NaN, year: NaN, hour: NaN, minute: 0, gender: 'Nam', province: 'Hà Nội',
  viewYear: new Date().getFullYear(), solarAdjust: false, journey: NO_JOURNEY,
})

const num = (v: string) => (v === '' ? NaN : Number(v))
const val = (n: number) => (Number.isFinite(n) ? n : '')

function NumBox({ label, name, value, min, max, onChange, ph }: { label: string; name: string; value: number; min: number; max: number; ph: string; onChange: (n: number) => void }) {
  return (
    <label className="box">
      <span>{label}</span>
      <input type="number" inputMode="numeric" name={name} aria-label={label} placeholder={ph} min={min} max={max} value={val(value)} onChange={(e) => onChange(num(e.target.value))} />
    </label>
  )
}

/** Dòng đối chiếu dương → âm lịch, cập nhật theo từng ô nhập. */
function LunarPreview({ b }: { b: BirthInput }) {
  const { day, month, year, hour, minute } = b
  const dateOk = [day, month, year].every(Number.isFinite) && year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= new Date(year, month, 0).getDate()
  if (!dateOk) return <div className="lunar-preview muted">Nhập đủ ngày, tháng, năm để xem ngày âm lịch tương ứng.</div>

  let dt = new Date(year, month - 1, day, Number.isFinite(hour) ? hour : 12, Number.isFinite(minute) ? minute : 0)
  const shifted = b.solarAdjust && Number.isFinite(hour)
  if (shifted) {
    const p = PROVINCES.find((x) => x.name === b.province)
    if (p) dt = new Date(dt.getTime() + Math.round((p.lng - 105) * 4) * 60000)
  }
  const l = lunarOfSolar(dt.getFullYear(), dt.getMonth() + 1, dt.getDate())
  const hourOk = Number.isFinite(hour) && hour >= 0 && hour <= 23
  const ti = hourOk ? timeIndexOf(dt.getHours()) : -1
  const chi = ti < 0 ? '' : DIA_CHI[ti % 12]
  const from = ti <= 0 || ti === 12 ? 23 : ti * 2 - 1
  const range = ti < 0 ? '' : `${pad2(from)}h–${pad2((from + 2) % 24)}h`
  const beforeTet = l.y !== year

  return (
    <div className="lunar-preview" aria-live="polite">
      <div>
        <span className="muted">= Âm lịch </span>
        <b>{l.d}/{l.m}{l.leap ? ' (nhuận)' : ''}</b> năm <b>{l.yearGZ}</b>
        {hourOk && <> · giờ <b>{chi}</b> <span className="muted">({range})</span></>}
      </div>
      {shifted && <div className="small">Đã hiệu chỉnh theo kinh độ {b.province}: {pad2(dt.getHours())}:{pad2(dt.getMinutes())}{dt.getDate() !== day ? ` ngày ${dt.getDate()}/${dt.getMonth() + 1}` : ''}.</div>}
      {beforeTet && <div className="small">Sinh trước Tết Nguyên Đán nên tính tuổi <b>{l.yearGZ}</b> ({l.y}), không phải năm {year}.</div>}
      {l.leap && <div className="small">Tháng nhuận: lá số an theo quy ước nửa đầu tháng tính tháng trước, nửa sau tính tháng sau.</div>}
      {hourOk && dt.getHours() === 23 && <div className="small">Giờ Tý muộn (23h–24h): đang tính theo ngày {day}/{month}. Một số trường phái tính sang ngày hôm sau.</div>}
    </div>
  )
}

export function BirthPanel({ initial, onSubmit, onCalendar }: { initial: BirthInput; onSubmit: (b: BirthInput) => void; onCalendar: () => void }) {
  const [b, setB] = useState<BirthInput>(initial)
  const [err, setErr] = useState<string | null>(null)
  const set = <K extends keyof BirthInput>(k: K, v: BirthInput[K]) => setB((p) => ({ ...p, [k]: v }))

  const submit = () => {
    const e = validateBirth(b)
    setErr(e)
    if (!e) onSubmit(b)
  }

  return (
    <div className="panel" id="lap-la-so">
      <div className="side">
        <div className="eyebrow" style={{ color: '#c9b277' }}>Huyền bàn lập mệnh</div>
        <h2>THIÊN CƠ</h2>
        <p>Ghi đúng sinh thần để tinh bàn soi rõ gốc rễ và vận trình.</p>
        <Mandala className="mandala" />
        <div className="foot">Thiên – Địa – Nhân hợp nhất</div>
      </div>
      <form className="main" onSubmit={(e) => { e.preventDefault(); submit() }} noValidate>
        <div className="form-head">
          <div>
            <h3>Nhập sinh thần</h3>
            <div className="small">Mọi tính toán chạy ngay trên trình duyệt, thông tin không gửi đi đâu.</div>
          </div>
          <button type="button" className="btn ghost sm" onClick={onCalendar}>▦ Tra lịch vạn niên</button>
        </div>
        <div className="field">
          <label htmlFor="f-name">Họ và tên đương số</label>
          <input id="f-name" type="text" name="name" autoComplete="off" placeholder="Ví dụ: Nguyễn Văn An" value={b.name} onChange={(e) => set('name', e.target.value)} style={{ fontFamily: 'var(--serif)', fontSize: '1.1rem', fontWeight: 600 }} />
        </div>
        <div className="field">
          <span className="label">Ngày sinh dương lịch</span>
          <div className="row">
            <NumBox label="Ngày" name="day" ph="15" min={1} max={31} value={b.day} onChange={(n) => set('day', n)} />
            <NumBox label="Tháng" name="month" ph="6" min={1} max={12} value={b.month} onChange={(n) => set('month', n)} />
            <NumBox label="Năm" name="year" ph="1990" min={1900} max={2100} value={b.year} onChange={(n) => set('year', n)} />
          </div>
        </div>
        <div className="grid2" style={{ gap: 14 }}>
          <div className="field">
            <span className="label">Giờ sinh (24h)</span>
            <div className="row">
              <NumBox label="Giờ" name="hour" ph="10" min={0} max={23} value={b.hour} onChange={(n) => set('hour', n)} />
              <b style={{ flex: 'none' }}>:</b>
              <NumBox label="Phút" name="minute" ph="30" min={0} max={59} value={b.minute} onChange={(n) => set('minute', n)} />
            </div>
          </div>
          <div className="field">
            <span className="label">Giới tính</span>
            <div className="seg2" role="radiogroup" aria-label="Giới tính">
              {(['Nam', 'Nữ'] as const).map((g) => (
                <button type="button" role="radio" aria-checked={b.gender === g} key={g} className={b.gender === g ? 'on' : ''} onClick={() => set('gender', g)}>{b.gender === g ? '● ' : '○ '}{g}</button>
              ))}
            </div>
          </div>
        </div>
        <LunarPreview b={b} />
        <div className="grid2" style={{ gap: 14 }}>
          <div className="field">
            <label htmlFor="f-prov">Nơi sinh</label>
            <select id="f-prov" name="province" value={b.province} onChange={(e) => set('province', e.target.value)}>
              {PROVINCES.map((p) => <option key={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-vy">Năm xem hạn</label>
            <input id="f-vy" type="number" name="year_to_view" min={1900} max={2200} value={val(b.viewYear)} onChange={(e) => set('viewYear', num(e.target.value))} />
          </div>
        </div>
        <label className="check">
          <input type="checkbox" checked={b.solarAdjust} onChange={(e) => set('solarAdjust', e.target.checked)} />
          <span>Hiệu chỉnh giờ theo kinh độ nơi sinh (giờ mặt trời thực). Mặc định tắt.</span>
        </label>
        {err && <div className="err" role="alert">{err}</div>}
        <div className="form-foot">
          <span className="small">✓ Kiểm tra kỹ ngày, giờ sinh trước khi khai mở tinh bàn.</span>
          <button type="submit" className="btn red big">☯ Khai Ấn<small>LẬP LÁ SỐ</small></button>
        </div>
      </form>
    </div>
  )
}
