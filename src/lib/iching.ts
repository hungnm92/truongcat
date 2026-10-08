import { lookupHexagram, type Tri } from '../data/hexagrams'
import { dayInfo } from './calendar'
import { CHI_HANH, DIA_CHI, hanhKhac, hanhSinh, type Hanh } from './vn'

// Hào tính từ dưới lên. Giá trị 6 (lão âm, động), 7 (thiếu dương), 8 (thiếu âm), 9 (lão dương, động).
export type LineValue = 6 | 7 | 8 | 9

const LINES: Record<Tri, [number, number, number]> = {
  Càn: [1, 1, 1], Đoài: [1, 1, 0], Ly: [1, 0, 1], Chấn: [1, 0, 0],
  Tốn: [0, 1, 1], Khảm: [0, 1, 0], Cấn: [0, 0, 1], Khôn: [0, 0, 0],
}
const TRI_LIST = Object.keys(LINES) as Tri[]
const triOf = (l: (number | boolean)[]): Tri => TRI_LIST.find((t) => LINES[t].every((v, i) => v === Number(l[i])))!

const TRI_HANH: Record<Tri, Hanh> = { Càn: 'Kim', Đoài: 'Kim', Ly: 'Hỏa', Chấn: 'Mộc', Tốn: 'Mộc', Khảm: 'Thủy', Cấn: 'Thổ', Khôn: 'Thổ' }
// Nạp chi: [nội (hào 1-3), ngoại (hào 4-6)]
const NAP_CHI: Record<Tri, [string[], string[]]> = {
  Càn: [['Tý', 'Dần', 'Thìn'], ['Ngọ', 'Thân', 'Tuất']],
  Khôn: [['Mùi', 'Tỵ', 'Mão'], ['Sửu', 'Hợi', 'Dậu']],
  Chấn: [['Tý', 'Dần', 'Thìn'], ['Ngọ', 'Thân', 'Tuất']],
  Tốn: [['Sửu', 'Hợi', 'Dậu'], ['Mùi', 'Tỵ', 'Mão']],
  Khảm: [['Dần', 'Thìn', 'Ngọ'], ['Thân', 'Tuất', 'Tý']],
  Ly: [['Mão', 'Sửu', 'Hợi'], ['Dậu', 'Mùi', 'Tỵ']],
  Cấn: [['Thìn', 'Ngọ', 'Thân'], ['Tuất', 'Tý', 'Dần']],
  Đoài: [['Tỵ', 'Mão', 'Sửu'], ['Hợi', 'Dậu', 'Mùi']],
}

const FLIP_SETS = [[], [0], [0, 1], [0, 1, 2], [0, 1, 2, 3], [0, 1, 2, 3, 4], [0, 1, 2, 4], [3, 4]]
const THE_POS = [6, 1, 2, 3, 4, 5, 4, 3]
const CUNG_NAME = ['Bát Thuần', 'Nhất Thế', 'Nhị Thế', 'Tam Thế', 'Tứ Thế', 'Ngũ Thế', 'Du Hồn', 'Quy Hồn']

export type LucThan = 'Phụ Mẫu' | 'Huynh Đệ' | 'Tử Tôn' | 'Thê Tài' | 'Quan Quỷ'
const LUC_THAN_ORDER = ['Thanh Long', 'Chu Tước', 'Câu Trần', 'Đằng Xà', 'Bạch Hổ', 'Huyền Vũ']
const LUC_THAN_START: Record<string, number> = { Giáp: 0, Ất: 0, Bính: 1, Đinh: 1, Mậu: 2, Kỷ: 3, Canh: 4, Tân: 4, Nhâm: 5, Quý: 5 }

function lucThanOf(palaceHanh: Hanh, lineHanh: Hanh): LucThan {
  if (palaceHanh === lineHanh) return 'Huynh Đệ'
  if (hanhSinh(palaceHanh, lineHanh)) return 'Tử Tôn'
  if (hanhSinh(lineHanh, palaceHanh)) return 'Phụ Mẫu'
  if (hanhKhac(palaceHanh, lineHanh)) return 'Thê Tài'
  return 'Quan Quỷ'
}

export interface HexLine {
  pos: number // 1..6
  yang: boolean
  moving: boolean
  value: LineValue
  chi: string
  hanh: Hanh
  lucThan: LucThan
  lucThu: string
  the: boolean
  ung: boolean
}

export interface HexInfo {
  num: number
  name: string
  meaning: string
  tone: number
  upper: Tri
  lower: Tri
}

export interface Reading {
  question: string
  time: Date
  lines: HexLine[]
  main: HexInfo
  changed: HexInfo | null
  cung: { tri: Tri; hanh: Hanh; kind: string }
  topic: { label: string; dung: LucThan | 'Thế' }
  dungThan: { pos: number; chi: string; lucThan: string } | null
  ngayThang: { dayChi: string; dayGZ: string; monthChi: string; monthGZ: string }
  vuongSuy: { thang: string; ngay: string; score: number }
  verdict: { level: 'Cát' | 'Thiên cát' | 'Thận trọng' | 'Hung'; text: string; consensus: number }
  paragraphs: string[]
  ungKy: string
}

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

/** Gieo 6 hào: mỗi hào là tổng 3 đồng xu (2 hoặc 3 điểm). Nhận seed để kiểm thử. */
export function castLines(question: string, time: Date, extra = Math.random()): LineValue[] {
  const rnd = mulberry(hashStr(question.trim()) ^ time.getTime() ^ Math.floor(extra * 2 ** 31))
  const toss = () => (rnd() < 0.5 ? 2 : 3)
  return Array.from({ length: 6 }, () => (toss() + toss() + toss()) as LineValue)
}

const strip = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase()
// Mẫu viết không dấu, khớp theo ranh giới từ.
const W = (words: string) => new RegExp(`(?<![a-z])(${words})(?![a-z])`)

const TOPICS: { label: string; dung: LucThan; re: RegExp }[] = [
  { label: 'Tình cảm, hôn nhân', dung: 'Thê Tài', re: W('yeu|nguoi yeu|vo|chong|hon nhan|cuoi|tinh cam|ket hon|chia tay|duyen|ly hon') },
  { label: 'Công việc, sự nghiệp, thi cử', dung: 'Quan Quỷ', re: W('cong viec|cong ty|su nghiep|chuc|thang chuc|xin viec|thi|do|kien|cap tren|viec lam|nhay viec|nghi viec') },
  { label: 'Tiền tài, kinh doanh', dung: 'Thê Tài', re: W('tien|tai chinh|luong|kinh doanh|dau tu|buon|ban hang|lai|loi nhuan|thu nhap|vay|no|co phieu|chung khoan|lam an') },
  { label: 'Học hành, nhà cửa, giấy tờ', dung: 'Phụ Mẫu', re: W('hoc|truong|nha|dat|xe|giay to|hop dong|so do|bang cap|cha me|bo|me|mua nha') },
  { label: 'Con cái, giải tỏa lo âu', dung: 'Tử Tôn', re: W('con|chau|thu cung|khoi benh|het benh|thuoc|giai quyet|vui choi') },
  { label: 'Anh em, bạn bè, đối tác', dung: 'Huynh Đệ', re: W('anh|em|ban be|ban|dong nghiep|hung von|gop von|doi tac') },
]

function pickTopic(q: string, gender?: 'Nam' | 'Nữ'): { label: string; dung: LucThan | 'Thế' } {
  const text = strip(q)
  const hit = TOPICS.find((t) => t.re.test(text))
  if (!hit) return { label: 'Việc chung (xem Thế hào)', dung: 'Thế' }
  if (hit.label.startsWith('Tình cảm') && gender === 'Nữ') return { label: hit.label + ' (nữ xem Quan Quỷ)', dung: 'Quan Quỷ' }
  return hit
}

const CLASH: Record<string, string> = { Tý: 'Ngọ', Ngọ: 'Tý', Sửu: 'Mùi', Mùi: 'Sửu', Dần: 'Thân', Thân: 'Dần', Mão: 'Dậu', Dậu: 'Mão', Thìn: 'Tuất', Tuất: 'Thìn', Tỵ: 'Hợi', Hợi: 'Tỵ' }

function seasonStrength(lineHanh: Hanh, ref: Hanh): { name: string; score: number } {
  if (lineHanh === ref) return { name: 'Vượng', score: 2 }
  if (hanhSinh(ref, lineHanh)) return { name: 'Tướng', score: 1 }
  if (hanhSinh(lineHanh, ref)) return { name: 'Hưu', score: 0 }
  if (hanhKhac(lineHanh, ref)) return { name: 'Tù', score: -1 }
  return { name: 'Tử', score: -2 }
}

function hexInfo(lines: boolean[]): HexInfo {
  const lower = triOf(lines.slice(0, 3)), upper = triOf(lines.slice(3, 6))
  const [num, name, meaning, tone] = lookupHexagram(upper, lower)
  return { num, name, meaning, tone, upper, lower }
}

export function interpret(question: string, values: LineValue[], time: Date, gender?: 'Nam' | 'Nữ'): Reading {
  const yang = values.map((v) => v === 7 || v === 9)
  const moving = values.map((v) => v === 6 || v === 9)
  const main = hexInfo(yang)
  const changedLines = yang.map((y, i) => (moving[i] ? !y : y))
  const changed = moving.some(Boolean) ? hexInfo(changedLines) : null

  // Cung và Thế/Ứng
  let cung: { tri: Tri; hanh: Hanh; kind: string } | null = null
  let thePos = 6
  for (const tri of TRI_LIST) {
    const pure = [...LINES[tri], ...LINES[tri]]
    for (let k = 0; k < FLIP_SETS.length; k++) {
      const t = pure.map((v, i) => (FLIP_SETS[k].includes(i) ? 1 - v : v))
      if (t.every((v, i) => (v === 1) === yang[i])) {
        cung = { tri, hanh: TRI_HANH[tri], kind: CUNG_NAME[k] }
        thePos = THE_POS[k]
      }
    }
  }
  const palace = cung!
  const day = dayInfo(time.getFullYear(), time.getMonth() + 1, time.getDate())
  const [dayStem, dayChi] = day.lunar.dayGZ.split(' ')
  const monthChi = day.lunar.monthGZ.split(' ')[1]
  const lowerTri = main.lower, upperTri = main.upper
  const start = LUC_THAN_START[dayStem] ?? 0

  const lines: HexLine[] = values.map((v, i) => {
    const chi = i < 3 ? NAP_CHI[lowerTri][0][i] : NAP_CHI[upperTri][1][i - 3]
    const hanh = CHI_HANH[chi]
    return {
      pos: i + 1, yang: yang[i], moving: moving[i], value: v, chi, hanh,
      lucThan: lucThanOf(palace.hanh, hanh),
      lucThu: LUC_THAN_ORDER[(start + i) % 6],
      the: i + 1 === thePos,
      ung: i + 1 === ((thePos + 2) % 6) + 1,
    }
  })

  const topic = pickTopic(question, gender)
  let dung: HexLine | undefined
  if (topic.dung === 'Thế') dung = lines.find((l) => l.the)
  else {
    const cands = lines.filter((l) => l.lucThan === topic.dung)
    dung = cands.find((l) => l.moving) ?? cands.find((l) => l.the) ?? cands[cands.length > 1 ? 1 : 0]
    // nhiều hào cùng lục thân: chọn hào có điểm vượng suy cao nhất
    if (cands.length > 1) {
      const mH = CHI_HANH[monthChi]
      dung = cands.slice().sort((a, b) => seasonStrength(b.hanh, mH).score - seasonStrength(a.hanh, mH).score)[0]
    }
  }

  const mHanh = CHI_HANH[monthChi], dHanh = CHI_HANH[dayChi]
  let score = 0
  const paragraphs: string[] = []
  let thang = '', ngay = ''
  if (dung) {
    const ms = seasonStrength(dung.hanh, mHanh)
    thang = `${ms.name} theo Nguyệt kiến ${monthChi}`
    score += ms.score
    if (dung.chi === dayChi) { ngay = `lâm Nhật thần ${dayChi}, được trợ lực mạnh`; score += 2 }
    else if (CLASH[dung.chi] === dayChi) { ngay = `bị Nhật thần ${dayChi} xung, ${ms.score < 1 ? 'dễ bị phá' : 'động nhưng chưa phá'}`; score += ms.score < 1 ? -2 : -0.5 }
    else if (hanhSinh(dHanh, dung.hanh)) { ngay = `được Nhật thần ${dayChi} sinh`; score += 1 }
    else if (hanhKhac(dHanh, dung.hanh)) { ngay = `bị Nhật thần ${dayChi} khắc`; score -= 1 }
    else ngay = `Nhật thần ${dayChi} không ảnh hưởng nhiều`
    if (dung.moving) score += 0.5
    // hào động khác sinh/khắc dụng thần
    for (const l of lines) {
      if (!l.moving || l.pos === dung.pos) continue
      if (hanhSinh(l.hanh, dung.hanh)) { score += 1; paragraphs.push(`Hào ${l.pos} động (${l.chi} ${l.hanh}) sinh Dụng thần: có sự giúp đỡ từ ${l.lucThan}.`) }
      else if (hanhKhac(l.hanh, dung.hanh)) { score -= 1; paragraphs.push(`Hào ${l.pos} động (${l.chi} ${l.hanh}) khắc Dụng thần: có trở lực từ ${l.lucThan}.`) }
    }
  } else {
    thang = 'Dụng thần không hiện trong quẻ'
    score -= 1
  }

  const theLine = lines.find((l) => l.the)!
  const theStrength = seasonStrength(theLine.hanh, mHanh)
  paragraphs.unshift(
    `Quẻ chủ ${main.name} (số ${main.num}): ${main.meaning}.`,
    changed ? `Quẻ biến ${changed.name}: ${changed.meaning}. Xu hướng sau khi các hào động chuyển hóa.` : 'Quẻ tĩnh, không có hào động: tình huống ổn định, ít biến chuyển trong thời gian ngắn.',
    `Quẻ thuộc cung ${palace.tri} (${palace.hanh}) – ${palace.kind}; Thế ở hào ${thePos} (${theLine.chi} ${theLine.hanh}), ${theStrength.name} theo tháng.`,
  )
  if (dung) paragraphs.push(`Chủ đề "${topic.label}" lấy ${topic.dung === 'Thế' ? 'Thế hào' : topic.dung} làm Dụng thần: hào ${dung.pos} (${dung.chi} ${dung.hanh}) – ${thang}; ${ngay}.`)
  else paragraphs.push(`Chủ đề "${topic.label}" cần ${topic.dung} nhưng quẻ không hiện hào này: việc còn ẩn, chưa đủ điều kiện, nên chờ thêm.`)
  const dayLine = lines.find((l) => l.chi === dayChi && l.moving)
  if (dayLine) paragraphs.push(`Nhật thần ${dayChi} trùng hào động ${dayLine.pos}: việc có dấu hiệu ứng trong thời gian gần.`)

  const consensus = Math.max(0, Math.min(1, Math.round(((score + 4) / 8) * 10) / 10))
  const toneBias = main.tone + (changed ? changed.tone * 0.5 : 0)
  const total = score + toneBias
  const level = total >= 3 ? 'Cát' : total >= 1 ? 'Thiên cát' : total >= -1 ? 'Thận trọng' : 'Hung'
  const advice = {
    Cát: 'Các dấu hiệu đồng thuận ở mức thuận. Có thể tiến hành, vẫn nên kiểm tra các chi tiết rủi ro.',
    'Thiên cát': 'Thiên về thuận nhưng chưa trọn vẹn. Làm từng bước, chuẩn bị phương án dự phòng.',
    'Thận trọng': 'Các dấu hiệu còn giằng co. Thử ở quy mô nhỏ, không dồn toàn lực một lần.',
    Hung: 'Thế quẻ nhiều trở ngại. Hoãn hoặc đổi cách làm, tránh quyết định lớn vội vàng.',
  }[level]
  paragraphs.push(advice, 'Quẻ chỉ là một góc nhìn tham khảo; quyết định cuối cùng vẫn dựa vào thông tin thực tế và cân nhắc của bạn.')

  const ungKy = dung
    ? `Dụng thần ở chi ${dung.chi}: việc dễ ứng vào tháng/ngày ${dung.chi} hoặc chi hợp với ${dung.chi} (${DIA_CHI[(DIA_CHI.indexOf(dung.chi as never) + 6) % 12]} xung, cần tránh lúc đó nếu quẻ xấu).`
    : 'Chưa xác định được ứng kỳ vì Dụng thần không hiện.'

  return {
    question, time, lines, main, changed, cung: palace, topic,
    dungThan: dung ? { pos: dung.pos, chi: dung.chi, lucThan: dung.lucThan } : null,
    ngayThang: { dayChi, dayGZ: day.lunar.dayGZ, monthChi, monthGZ: day.lunar.monthGZ },
    vuongSuy: { thang, ngay, score },
    verdict: { level, text: advice, consensus },
    paragraphs, ungKy,
  }
}
