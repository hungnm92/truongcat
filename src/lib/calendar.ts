import { Solar } from 'lunar-javascript'
import { NA_AM, THAN_SAT, TRUC, TU, THU, canHanToVi, chiHanToVi, ganZhiToVi } from './vn'

export interface DayInfo {
  solar: { y: number; m: number; d: number; weekday: string }
  lunar: { y: number; m: number; d: number; leap: boolean; yearGZ: string; monthGZ: string; dayGZ: string }
  napAm: string
  truc: string
  thanSat: { name: string; hoangDao: boolean }
  tu: { name: string; cat: boolean }
  chiXung: string // địa chi bị xung
  tietKhi: string | null
  tamNuong: boolean
  nguyetKy: boolean
  duongCongKy: boolean
  dayChi: string
  yearChi: string
  catThan: string[] // tên Hán, tra trong data/thansat
  hungSat: string[]
  gioHoangDao: { chi: string; from: string; to: string }[]
}

const TIET_KHI: Record<string, string> = {
  立春: 'Lập Xuân', 雨水: 'Vũ Thủy', 惊蛰: 'Kinh Trập', 春分: 'Xuân Phân', 清明: 'Thanh Minh', 谷雨: 'Cốc Vũ',
  立夏: 'Lập Hạ', 小满: 'Tiểu Mãn', 芒种: 'Mang Chủng', 夏至: 'Hạ Chí', 小暑: 'Tiểu Thử', 大暑: 'Đại Thử',
  立秋: 'Lập Thu', 处暑: 'Xử Thử', 白露: 'Bạch Lộ', 秋分: 'Thu Phân', 寒露: 'Hàn Lộ', 霜降: 'Sương Giáng',
  立冬: 'Lập Đông', 小雪: 'Tiểu Tuyết', 大雪: 'Đại Tuyết', 冬至: 'Đông Chí', 小寒: 'Tiểu Hàn', 大寒: 'Đại Hàn',
}

// Dương Công kỵ nhật: 13 ngày xấu theo tháng âm (tri thức phổ thông).
const DUONG_CONG_KY: Record<number, number[]> = {
  1: [13], 2: [11], 3: [9], 4: [7], 5: [5], 6: [3], 7: [8, 29], 8: [27], 9: [25], 10: [23], 11: [21], 12: [19],
}

export function dayInfo(y: number, m: number, d: number): DayInfo {
  const solar = Solar.fromYmd(y, m, d)
  const l = solar.getLunar()
  const rawNaYin = l.getDayNaYin()
  const tuHan = l.getXiu()
  const ts = l.getDayTianShen()
  const lm = Math.abs(l.getMonth())
  const ld = l.getDay()
  return {
    solar: { y, m, d, weekday: THU[solar.getWeek()] },
    lunar: {
      y: l.getYear(), m: lm, d: ld, leap: l.getMonth() < 0,
      yearGZ: ganZhiToVi(l.getYearInGanZhi()),
      monthGZ: ganZhiToVi(l.getMonthInGanZhi()),
      dayGZ: ganZhiToVi(l.getDayInGanZhi()),
    },
    napAm: NA_AM[rawNaYin] ?? rawNaYin,
    truc: TRUC[l.getZhiXing()] ?? l.getZhiXing(),
    thanSat: THAN_SAT[ts] ?? { name: ts, hoangDao: l.getDayTianShenType() === '黄道' },
    tu: { name: TU[tuHan] ?? tuHan, cat: l.getXiuLuck() === '吉' },
    chiXung: chiHanToVi(l.getDayChong()),
    tietKhi: TIET_KHI[l.getJieQi()] ?? null,
    tamNuong: [3, 7, 13, 18, 22, 27].includes(ld),
    nguyetKy: [5, 14, 23].includes(ld),
    duongCongKy: (DUONG_CONG_KY[lm] ?? []).includes(ld),
    dayChi: chiHanToVi(l.getDayInGanZhi()[1]),
    yearChi: chiHanToVi(l.getYearInGanZhi()[1]),
    catThan: l.getDayJiShen().filter((x: string) => x !== '无'),
    hungSat: l.getDayXiongSha().filter((x: string) => x !== '无'),
    gioHoangDao: gioHoangDao(l),
  }
}

export function lunarOfSolar(y: number, m: number, d: number) {
  const l = Solar.fromYmd(y, m, d).getLunar()
  return { d: l.getDay(), m: Math.abs(l.getMonth()), y: l.getYear(), leap: l.getMonth() < 0,
    yearGZ: ganZhiToVi(l.getYearInGanZhi()), canNam: canHanToVi(l.getYearInGanZhi()[0]), chiNam: chiHanToVi(l.getYearInGanZhi()[1]) }
}

export function daysInMonth(y: number, m: number) {
  return new Date(y, m, 0).getDate()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function gioHoangDao(l: any) {
  const out: { chi: string; from: string; to: string }[] = []
  // getTimes() trả 13 giờ (Tý sớm + Tý muộn); bỏ Tý muộn để không trùng.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const t of l.getTimes().slice(0, 12) as any[]) {
    if (t.getTianShenType() === '黄道') {
      const chi = chiHanToVi(t.getZhi())
      out.push({ chi, from: chi === 'Tý' ? '23:00' : t.getMinHm(), to: t.getMaxHm() })
    }
  }
  return out
}
