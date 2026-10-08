import { dayInfo, type DayInfo } from './calendar'
import { DIA_CHI } from './vn'

export type Activity = 'tongquat' | 'xuathanh' | 'dongtho' | 'khaitruong' | 'cuoihoi'

export const ACTIVITY_LABEL: Record<Activity, string> = {
  tongquat: 'Tổng Quát', xuathanh: 'Xuất Hành', dongtho: 'Động Thổ', khaitruong: 'Khai Trương', cuoihoi: 'Cưới Hỏi',
}

// Điểm của 12 Trực theo từng việc (-2..+2). Bảng tự lập theo quy ước phổ thông.
const TRUC_SCORE: Record<string, Record<Activity, number>> = {
  Kiến: { tongquat: 1, xuathanh: 2, dongtho: 0, khaitruong: 1, cuoihoi: 0 },
  Trừ: { tongquat: 1, xuathanh: 1, dongtho: 1, khaitruong: -1, cuoihoi: -1 },
  Mãn: { tongquat: 1, xuathanh: 1, dongtho: -1, khaitruong: 2, cuoihoi: 2 },
  Bình: { tongquat: 1, xuathanh: 1, dongtho: 0, khaitruong: 1, cuoihoi: 2 },
  Định: { tongquat: 2, xuathanh: 0, dongtho: 2, khaitruong: 2, cuoihoi: 2 },
  Chấp: { tongquat: 0, xuathanh: -1, dongtho: 1, khaitruong: 0, cuoihoi: 0 },
  Phá: { tongquat: -2, xuathanh: -2, dongtho: -2, khaitruong: -2, cuoihoi: -2 },
  Nguy: { tongquat: -1, xuathanh: -1, dongtho: -2, khaitruong: -1, cuoihoi: -1 },
  Thành: { tongquat: 2, xuathanh: 2, dongtho: 2, khaitruong: 2, cuoihoi: 2 },
  Thu: { tongquat: 0, xuathanh: 0, dongtho: -1, khaitruong: -1, cuoihoi: -1 },
  Khai: { tongquat: 2, xuathanh: 2, dongtho: 2, khaitruong: 2, cuoihoi: 1 },
  Bế: { tongquat: -1, xuathanh: -2, dongtho: -2, khaitruong: -2, cuoihoi: -2 },
}

export interface DayRating {
  info: DayInfo
  score: number
  level: 'Đại cát' | 'Cát' | 'Bình' | 'Hung' | 'Đại hung'
  reasons: string[]
  warnings: string[]
}

export function rateDay(y: number, m: number, d: number, act: Activity, yearChi?: string): DayRating {
  const info = dayInfo(y, m, d)
  let score = TRUC_SCORE[info.truc]?.[act] ?? 0
  const reasons: string[] = []
  const warnings: string[] = []
  reasons.push(`Trực ${info.truc}`)
  if (info.thanSat.hoangDao) { score += 2; reasons.push(`Hoàng đạo (${info.thanSat.name})`) }
  else { score -= 1; warnings.push(`Hắc đạo (${info.thanSat.name})`) }
  if (info.tu.cat) { score += 1; reasons.push(`Sao ${info.tu.name} tốt`) } else { score -= 1; warnings.push(`Sao ${info.tu.name} xấu`) }
  if (info.tamNuong) { score -= 2; warnings.push('Ngày Tam Nương') }
  if (info.nguyetKy) { score -= 2; warnings.push('Ngày Nguyệt Kỵ') }
  if (info.duongCongKy) { score -= 3; warnings.push('Dương Công Kỵ Nhật') }
  if (yearChi && DIA_CHI.indexOf(yearChi as never) >= 0 && info.chiXung === yearChi) {
    score -= 3; warnings.push(`Ngày xung tuổi ${yearChi}`)
  }
  const level = score >= 5 ? 'Đại cát' : score >= 3 ? 'Cát' : score >= 0 ? 'Bình' : score >= -2 ? 'Hung' : 'Đại hung'
  return { info, score, level, reasons, warnings }
}

export function upcomingDays(from: Date, count: number, act: Activity, yearChi?: string): DayRating[] {
  const out: DayRating[] = []
  for (let i = 0; i < count; i++) {
    const dt = new Date(from.getFullYear(), from.getMonth(), from.getDate() + i)
    out.push(rateDay(dt.getFullYear(), dt.getMonth() + 1, dt.getDate(), act, yearChi))
  }
  return out
}
