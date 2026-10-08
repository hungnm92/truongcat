import { useEffect, useState } from 'react'
import { dayInfo } from '../lib/calendar'
import { PROVINCES, pad2 } from '../lib/vn'
import { BRAND } from '../config'
import { Logo } from './Logo'

const WEATHER: Record<number, [string, string]> = {
  0: ['☀️', 'Trời quang'], 1: ['🌤️', 'Ít mây'], 2: ['⛅', 'Mây rải rác'], 3: ['☁️', 'Nhiều mây'],
  45: ['🌫️', 'Sương mù'], 48: ['🌫️', 'Sương mù'], 51: ['🌦️', 'Mưa phùn'], 53: ['🌦️', 'Mưa phùn'], 55: ['🌦️', 'Mưa phùn'],
  61: ['🌧️', 'Mưa nhỏ'], 63: ['🌧️', 'Mưa vừa'], 65: ['🌧️', 'Mưa to'], 80: ['🌦️', 'Mưa rào'], 81: ['🌦️', 'Mưa rào'],
  82: ['⛈️', 'Mưa rào mạnh'], 95: ['⛈️', 'Dông'], 96: ['⛈️', 'Dông'], 99: ['⛈️', 'Dông'],
}

export function Header({ province }: { province: string }) {
  const now = new Date()
  const d = dayInfo(now.getFullYear(), now.getMonth() + 1, now.getDate())
  const [w, setW] = useState<{ t: number; code: number } | null>(null)
  const place = PROVINCES.find((p) => p.name === province) ?? PROVINCES.find((p) => p.name === 'Hà Nội')!

  useEffect(() => {
    const ctl = new AbortController()
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${place.lat}&longitude=${place.lng}&current=temperature_2m,weather_code`, { signal: ctl.signal })
      .then((r) => r.json())
      .then((j) => setW({ t: j.current.temperature_2m, code: j.current.weather_code }))
      .catch(() => setW(null))
    return () => ctl.abort()
  }, [place.lat, place.lng])

  const [icon, text] = w ? (WEATHER[w.code] ?? ['🌡️', 'Thời tiết']) : ['', '']
  return (
    <header className="hero">
      <div className="brand">
        <Logo size={92} />
        <div className="brand-title">{BRAND.full}</div>
        <div className="brand-sub">{BRAND.tagline}</div>
      </div>
      <div className="today">
        <div className="dcard sun">
          <div style={{ flex: 1 }}>
            <div className="label">☀ Ngày dương · {d.solar.weekday}</div>
            <div className="num">{pad2(d.solar.d)} <small>/ {pad2(d.solar.m)} / {d.solar.y}</small></div>
          </div>
          <div className="vsep" />
          <div style={{ textAlign: 'right' }}>
            <div className="label">{place.name}</div>
            {w ? <><div className="temp">{w.t.toFixed(1)}°C</div><span className="chip">{icon} {text}</span></> : <div className="small">Đang xem trời…</div>}
          </div>
        </div>
        <div className="dcard moon">
          <div className="calblock"><b>THÁNG {d.lunar.m}{d.lunar.leap ? 'N' : ''}</b><span>{d.lunar.d}</span></div>
          <div style={{ flex: 1 }}>
            <div className="serif" style={{ fontWeight: 600 }}>Ngày {d.lunar.dayGZ} <span className="muted">·</span> <span style={{ color: 'var(--red)' }}>Tháng {d.lunar.monthGZ}</span></div>
            <div className="small">Năm {d.lunar.yearGZ}{d.tietKhi ? ` · Tiết ${d.tietKhi}` : ''}</div>
            <div>
              <span className="chip red">{d.napAm}</span>
              <span className="chip">Trực {d.truc}</span>
              <span className={`chip ${d.thanSat.hoangDao ? 'good' : 'bad'}`}>{d.thanSat.name}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
