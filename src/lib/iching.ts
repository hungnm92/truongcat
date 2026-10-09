import { Solar } from 'lunar-javascript'
import { lookupHexagram, type Tri } from '../data/hexagrams'
import { CHI_HANH, DIA_CHI, canHanToVi, chiHanToVi, hanhKhac, hanhSinh, type Hanh } from './vn'

// Hào tính từ dưới lên. Giá trị 6 (lão âm, động), 7 (thiếu dương), 8 (thiếu âm), 9 (lão dương, động).
export type LineValue = 6 | 7 | 8 | 9

const LINES: Record<Tri, [number, number, number]> = {
  Càn: [1, 1, 1], Đoài: [1, 1, 0], Ly: [1, 0, 1], Chấn: [1, 0, 0],
  Tốn: [0, 1, 1], Khảm: [0, 1, 0], Cấn: [0, 0, 1], Khôn: [0, 0, 0],
}
const TRI_LIST = Object.keys(LINES) as Tri[]
const triOf = (l: (number | boolean)[]): Tri => TRI_LIST.find((t) => LINES[t].every((v, i) => v === Number(l[i])))!

const TRI_HANH: Record<Tri, Hanh> = { Càn: 'Kim', Đoài: 'Kim', Ly: 'Hỏa', Chấn: 'Mộc', Tốn: 'Mộc', Khảm: 'Thủy', Cấn: 'Thổ', Khôn: 'Thổ' }
// Nạp giáp: [can nội, can ngoại], [chi nội (hào 1-3)], [chi ngoại (hào 4-6)]
const NAP: Record<Tri, [[string, string], string[], string[]]> = {
  Càn: [['Giáp', 'Nhâm'], ['Tý', 'Dần', 'Thìn'], ['Ngọ', 'Thân', 'Tuất']],
  Khôn: [['Ất', 'Quý'], ['Mùi', 'Tỵ', 'Mão'], ['Sửu', 'Hợi', 'Dậu']],
  Chấn: [['Canh', 'Canh'], ['Tý', 'Dần', 'Thìn'], ['Ngọ', 'Thân', 'Tuất']],
  Tốn: [['Tân', 'Tân'], ['Sửu', 'Hợi', 'Dậu'], ['Mùi', 'Tỵ', 'Mão']],
  Khảm: [['Mậu', 'Mậu'], ['Dần', 'Thìn', 'Ngọ'], ['Thân', 'Tuất', 'Tý']],
  Ly: [['Kỷ', 'Kỷ'], ['Mão', 'Sửu', 'Hợi'], ['Dậu', 'Mùi', 'Tỵ']],
  Cấn: [['Bính', 'Bính'], ['Thìn', 'Ngọ', 'Thân'], ['Tuất', 'Tý', 'Dần']],
  Đoài: [['Đinh', 'Đinh'], ['Tỵ', 'Mão', 'Sửu'], ['Hợi', 'Dậu', 'Mùi']],
}
const napOf = (lower: Tri, upper: Tri, i: number) =>
  i < 3 ? { can: NAP[lower][0][0], chi: NAP[lower][1][i] } : { can: NAP[upper][0][1], chi: NAP[upper][2][i - 3] }

const FLIP_SETS = [[], [0], [0, 1], [0, 1, 2], [0, 1, 2, 3], [0, 1, 2, 3, 4], [0, 1, 2, 4], [3, 4]]
const THE_POS = [6, 1, 2, 3, 4, 5, 4, 3]
const CUNG_NAME = ['Bát Thuần', 'Nhất Thế', 'Nhị Thế', 'Tam Thế', 'Tứ Thế', 'Ngũ Thế', 'Du Hồn', 'Quy Hồn']

export type LucThan = 'Phụ Mẫu' | 'Huynh Đệ' | 'Tử Tôn' | 'Thê Tài' | 'Quan Quỷ'
const LUC_THU = ['Thanh Long', 'Chu Tước', 'Câu Trần', 'Đằng Xà', 'Bạch Hổ', 'Huyền Vũ']
const LUC_THU_START: Record<string, number> = { Giáp: 0, Ất: 0, Bính: 1, Đinh: 1, Mậu: 2, Kỷ: 3, Canh: 4, Tân: 4, Nhâm: 5, Quý: 5 }

function lucThanOf(palaceHanh: Hanh, lineHanh: Hanh): LucThan {
  if (palaceHanh === lineHanh) return 'Huynh Đệ'
  if (hanhSinh(palaceHanh, lineHanh)) return 'Tử Tôn'
  if (hanhSinh(lineHanh, palaceHanh)) return 'Phụ Mẫu'
  if (hanhKhac(palaceHanh, lineHanh)) return 'Thê Tài'
  return 'Quan Quỷ'
}

// Thần sát theo ngày
const LOC: Record<string, string> = { Giáp: 'Dần', Ất: 'Mão', Bính: 'Tỵ', Mậu: 'Tỵ', Đinh: 'Ngọ', Kỷ: 'Ngọ', Canh: 'Thân', Tân: 'Dậu', Nhâm: 'Hợi', Quý: 'Tý' }
const QUY_NHAN: Record<string, string[]> = { Giáp: ['Sửu', 'Mùi'], Mậu: ['Sửu', 'Mùi'], Canh: ['Sửu', 'Mùi'], Ất: ['Tý', 'Thân'], Kỷ: ['Tý', 'Thân'], Bính: ['Hợi', 'Dậu'], Đinh: ['Hợi', 'Dậu'], Tân: ['Ngọ', 'Dần'], Nhâm: ['Mão', 'Tỵ'], Quý: ['Mão', 'Tỵ'] }
const TAM_HOP_GROUP = (chi: string) => (['Thân', 'Tý', 'Thìn'].includes(chi) ? 0 : ['Dần', 'Ngọ', 'Tuất'].includes(chi) ? 1 : ['Tỵ', 'Dậu', 'Sửu'].includes(chi) ? 2 : 3)
const DICH_MA = ['Dần', 'Thân', 'Hợi', 'Tỵ']
const DAO_HOA = ['Dậu', 'Mão', 'Ngọ', 'Tý']
const CLASH: Record<string, string> = { Tý: 'Ngọ', Ngọ: 'Tý', Sửu: 'Mùi', Mùi: 'Sửu', Dần: 'Thân', Thân: 'Dần', Mão: 'Dậu', Dậu: 'Mão', Thìn: 'Tuất', Tuất: 'Thìn', Tỵ: 'Hợi', Hợi: 'Tỵ' }
const TIEN_THAN: Record<string, string> = { Hợi: 'Tý', Dần: 'Mão', Tỵ: 'Ngọ', Thân: 'Dậu', Sửu: 'Thìn', Thìn: 'Mùi', Mùi: 'Tuất', Tuất: 'Sửu' }
const THOAI_THAN = Object.fromEntries(Object.entries(TIEN_THAN).map(([a, b]) => [b, a])) as Record<string, string>

// Quẻ Lục xung / Lục hợp
const LUC_XUNG = new Set([1, 2, 29, 30, 51, 52, 57, 58, 25, 34])
const LUC_HOP = new Set([11, 12, 16, 24, 47, 60, 22, 56])

export type VuongSuy = 'Vượng' | 'Tướng' | 'Hưu' | 'Tù' | 'Tử'
const VS_SCORE: Record<VuongSuy, number> = { Vượng: 2, Tướng: 1, Hưu: 0, Tù: -1, Tử: -2 }
function vuongSuy(lineHanh: Hanh, ref: Hanh): VuongSuy {
  if (lineHanh === ref) return 'Vượng'
  if (hanhSinh(ref, lineHanh)) return 'Tướng'
  if (hanhSinh(lineHanh, ref)) return 'Hưu'
  if (hanhKhac(lineHanh, ref)) return 'Tù'
  return 'Tử'
}

export interface LineBase { can: string; chi: string; hanh: Hanh; lucThan: LucThan; tuanKhong: boolean; vuongSuy: VuongSuy }
export interface HexLine extends LineBase {
  pos: number // 1..6
  yang: boolean
  moving: boolean
  value: LineValue
  lucThu: string
  the: boolean
  ung: boolean
  loc: boolean
  ma: boolean
  quy: boolean
  dao: boolean
  quaiThan: boolean
  phuc?: { lucThan: LucThan; can: string; chi: string; hanh: Hanh }
  bien?: LineBase & { hoa: string[] }
  notes: string[]
}
export interface ChangedLine extends LineBase { pos: number; yang: boolean; moving: boolean; the: boolean; ung: boolean; loc: boolean; ma: boolean; quy: boolean; dao: boolean }

export interface HexInfo {
  num: number
  name: string
  meaning: string
  tone: number
  upper: Tri
  lower: Tri
  cung: Tri
  kind: string
  xungHop: 'Lục xung' | 'Lục hợp' | ''
}

export const TOPIC_OPTIONS = [
  { id: 'auto', label: 'Tự nhận diện theo câu hỏi' },
  { id: 'cong-danh', label: 'Công việc, công danh', dung: 'Quan Quỷ' },
  { id: 'thi-cu', label: 'Thi cử, học hành', dung: 'Phụ Mẫu' },
  { id: 'tai-loc', label: 'Tiền tài, kinh doanh', dung: 'Thê Tài' },
  { id: 'mua-ban-nha', label: 'Mua bán nhà đất, xe (lợi giao dịch)', dung: 'Thê Tài' },
  { id: 'nha-o', label: 'Nhà ở, xe cộ, giấy tờ', dung: 'Phụ Mẫu' },
  { id: 'tinh-duyen', label: 'Tình duyên, hôn nhân', dung: 'Thê Tài' },
  { id: 'con-cai', label: 'Con cái', dung: 'Tử Tôn' },
  { id: 'cha-me', label: 'Cha mẹ, bề trên', dung: 'Phụ Mẫu' },
  { id: 'ban-be', label: 'Anh em, bạn bè, đối tác', dung: 'Huynh Đệ' },
  { id: 'tim-do', label: 'Tìm đồ thất lạc', dung: 'Thê Tài' },
  { id: 'suc-khoe', label: 'Sức khỏe bản thân', dung: 'Thế' },
  { id: 'xuat-hanh', label: 'Đi xa, xuất hành', dung: 'Thế' },
  { id: 'kien-tung', label: 'Kiện tụng, tranh chấp', dung: 'Thế' },
  { id: 'khac', label: 'Việc khác (xem Thế hào)', dung: 'Thế' },
] as const
export type TopicId = (typeof TOPIC_OPTIONS)[number]['id']

export type Method = 'auto' | 'manual' | 'time'
export const METHOD_LABEL: Record<Method, string> = { auto: 'Gieo tự động', manual: 'Nhập kết quả gieo xu', time: 'Theo thời gian (Mai Hoa)' }

export interface Reading {
  question: string
  time: Date
  method: Method
  lines: HexLine[]
  changedLines: ChangedLine[] | null
  main: HexInfo
  changed: HexInfo | null
  cung: { tri: Tri; hanh: Hanh; kind: string }
  topic: { label: string; dung: LucThan | 'Thế' }
  dungThan: { pos: number; chi: string; lucThan: string; phuc?: boolean } | null
  ngayThang: { hourGZ: string; dayGZ: string; monthGZ: string; yearGZ: string; dayChi: string; monthChi: string; jieqi: string; lunar: string; tuanKhong: string[] }
  vuongSuy: { thang: string; ngay: string; score: number }
  verdict: { level: 'Cát' | 'Thiên cát' | 'Thận trọng' | 'Hung'; text: string; consensus: number }
  paragraphs: string[]
  ungKy: string
}

// ---------- lập quẻ ----------
function hashStr(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}
function mulberry(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Gieo 6 hào: mỗi hào là tổng 3 đồng xu (2 hoặc 3 điểm). */
export function castLines(question: string, time: Date, extra = Math.random()): LineValue[] {
  const rnd = mulberry(hashStr(question.trim()) ^ time.getTime() ^ Math.floor(extra * 2 ** 31))
  const toss = () => (rnd() < 0.5 ? 2 : 3)
  return Array.from({ length: 6 }, () => (toss() + toss() + toss()) as LineValue)
}

/** Số mặt sấp (lưng) của 3 đồng xu → hào: 1 dương, 2 âm, 3 dương động, 0 âm động. */
export const coinBacksToLine = (backs: number): LineValue => (backs === 1 ? 7 : backs === 2 ? 8 : backs === 3 ? 9 : 6)

const TIEN_THIEN: Tri[] = ['Khôn', 'Càn', 'Đoài', 'Ly', 'Chấn', 'Tốn', 'Khảm', 'Cấn'] // index = số % 8 (0 → Khôn = 8)

/** Mai Hoa theo thời gian: thượng = (năm + tháng + ngày) % 8, hạ = (+ giờ) % 8, động = (+ giờ) % 6. */
export function timeLines(time: Date): { values: LineValue[]; detail: string } {
  const l = Solar.fromYmdHms(time.getFullYear(), time.getMonth() + 1, time.getDate(), time.getHours(), time.getMinutes(), 0).getLunar()
  const yearN = DIA_CHI.indexOf(chiHanToVi(l.getYearInGanZhi()[1]) as never) + 1
  const hourN = DIA_CHI.indexOf(chiHanToVi(l.getTimeInGanZhi()[1]) as never) + 1
  const m = Math.abs(l.getMonth()), d = l.getDay()
  const top = yearN + m + d, bot = top + hourN
  const upper = TIEN_THIEN[top % 8], lower = TIEN_THIEN[bot % 8]
  const dong = bot % 6 || 6
  const bits = [...LINES[lower], ...LINES[upper]]
  const values = bits.map((b, i) => (i + 1 === dong ? (b ? 9 : 6) : b ? 7 : 8)) as LineValue[]
  return { values, detail: `Năm ${yearN} + tháng ${m} + ngày ${d} = ${top} → thượng quái ${upper}; cộng giờ ${hourN} = ${bot} → hạ quái ${lower}, hào động ${dong}.` }
}

// ---------- phân tích ----------
function detectPalace(yang: boolean[]) {
  for (const tri of TRI_LIST) {
    const pure = [...LINES[tri], ...LINES[tri]]
    for (let k = 0; k < FLIP_SETS.length; k++) {
      const t = pure.map((v, i) => (FLIP_SETS[k].includes(i) ? 1 - v : v))
      if (t.every((v, i) => (v === 1) === yang[i])) return { tri, hanh: TRI_HANH[tri], kind: CUNG_NAME[k], thePos: THE_POS[k] }
    }
  }
  throw new Error('không xác định được cung quẻ')
}

function hexInfo(yang: boolean[]): HexInfo {
  const lower = triOf(yang.slice(0, 3)), upper = triOf(yang.slice(3, 6))
  const [num, name, meaning, tone] = lookupHexagram(upper, lower)
  const pal = detectPalace(yang)
  return { num, name, meaning, tone, upper, lower, cung: pal.tri, kind: pal.kind, xungHop: LUC_XUNG.has(num) ? 'Lục xung' : LUC_HOP.has(num) ? 'Lục hợp' : '' }
}

const strip = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').toLowerCase()
const W = (words: string) => new RegExp(`(?<![a-z])(${words})(?![a-z])`)
const AUTO_TOPICS: { id: TopicId; re: RegExp }[] = [
  { id: 'tinh-duyen', re: W('yeu|nguoi yeu|vo|chong|hon nhan|cuoi|tinh cam|ket hon|chia tay|duyen|ly hon') },
  { id: 'mua-ban-nha', re: W('ban nha|mua nha|ban dat|mua dat|ban xe|mua xe|chuyen nhuong') },
  { id: 'cong-danh', re: W('cong viec|cong ty|su nghiep|chuc|thang chuc|xin viec|do|kien|cap tren|viec lam|nhay viec|nghi viec') },
  { id: 'thi-cu', re: W('thi|hoc|truong|bang cap') },
  { id: 'tai-loc', re: W('tien|tai chinh|luong|kinh doanh|dau tu|buon|ban hang|lai|loi nhuan|thu nhap|vay|no|co phieu|chung khoan|lam an') },
  { id: 'nha-o', re: W('nha|dat|giay to|hop dong|so do') },
  { id: 'con-cai', re: W('con|chau') },
  { id: 'cha-me', re: W('cha me|bo|me|ong ba') },
  { id: 'suc-khoe', re: W('benh|suc khoe|om|thuoc|phau thuat') },
  { id: 'tim-do', re: W('mat|that lac|tim do|danh roi') },
  { id: 'xuat-hanh', re: W('di xa|xuat hanh|du lich|chuyen di|di cong tac') },
  { id: 'ban-be', re: W('anh|em|ban be|ban|dong nghiep|hun von|gop von|doi tac') },
]

function pickTopic(q: string, topicId: TopicId, gender?: 'Nam' | 'Nữ'): { label: string; dung: LucThan | 'Thế' } {
  const id = topicId === 'auto' ? (AUTO_TOPICS.find((t) => t.re.test(strip(q)))?.id ?? 'khac') : topicId
  const opt = TOPIC_OPTIONS.find((o) => o.id === id)!
  const dung = 'dung' in opt ? opt.dung : 'Thế'
  if (id === 'tinh-duyen' && gender === 'Nữ') return { label: `${opt.label} (nữ xem Quan Quỷ)`, dung: 'Quan Quỷ' }
  return { label: opt.label, dung: dung as LucThan | 'Thế' }
}

export function interpret(question: string, values: LineValue[], time: Date, gender?: 'Nam' | 'Nữ', topicId: TopicId = 'auto', method: Method = 'auto'): Reading {
  const yang = values.map((v) => v === 7 || v === 9)
  const moving = values.map((v) => v === 6 || v === 9)
  const main = hexInfo(yang)
  const changedYang = yang.map((y, i) => (moving[i] ? !y : y))
  const changed = moving.some(Boolean) ? hexInfo(changedYang) : null
  const pal = detectPalace(yang)
  const palace = { tri: pal.tri, hanh: pal.hanh, kind: pal.kind }

  const lunar = Solar.fromYmdHms(time.getFullYear(), time.getMonth() + 1, time.getDate(), time.getHours(), time.getMinutes(), 0).getLunar()
  const gz = (s: string) => `${canHanToVi(s[0])} ${chiHanToVi(s[1])}`
  const dayGZ = gz(lunar.getDayInGanZhi()), monthGZ = gz(lunar.getMonthInGanZhi()), yearGZ = gz(lunar.getYearInGanZhi()), hourGZ = gz(lunar.getTimeInGanZhi())
  const [dayStem, dayChi] = dayGZ.split(' ')
  const monthChi = monthGZ.split(' ')[1]
  const mHanh = CHI_HANH[monthChi], dHanh = CHI_HANH[dayChi]
  // Tuần không theo ngày
  const dIdx = ((6 * '甲乙丙丁戊己庚辛壬癸'.indexOf(lunar.getDayInGanZhi()[0]) - 5 * '子丑寅卯辰巳午未申酉戌亥'.indexOf(lunar.getDayInGanZhi()[1])) % 60 + 60) % 60
  const head = dIdx - (dIdx % 10)
  const tuanKhong = [DIA_CHI[(head + 10) % 12], DIA_CHI[(head + 11) % 12]] as string[]
  const grp = TAM_HOP_GROUP(dayChi)

  const base = (can: string, chi: string): LineBase => {
    const hanh = CHI_HANH[chi]
    return { can, chi, hanh, lucThan: lucThanOf(palace.hanh, hanh), tuanKhong: tuanKhong.includes(chi), vuongSuy: vuongSuy(hanh, mHanh) }
  }
  const marks = (chi: string) => ({ loc: LOC[dayStem] === chi, ma: DICH_MA[grp] === chi, quy: QUY_NHAN[dayStem]?.includes(chi) ?? false, dao: DAO_HOA[grp] === chi })

  // Quái thân: Thế dương khởi Tý, Thế âm khởi Ngọ ở hào 1, đếm đến hào Thế
  const theYang = yang[pal.thePos - 1]
  const quaiThan = DIA_CHI[((theYang ? 0 : 6) + pal.thePos - 1) % 12]
  const start = LUC_THU_START[dayStem] ?? 0
  const ungPos = ((pal.thePos + 2) % 6) + 1

  const lines: HexLine[] = values.map((v, i) => {
    const { can, chi } = napOf(main.lower, main.upper, i)
    const b = base(can, chi)
    return { ...b, ...marks(chi), pos: i + 1, yang: yang[i], moving: moving[i], value: v, lucThu: LUC_THU[(start + i) % 6], the: i + 1 === pal.thePos, ung: i + 1 === ungPos, quaiThan: chi === quaiThan, notes: [] }
  })

  // Phục thần: lục thân vắng mặt lấy từ quẻ bát thuần của cung
  const present = new Set(lines.map((l) => l.lucThan))
  ;(['Phụ Mẫu', 'Huynh Đệ', 'Tử Tôn', 'Thê Tài', 'Quan Quỷ'] as LucThan[]).forEach((lt) => {
    if (present.has(lt)) return
    for (let i = 0; i < 6; i++) {
      const { can, chi } = napOf(palace.tri, palace.tri, i)
      if (lucThanOf(palace.hanh, CHI_HANH[chi]) === lt) { lines[i].phuc = { lucThan: lt, can, chi, hanh: CHI_HANH[chi] }; break }
    }
  })

  // Biến hào + quẻ biến đầy đủ (lục thân tính theo cung quẻ chủ)
  let changedLines: ChangedLine[] | null = null
  if (changed) {
    const cPal = detectPalace(changedYang)
    const cUng = ((cPal.thePos + 2) % 6) + 1
    changedLines = changedYang.map((y, i) => {
      const { can, chi } = napOf(changed.lower, changed.upper, i)
      return { ...base(can, chi), ...marks(chi), pos: i + 1, yang: y, moving: moving[i], the: i + 1 === cPal.thePos, ung: i + 1 === cUng }
    })
    lines.forEach((l, i) => {
      if (!l.moving) return
      const c = changedLines![i]
      const hoa: string[] = []
      if (hanhSinh(c.hanh, l.hanh)) hoa.push('hồi đầu sinh')
      if (hanhKhac(c.hanh, l.hanh)) hoa.push('hồi đầu khắc')
      if (TIEN_THAN[l.chi] === c.chi) hoa.push('hóa tiến thần')
      if (THOAI_THAN[l.chi] === c.chi) hoa.push('hóa thoái thần')
      if (c.tuanKhong) hoa.push('hóa không')
      if (CLASH[c.chi] === monthChi) hoa.push('hóa phá')
      l.bien = { can: c.can, chi: c.chi, hanh: c.hanh, lucThan: c.lucThan, tuanKhong: c.tuanKhong, vuongSuy: c.vuongSuy, hoa }
    })
  }

  // Trạng thái từng hào
  for (const l of lines) {
    if (CLASH[l.chi] === monthChi) l.notes.push('Nguyệt phá')
    if (l.chi === dayChi) l.notes.push('Lâm nhật')
    else if (CLASH[l.chi] === dayChi && !l.moving) l.notes.push(VS_SCORE[l.vuongSuy] >= 1 ? 'Ám động' : 'Nhật phá')
    if (l.tuanKhong) l.notes.push('Tuần không')
  }

  // ---------- Dụng thần ----------
  const topic = pickTopic(question, topicId, gender)
  let dung: HexLine | undefined
  let dungPhuc = false
  if (topic.dung === 'Thế') dung = lines.find((l) => l.the)
  else {
    const cands = lines.filter((l) => l.lucThan === topic.dung)
    if (cands.length) dung = cands.find((l) => l.moving) ?? cands.slice().sort((a, b) => VS_SCORE[b.vuongSuy] - VS_SCORE[a.vuongSuy])[0]
    else { dung = lines.find((l) => l.phuc?.lucThan === topic.dung); dungPhuc = !!dung }
  }

  let score = 0
  const paragraphs: string[] = []
  let thang = '', ngay = ''
  if (dung) {
    const chi = dungPhuc ? dung.phuc!.chi : dung.chi
    const hanh = CHI_HANH[chi]
    const vs = vuongSuy(hanh, mHanh)
    thang = `${vs} theo Nguyệt lệnh ${monthChi}`
    score += VS_SCORE[vs]
    if (chi === dayChi) { ngay = `lâm Nhật thần ${dayChi}, được trợ lực mạnh`; score += 2 }
    else if (CLASH[chi] === dayChi) { ngay = VS_SCORE[vs] >= 1 ? `bị Nhật thần ${dayChi} xung nhưng vượng nên thành ám động` : `bị Nhật thần ${dayChi} xung phá`; score += VS_SCORE[vs] >= 1 ? 0.5 : -1.5 }
    else if (hanhSinh(dHanh, hanh)) { ngay = `được Nhật thần ${dayChi} sinh`; score += 1 }
    else if (hanhKhac(dHanh, hanh)) { ngay = `bị Nhật thần ${dayChi} khắc`; score -= 1 }
    else ngay = `Nhật thần ${dayChi} không ảnh hưởng nhiều`
    if (CLASH[chi] === monthChi) { score -= 2; paragraphs.push(`Dụng thần ${chi} bị Nguyệt phá (xung Nguyệt lệnh ${monthChi}): gốc rễ yếu, việc khó bền.`) }
    if (tuanKhong.includes(chi)) { score -= dung.moving ? 0 : 1; paragraphs.push(`Dụng thần gặp Tuần không (${tuanKhong.join(', ')}): việc chưa thực, ${dung.moving ? 'nhưng đang động nên ra khỏi tuần sẽ ứng' : 'đợi xuất không (qua tuần) mới rõ'}.`) }
    if (dungPhuc) { score -= 1; paragraphs.push(`${topic.dung} không hiện trong quẻ, phục dưới hào ${dung.pos} (${dung.lucThan} ${dung.chi}): việc còn ẩn, cần thời gian hoặc người khác dẫn ra.`) }
    if (!dungPhuc && dung.moving && dung.bien) {
      dung.bien.hoa.forEach((h) => {
        const d = { 'hồi đầu sinh': 1.5, 'hồi đầu khắc': -2, 'hóa tiến thần': 1, 'hóa thoái thần': -1, 'hóa không': -1, 'hóa phá': -1 }[h] ?? 0
        score += d
      })
      if (dung.bien.hoa.length) paragraphs.push(`Dụng thần động hóa ${dung.bien.chi} (${dung.bien.lucThan}): ${dung.bien.hoa.join(', ')}.`)
      score += 0.5
    }
    for (const l of lines) {
      if (!l.moving || l.pos === dung.pos) continue
      if (hanhSinh(l.hanh, hanh)) { score += 1; paragraphs.push(`Hào ${l.pos} động (${l.lucThan} ${l.chi} ${l.hanh}) sinh Dụng thần: có trợ lực (nguyên thần).`) }
      else if (hanhKhac(l.hanh, hanh)) { score -= 1; paragraphs.push(`Hào ${l.pos} động (${l.lucThan} ${l.chi} ${l.hanh}) khắc Dụng thần: có trở lực (kỵ thần).`) }
    }
  } else {
    thang = 'Dụng thần không hiện trong quẻ'
    score -= 1
  }

  const theLine = lines.find((l) => l.the)!
  paragraphs.unshift(
    `Quẻ chủ ${main.name} (số ${main.num}, họ ${main.cung} – ${main.kind}${main.xungHop ? `, ${main.xungHop}` : ''}): ${main.meaning}.`,
    changed ? `Quẻ biến ${changed.name} (họ ${changed.cung} – ${changed.kind}${changed.xungHop ? `, ${changed.xungHop}` : ''}): ${changed.meaning}.` : 'Quẻ tĩnh, không có hào động: tình huống ổn định, ít biến chuyển trong thời gian ngắn.',
    `Thế ở hào ${theLine.pos} (${theLine.can} ${theLine.chi}, ${theLine.vuongSuy}), Ứng ở hào ${ungPos}. Tuần không: ${tuanKhong.join(', ')}.`,
  )
  if (main.xungHop === 'Lục xung') paragraphs.push(changed?.xungHop === 'Lục hợp' ? 'Lục xung biến Lục hợp: trước tan sau hợp, ban đầu trắc trở về sau thuận dần.' : 'Quẻ Lục xung: sự việc nhanh, dễ tan; việc muốn bền khó giữ, việc muốn dứt lại thuận.')
  if (main.xungHop === 'Lục hợp') paragraphs.push(changed?.xungHop === 'Lục xung' ? 'Lục hợp biến Lục xung: trước hợp sau tan, cần giữ cam kết rõ ràng.' : 'Quẻ Lục hợp: chủ hòa hợp, gắn kết, việc dễ thành nhưng có thể chậm.')
  if (dung) paragraphs.push(`Việc cần xem "${topic.label}" lấy ${topic.dung === 'Thế' ? 'Thế hào' : topic.dung} làm Dụng thần: hào ${dung.pos} (${dungPhuc ? `phục ${dung.phuc!.chi}` : `${dung.can} ${dung.chi} ${dung.hanh}`}) – ${thang}; ${ngay}.`)
  else paragraphs.push(`Việc cần xem "${topic.label}" cần ${topic.dung} nhưng quẻ không hiện hào này: việc còn ẩn, nên chờ thêm.`)

  const consensus = Math.max(0, Math.min(1, Math.round(((score + 4) / 8) * 10) / 10))
  const total = score + main.tone + (changed ? changed.tone * 0.5 : 0)
  const level = total >= 3 ? 'Cát' : total >= 1 ? 'Thiên cát' : total >= -1 ? 'Thận trọng' : 'Hung'
  const advice = {
    Cát: 'Các dấu hiệu đồng thuận ở mức thuận. Có thể tiến hành, vẫn nên kiểm tra các chi tiết rủi ro.',
    'Thiên cát': 'Thiên về thuận nhưng chưa trọn vẹn. Làm từng bước, chuẩn bị phương án dự phòng.',
    'Thận trọng': 'Các dấu hiệu còn giằng co. Thử ở quy mô nhỏ, không dồn toàn lực một lần.',
    Hung: 'Thế quẻ nhiều trở ngại. Hoãn hoặc đổi cách làm, tránh quyết định lớn vội vàng.',
  }[level]
  paragraphs.push(advice, 'Quẻ chỉ là một góc nhìn tham khảo; quyết định cuối cùng vẫn dựa vào thông tin thực tế và cân nhắc của bạn.')

  const dChi = dung ? (dungPhuc ? dung.phuc!.chi : dung.chi) : ''
  const ungKy = !dung ? 'Chưa xác định được ứng kỳ vì Dụng thần không hiện.'
    : tuanKhong.includes(dChi) ? `Dụng thần gặp Tuần không: thường ứng khi ra khỏi tuần, hoặc vào ngày/tháng ${dChi} (điền thực) hay ${CLASH[dChi]} (xung không).`
    : `Dụng thần ở chi ${dChi}: dễ ứng vào ngày/tháng ${dChi}, hoặc lúc gặp chi hợp; tránh thời điểm ${CLASH[dChi]} xung nếu quẻ xấu.`

  const jq = lunar.getPrevJieQi(true).getName() as string
  return {
    question, time, method, lines, changedLines, main, changed, cung: palace, topic,
    dungThan: dung ? { pos: dung.pos, chi: dChi, lucThan: dungPhuc ? dung.phuc!.lucThan : dung.lucThan, phuc: dungPhuc } : null,
    ngayThang: { hourGZ, dayGZ, monthGZ, yearGZ, dayChi, monthChi, jieqi: JIEQI_VI[jq] ?? jq, lunar: `${lunar.getDay()}/${Math.abs(lunar.getMonth())}${lunar.getMonth() < 0 ? ' nhuận' : ''}`, tuanKhong },
    vuongSuy: { thang, ngay, score },
    verdict: { level, text: advice, consensus },
    paragraphs, ungKy,
  }
}

const JIEQI_VI: Record<string, string> = {
  立春: 'Lập Xuân', 雨水: 'Vũ Thủy', 惊蛰: 'Kinh Trập', 春分: 'Xuân Phân', 清明: 'Thanh Minh', 谷雨: 'Cốc Vũ',
  立夏: 'Lập Hạ', 小满: 'Tiểu Mãn', 芒种: 'Mang Chủng', 夏至: 'Hạ Chí', 小暑: 'Tiểu Thử', 大暑: 'Đại Thử',
  立秋: 'Lập Thu', 处暑: 'Xử Thử', 白露: 'Bạch Lộ', 秋分: 'Thu Phân', 寒露: 'Hàn Lộ', 霜降: 'Sương Giáng',
  立冬: 'Lập Đông', 小雪: 'Tiểu Tuyết', 大雪: 'Đại Tuyết', 冬至: 'Đông Chí', 小寒: 'Tiểu Hàn', 大寒: 'Đại Hàn',
}
