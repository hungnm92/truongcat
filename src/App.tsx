import { useEffect, useMemo, useState } from 'react'
import { Header } from './components/Header'
import { BirthPanel, emptyInput } from './components/BirthForm'
import { CalendarModal } from './components/CalendarModal'
import { Overview } from './components/Overview'
import { Chart12 } from './components/Chart12'
import { YearFortune } from './components/YearFortune'
import { Compass } from './components/Compass'
import { Oracle } from './components/Oracle'
import { JourneyModal, Loading, RevealModal } from './components/Modals'
import { Footer, Landing } from './components/Landing'
import { buildChart, type BirthInput } from './lib/chart'

const TABS = [
  { id: 'tong-quan', ic: '◎', title: 'Tổng Quan', sub: 'Mệnh bàn' },
  { id: '12-cung', ic: '▦', title: '12 Cung', sub: 'Tinh bàn' },
  { id: 'van-han', ic: '⟳', title: 'Vận Hạn', sub: 'Theo năm' },
  { id: 'la-ban', ic: '✧', title: 'La Bàn', sub: 'Phương hướng' },
  { id: 'gieo-que', ic: '☯', title: 'Gieo Quẻ', sub: 'Xin một quẻ' },
] as const
type TabId = (typeof TABS)[number]['id']
type Stage = 'idle' | 'reveal' | 'journey' | 'loading'

const STORE = 'truongcat:input'
const FONT = 'truongcat:fs'

function load(): BirthInput | null {
  try {
    const raw = localStorage.getItem(STORE)
    if (!raw) return null
    const b = JSON.parse(raw) as BirthInput
    return b && typeof b.year === 'number' ? b : null
  } catch { return null }
}
function save(b: BirthInput | null) {
  try { if (b) localStorage.setItem(STORE, JSON.stringify(b)); else localStorage.removeItem(STORE) } catch { /* bỏ qua */ }
}
const tabFromHash = (): TabId => (TABS.find((t) => t.id === location.hash.slice(1))?.id ?? 'tong-quan') as TabId
const safeBuild = (b: BirthInput | null) => { try { return b ? buildChart(b) : null } catch { return null } }

export default function App() {
  const [input, setInput] = useState<BirthInput | null>(() => load())
  const [pending, setPending] = useState<BirthInput | null>(null)
  const [stage, setStage] = useState<Stage>('idle')
  const [editing, setEditing] = useState(false)
  const [tab, setTab] = useState<TabId>(tabFromHash)
  const [cal, setCal] = useState(false)
  const [fs, setFs] = useState(() => { try { return Number(localStorage.getItem(FONT)) || 16 } catch { return 16 } })

  useEffect(() => {
    document.documentElement.style.setProperty('--fs', `${fs}px`)
    try { localStorage.setItem(FONT, String(fs)) } catch { /* bỏ qua */ }
  }, [fs])
  useEffect(() => {
    const on = () => setTab(tabFromHash())
    window.addEventListener('hashchange', on)
    return () => window.removeEventListener('hashchange', on)
  }, [])

  const chart = useMemo(() => safeBuild(input), [input])
  const pendingChart = useMemo(() => safeBuild(pending), [pending])

  const scrollTo = (id: string) => setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  const go = (t: string) => {
    if (t === 'form' || !chart) { setEditing(true); scrollTo('lap-la-so'); return }
    location.hash = t
    setTab(t as TabId)
    scrollTo('ket-qua')
  }
  const finish = (b: BirthInput) => {
    setStage('loading')
    setTimeout(() => {
      setInput(b); save(b); setPending(null); setEditing(false); setStage('idle')
      location.hash = 'tong-quan'; setTab('tong-quan'); scrollTo('ket-qua')
    }, 1400)
  }
  const showForm = !chart || editing

  return (
    <>
      <div className="wrap">
        <Header province={input?.province ?? 'Hà Nội'} onCalendar={() => setCal(true)} />

        {showForm && (
          <BirthPanel
            initial={pending ?? input ?? emptyInput()}
            onCalendar={() => setCal(true)}
            onSubmit={(b) => { setPending(b); setStage('reveal') }}
          />
        )}

        {chart && !editing && (
          <div id="ket-qua" style={{ scrollMarginTop: 8 }}>
            <nav className="stepper" aria-label="Các mục">
              {TABS.map((t, i) => (
                <div key={t.id} style={{ display: 'contents' }}>
                  {i > 0 && <span className="step-line" />}
                  <button className={`step ${tab === t.id ? 'on' : ''} ${t.id === 'gieo-que' ? 'alt' : ''}`} aria-current={tab === t.id} onClick={() => go(t.id)}>
                    <span className="ic">{t.ic}</span>
                    <span><b>{t.title}</b><span>{tab === t.id ? 'Đang mở' : t.sub}</span></span>
                  </button>
                </div>
              ))}
            </nav>

            <div className="card" style={{ marginBottom: 16 }}>
              <div className="profile">
                <div className="avatar">{chart.input.gender === 'Nam' ? '♂' : '♀'}</div>
                <div className="who">
                  <div className="label">Thần số mệnh lý</div>
                  <div className="nm">{chart.input.name.toUpperCase()}</div>
                  <div>
                    <span className="chip">🎂 {String(chart.input.day).padStart(2, '0')}/{String(chart.input.month).padStart(2, '0')}/{chart.input.year} · {String(chart.input.hour).padStart(2, '0')}:{String(chart.input.minute).padStart(2, '0')}</span>
                    <span className="chip red">◆ {chart.napAm}</span>
                    <span className="chip">Tuổi {chart.canNam} {chart.chiNam}</span>
                    <span className="chip">{chart.astro.fiveElementsClass}</span>
                  </div>
                  <button className="btn ghost sm" style={{ marginTop: 8 }} onClick={() => { setEditing(true); scrollTo('lap-la-so') }}>✎ Sửa ngày giờ sinh</button>
                </div>
                <button className="compass-btn" onClick={() => go('la-ban')}><span className="c">➤</span>LA BÀN</button>
              </div>
            </div>

            {tab === 'tong-quan' && <Overview chart={chart} />}
            {tab === '12-cung' && <Chart12 chart={chart} />}
            {tab === 'van-han' && <YearFortune chart={chart} />}
            {tab === 'la-ban' && <Compass chart={chart} />}
            {tab === 'gieo-que' && <Oracle chart={chart} />}
          </div>
        )}

        <div style={{ marginTop: 40 }}><Landing onGo={go} /></div>
        <Footer onClear={chart ? () => { save(null); setInput(null); setEditing(false); location.hash = '' } : undefined} />
      </div>

      <div className="fontbtn no-print" aria-label="Cỡ chữ">
        <button aria-label="Tăng cỡ chữ" onClick={() => setFs((v) => Math.min(22, v + 1))}>A+</button>
        <span>{Math.round((fs / 16) * 100)}%</span>
        <button aria-label="Giảm cỡ chữ" onClick={() => setFs((v) => Math.max(13, v - 1))}>A-</button>
      </div>

      {stage === 'reveal' && pendingChart && (
        <RevealModal chart={pendingChart} onBack={() => setStage('idle')} onNext={() => setStage('journey')} />
      )}
      {stage === 'journey' && pending && (
        <JourneyModal input={pending} onBack={() => setStage('reveal')} onDone={(j) => finish({ ...pending, journey: j })} />
      )}
      {stage === 'loading' && <Loading />}
      {cal && <CalendarModal onClose={() => setCal(false)} />}
    </>
  )
}
