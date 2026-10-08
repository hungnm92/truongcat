import { astro } from 'iztro'
import type { IFunctionalAstrolabe as FunctionalAstrolabe } from 'iztro/lib/astro/FunctionalAstrolabe'
import type { IFunctionalPalace as FunctionalPalace } from 'iztro/lib/astro/FunctionalPalace'
import { NA_AM, PROVINCES, canHanToVi, chiHanToVi } from './vn'
import { lunarOfSolar } from './calendar'
import { Solar } from 'lunar-javascript'

export interface Journey {
  love: string
  children: string
  field: string
  stage: string
}

export interface BirthInput {
  name: string
  day: number
  month: number
  year: number
  hour: number
  minute: number
  gender: 'Nam' | 'Nữ'
  province: string
  viewYear: number
  solarAdjust: boolean
  journey: Journey
}

export const NO_JOURNEY: Journey = { love: '', children: '', field: '', stage: '' }

export interface Chart {
  input: BirthInput
  astro: FunctionalAstrolabe
  palaces: FunctionalPalace[]
  napAm: string
  canNam: string
  chiNam: string
  /** giờ sinh đã hiệu chỉnh (nếu có) */
  effective: { y: number; m: number; d: number; h: number; mi: number }
  timeIndex: number
}

export function validateBirth(b: BirthInput): string | null {
  if (!b.name.trim()) return 'Vui lòng nhập họ tên đương số.'
  const { day, month, year, hour, minute } = b
  if (![day, month, year, hour, minute].every(Number.isFinite)) return 'Ngày giờ sinh chưa đầy đủ.'
  if (year < 1900 || year > 2100) return 'Năm sinh cần nằm trong khoảng 1900–2100.'
  if (month < 1 || month > 12) return 'Tháng sinh không hợp lệ.'
  const dim = new Date(year, month, 0).getDate()
  if (day < 1 || day > dim) return `Tháng ${month}/${year} chỉ có ${dim} ngày.`
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return 'Giờ sinh không hợp lệ.'
  return null
}

/** Địa chi giờ: 0 = Tý sớm (00h), 1..11 = Sửu..Hợi, 12 = Tý muộn (23h). */
export function timeIndexOf(hour: number): number {
  if (hour === 23) return 12
  if (hour === 0) return 0
  return Math.floor((hour + 1) / 2)
}

export function buildChart(b: BirthInput): Chart {
  let { year, month, day, hour, minute } = b
  if (b.solarAdjust) {
    const p = PROVINCES.find((x) => x.name === b.province)
    if (p) {
      const shift = Math.round((p.lng - 105) * 4)
      const dt = new Date(year, month - 1, day, hour, minute + shift)
      year = dt.getFullYear(); month = dt.getMonth() + 1; day = dt.getDate(); hour = dt.getHours(); minute = dt.getMinutes()
    }
  }
  const timeIndex = timeIndexOf(hour)
  const a = astro.bySolar(`${year}-${month}-${day}`, timeIndex, b.gender === 'Nam' ? '男' : '女', true, 'vi-VN')
  const lunar = Solar.fromYmd(year, month, day).getLunar()
  const naYinHan = lunar.getYearNaYin()
  const ly = lunarOfSolar(year, month, day)
  return {
    input: b,
    astro: a,
    palaces: a.palaces,
    napAm: NA_AM[naYinHan] ?? naYinHan,
    canNam: ly.canNam,
    chiNam: ly.chiNam,
    effective: { y: year, m: month, d: day, h: hour, mi: minute },
    timeIndex,
  }
}

/** Bố cục 4x4 truyền thống: trả về chỉ số palace (theo chi) cho từng ô, null = ô giữa. */
export const GRID_BRANCH_ORDER: (string | null)[] = [
  'Tỵ', 'Ngọ', 'Mùi', 'Thân',
  'Thìn', null, null, 'Dậu',
  'Mão', null, null, 'Tuất',
  'Dần', 'Sửu', 'Tý', 'Hợi',
]

export const palaceByBranch = (c: Chart, branch: string) => c.palaces.find((p) => String(p.earthlyBranch) === branch)!
export const palaceByName = (c: Chart, name: string) => c.palaces.find((p) => p.name === name)!

export const branchNameOf = chiHanToVi
export const stemNameOf = canHanToVi

export const SHORT_PALACE: Record<string, string> = {
  'Mệnh': 'MỆNH', 'Phụ Mẫu': 'PHỤ', 'Phúc Đức': 'PHÚC', 'Điền Trạch': 'ĐIỀN', 'Quan Lộc': 'QUAN', 'Nô Bộc': 'NÔ',
  'Thiên Di': 'DI', 'Tật Ách': 'TẬT', 'Tài Bạch': 'TÀI', 'Tử Nữ': 'TỬ', 'Phu Thê': 'PHỐI', 'Huynh Đệ': 'BÀO',
}

/** Cung Lai Nhân: cung có thiên can trùng can năm sinh (bỏ Tý, Sửu). */
export function laiNhan(c: Chart) {
  const m = c.palaces.filter((p) => String(p.heavenlyStem) === c.canNam)
  return (m.find((p) => !['Tý', 'Sửu'].includes(String(p.earthlyBranch))) ?? m[0])?.name ?? ''
}

const LUC_HOP: Record<string, string> = { Tý: 'Sửu', Sửu: 'Tý', Dần: 'Hợi', Hợi: 'Dần', Mão: 'Tuất', Tuất: 'Mão', Thìn: 'Dậu', Dậu: 'Thìn', Tỵ: 'Thân', Thân: 'Tỵ', Ngọ: 'Mùi', Mùi: 'Ngọ' }

/** Quan hệ của từng cung so với cung đang chọn. */
export function relations(c: Chart, selName: string): Record<string, 'nguon' | 'tamhop' | 'xung' | 'nhihop' | ''> {
  const sp = c.astro.surroundedPalaces(selName as never)
  const sel = String(sp.target.earthlyBranch)
  const out: Record<string, 'nguon' | 'tamhop' | 'xung' | 'nhihop' | ''> = {}
  for (const p of c.palaces) {
    const b = String(p.earthlyBranch)
    out[b] = b === sel ? 'nguon'
      : b === String(sp.opposite.earthlyBranch) ? 'xung'
      : b === String(sp.wealth.earthlyBranch) || b === String(sp.career.earthlyBranch) ? 'tamhop'
      : LUC_HOP[sel] === b ? 'nhihop' : ''
  }
  return out
}
