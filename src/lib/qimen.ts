// Kỳ Môn Độn Giáp – thời gia, phép chuyển bàn, định cục theo sách bổ (phù đầu Giáp/Kỷ).
import { Solar } from 'lunar-javascript'
import { canHanToVi, chiHanToVi, hanhKhac, type Hanh } from './vn'

const JIEQI: Record<string, [boolean, [number, number, number], string]> = {
  冬至: [true, [1, 7, 4], 'Đông Chí'], 小寒: [true, [2, 8, 5], 'Tiểu Hàn'], 大寒: [true, [3, 9, 6], 'Đại Hàn'],
  立春: [true, [8, 5, 2], 'Lập Xuân'], 雨水: [true, [9, 6, 3], 'Vũ Thủy'], 惊蛰: [true, [1, 7, 4], 'Kinh Trập'],
  春分: [true, [3, 9, 6], 'Xuân Phân'], 清明: [true, [4, 1, 7], 'Thanh Minh'], 谷雨: [true, [5, 2, 8], 'Cốc Vũ'],
  立夏: [true, [4, 1, 7], 'Lập Hạ'], 小满: [true, [5, 2, 8], 'Tiểu Mãn'], 芒种: [true, [6, 3, 9], 'Mang Chủng'],
  夏至: [false, [9, 3, 6], 'Hạ Chí'], 小暑: [false, [8, 2, 5], 'Tiểu Thử'], 大暑: [false, [7, 1, 4], 'Đại Thử'],
  立秋: [false, [2, 5, 8], 'Lập Thu'], 处暑: [false, [1, 4, 7], 'Xử Thử'], 白露: [false, [9, 3, 6], 'Bạch Lộ'],
  秋分: [false, [7, 1, 4], 'Thu Phân'], 寒露: [false, [6, 9, 3], 'Hàn Lộ'], 霜降: [false, [5, 8, 2], 'Sương Giáng'],
  立冬: [false, [6, 9, 3], 'Lập Đông'], 小雪: [false, [5, 8, 2], 'Tiểu Tuyết'], 大雪: [false, [4, 7, 1], 'Đại Tuyết'],
}

export const PALACE_DIR: Record<number, string> = { 1: 'Bắc', 8: 'Đông Bắc', 3: 'Đông', 4: 'Đông Nam', 9: 'Nam', 2: 'Tây Nam', 7: 'Tây', 6: 'Tây Bắc', 5: 'Trung cung' }
export const PALACE_QUAI: Record<number, string> = { 1: 'Khảm', 8: 'Cấn', 3: 'Chấn', 4: 'Tốn', 9: 'Ly', 2: 'Khôn', 7: 'Đoài', 6: 'Càn', 5: 'Trung' }
const PALACE_HANH: Record<number, Hanh> = { 1: 'Thủy', 2: 'Thổ', 3: 'Mộc', 4: 'Mộc', 5: 'Thổ', 6: 'Kim', 7: 'Kim', 8: 'Thổ', 9: 'Hỏa' }
const RING = [1, 8, 3, 4, 9, 2, 7, 6]
const STAR: Record<number, string> = { 1: 'Thiên Bồng', 2: 'Thiên Nhuế', 3: 'Thiên Xung', 4: 'Thiên Phụ', 5: 'Thiên Cầm', 6: 'Thiên Tâm', 7: 'Thiên Trụ', 8: 'Thiên Nhậm', 9: 'Thiên Anh' }
const DOOR: Record<number, string> = { 1: 'Hưu', 8: 'Sinh', 3: 'Thương', 4: 'Đỗ', 9: 'Cảnh', 2: 'Tử', 7: 'Kinh', 6: 'Khai' }
const DOOR_HANH: Record<string, Hanh> = { Hưu: 'Thủy', Sinh: 'Thổ', Thương: 'Mộc', Đỗ: 'Mộc', Cảnh: 'Hỏa', Tử: 'Thổ', Kinh: 'Kim', Khai: 'Kim' }
const GODS = ['Trực Phù', 'Đằng Xà', 'Thái Âm', 'Lục Hợp', 'Bạch Hổ', 'Huyền Vũ', 'Cửu Địa', 'Cửu Thiên']
const NGHI = ['Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý', 'Đinh', 'Bính', 'Ất']
// Lục nghi ẩn Lục Giáp: đầu tuần (theo chi) -> nghi
const TUAN_THU: Record<number, string> = { 0: 'Mậu', 10: 'Kỷ', 8: 'Canh', 6: 'Tân', 4: 'Nhâm', 2: 'Quý' }

export const DOOR_TONE: Record<string, number> = { Khai: 2, Hưu: 2, Sinh: 2, Cảnh: 0.5, Đỗ: 0, Thương: -1.5, Kinh: -1.5, Tử: -2 }
export const STAR_TONE: Record<string, number> = { 'Thiên Phụ': 1, 'Thiên Tâm': 1, 'Thiên Nhậm': 1, 'Thiên Cầm': 1, 'Thiên Xung': 0.5, 'Thiên Anh': 0, 'Thiên Bồng': -1, 'Thiên Nhuế': -1, 'Thiên Trụ': -1 }
export const GOD_TONE: Record<string, number> = { 'Trực Phù': 1, 'Thái Âm': 1, 'Lục Hợp': 1, 'Cửu Địa': 0.5, 'Cửu Thiên': 0.5, 'Đằng Xà': -1, 'Bạch Hổ': -1, 'Huyền Vũ': -1 }

export const DOOR_NOTE: Record<string, string> = {
  Khai: 'mở mang, khởi sự, cầu công danh',
  Hưu: 'nghỉ ngơi, gặp quý nhân, hòa giải',
  Sinh: 'sinh tài, kinh doanh, nhà đất',
  Cảnh: 'văn thư, thi cử, quảng bá; dễ nóng',
  Đỗ: 'ẩn tàng, phòng thủ, giữ bí mật',
  Thương: 'va chạm, cạnh tranh, đòi nợ',
  Kinh: 'lo sợ, kiện cáo, tin đồn',
  Tử: 'bế tắc, tang sự; chỉ hợp việc kết thúc',
}

const ganZhiIndex = (can: number, chi: number) => (((6 * can - 5 * chi) % 60) + 60) % 60
const CAN_HAN = '甲乙丙丁戊己庚辛壬癸'
const CHI_HAN = '子丑寅卯辰巳午未申酉戌亥'

export interface QMCell { palace: number; dir: string; quai: string; earth: string; heaven: string; star: string; door: string; god: string; extra?: string }
export interface QMChart {
  time: Date
  duong: boolean
  jieqi: string
  nguyen: 'Thượng' | 'Trung' | 'Hạ'
  cuc: number
  hourGZ: string
  dayGZ: string
  tuanThu: string
  trucPhu: string
  trucSu: string
  cells: Record<number, QMCell>
  patterns: string[]
}

const ringIdx = (p: number) => RING.indexOf(p === 5 ? 2 : p)

export function qimenChart(time: Date): QMChart {
  const lunar = Solar.fromYmdHms(time.getFullYear(), time.getMonth() + 1, time.getDate(), time.getHours(), time.getMinutes(), 0).getLunar()
  const jq = lunar.getPrevJieQi(true).getName() as string
  const [duong, cucs, jqVi] = JIEQI[jq]
  const dayGZ = lunar.getDayInGanZhi() as string
  const hourGZ = lunar.getTimeInGanZhi() as string
  const dIdx = ganZhiIndex(CAN_HAN.indexOf(dayGZ[0]), CHI_HAN.indexOf(dayGZ[1]))
  const fuTouBranch = (dIdx - (dIdx % 5)) % 12
  const nguyenIdx = [0, 6, 3, 9].includes(fuTouBranch) ? 0 : [2, 8, 5, 11].includes(fuTouBranch) ? 1 : 2
  const cuc = cucs[nguyenIdx]

  // Địa bàn
  const earth: Record<number, string> = {}
  NGHI.forEach((n, i) => {
    const p = duong ? ((cuc - 1 + i) % 9) + 1 : ((((cuc - 1 - i) % 9) + 9) % 9) + 1
    earth[p] = n
  })
  const palaceOfStem = (s: string) => Number(Object.keys(earth).find((k) => earth[+k] === s))

  const hCan = CAN_HAN.indexOf(hourGZ[0]), hChi = CHI_HAN.indexOf(hourGZ[1])
  const hIdx = ganZhiIndex(hCan, hChi)
  const headBranch = (hIdx - (hIdx % 10)) % 12
  const tuanThu = TUAN_THU[headBranch]
  const p0 = palaceOfStem(tuanThu)
  const p0r = p0 === 5 ? 2 : p0
  const trucPhu = STAR[p0r]
  const trucSu = DOOR[p0r]
  const hourStem = canHanToVi(hourGZ[0])
  const target = palaceOfStem(hourStem === 'Giáp' ? tuanThu : hourStem)
  const off = (ringIdx(target) - ringIdx(p0r) + 8) % 8

  // Thiên bàn: sao và can xoay theo vòng
  const heaven: Record<number, { star: string; stem: string; extra?: string }> = {}
  RING.forEach((dst, i) => {
    const src = RING[(i - off + 8) % 8]
    heaven[dst] = { star: STAR[src], stem: earth[src] }
    if (src === 2) heaven[dst].extra = `Thiên Cầm (${earth[5]})`
  })

  // Nhân bàn: trực sử đi theo số bước giờ trong tuần
  const steps = (hChi - headBranch + 12) % 12
  let d = p0
  for (let i = 0; i < steps; i++) d = duong ? (d % 9) + 1 : ((d + 7) % 9) + 1
  const dR = d === 5 ? 2 : d
  const dOff = (ringIdx(dR) - ringIdx(p0r) + 8) % 8
  const doors: Record<number, string> = {}
  RING.forEach((dst, i) => (doors[dst] = DOOR[RING[(i - dOff + 8) % 8]]))

  // Thần bàn
  const gods: Record<number, string> = {}
  const tStart = ringIdx(target)
  GODS.forEach((g, i) => (gods[RING[duong ? (tStart + i) % 8 : (tStart - i + 8) % 8]] = g))

  const cells: Record<number, QMCell> = {}
  for (let p = 1; p <= 9; p++) {
    if (p === 5) { cells[5] = { palace: 5, dir: PALACE_DIR[5], quai: 'Trung', earth: earth[5], heaven: '', star: 'Thiên Cầm', door: '', god: '' }; continue }
    cells[p] = { palace: p, dir: PALACE_DIR[p], quai: PALACE_QUAI[p], earth: earth[p], heaven: heaven[p].stem, star: heaven[p].star, door: doors[p], god: gods[p], extra: heaven[p].extra }
  }

  const patterns: string[] = []
  if (off === 0) patterns.push('Cửu tinh phục ngâm: sao về đúng chỗ cũ – việc trì trệ, nên giữ nguyên hiện trạng.')
  if (off === 4) patterns.push('Cửu tinh phản ngâm: sao ở cung đối – việc dễ đảo ngược, lặp lại.')
  if (dOff === 0) patterns.push('Bát môn phục ngâm: cửa nằm yên – hợp chờ đợi, không hợp khởi sự.')
  if (dOff === 4) patterns.push('Bát môn phản ngâm: cửa ở cung đối – đi lại, thay đổi dễ trắc trở.')

  return {
    time, duong, jieqi: jqVi, nguyen: (['Thượng', 'Trung', 'Hạ'] as const)[nguyenIdx], cuc,
    hourGZ: `${canHanToVi(hourGZ[0])} ${chiHanToVi(hourGZ[1])}`, dayGZ: `${canHanToVi(dayGZ[0])} ${chiHanToVi(dayGZ[1])}`,
    tuanThu, trucPhu, trucSu, cells, patterns,
  }
}

export interface QMReading { focus: string; palace: QMCell; score: number; lines: string[]; goodDirs: string[] }

const FOCUS: { re: RegExp; label: string; pick: (c: QMCell) => boolean }[] = [
  { re: /(yeu|vo|chong|hon nhan|cuoi|tinh cam|duyen)/, label: 'Lục Hợp (hôn nhân, hợp tác)', pick: (c) => c.god === 'Lục Hợp' },
  { re: /(tien|tai|kinh doanh|dau tu|buon|ban|loi|luong|nha|dat)/, label: 'Sinh môn (tài lộc)', pick: (c) => c.door === 'Sinh' },
  { re: /(cong viec|su nghiep|chuc|thang|xin viec|cong ty|khoi nghiep)/, label: 'Khai môn (công việc)', pick: (c) => c.door === 'Khai' },
  { re: /(thi|hoc|giay to|hop dong|van ban|quang cao)/, label: 'Cảnh môn (văn thư, thi cử)', pick: (c) => c.door === 'Cảnh' },
  { re: /(benh|suc khoe|om|thuoc|bac si)/, label: 'Thiên Tâm (thầy thuốc, chữa trị)', pick: (c) => c.star === 'Thiên Tâm' },
]

const strip = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').toLowerCase()

export function readQimen(chart: QMChart, question: string): QMReading {
  const q = strip(question)
  const f = FOCUS.find((x) => x.re.test(q))
  const outer = RING.map((p) => chart.cells[p])
  const palace = (f && outer.find(f.pick)) || outer.find((c) => c.door === chart.trucSu)!
  const focus = f ? f.label : `Trực sử ${chart.trucSu} môn (việc chung)`
  let score = (DOOR_TONE[palace.door] ?? 0) + (STAR_TONE[palace.star] ?? 0) + (GOD_TONE[palace.god] ?? 0)
  const lines: string[] = []
  lines.push(`Lập bàn giờ ${chart.hourGZ}, ngày ${chart.dayGZ}: ${chart.duong ? 'Dương' : 'Âm'} độn ${chart.cuc} cục (tiết ${chart.jieqi}, ${chart.nguyen} nguyên). Trực phù ${chart.trucPhu}, trực sử ${chart.trucSu} môn.`)
  lines.push(`Dụng sự xem ${focus}, rơi vào cung ${palace.palace} ${palace.quai} (${palace.dir}): sao ${palace.star}, cửa ${palace.door} (${DOOR_NOTE[palace.door] ?? ''}), thần ${palace.god}.`)
  const ph = PALACE_HANH[palace.palace], dh = DOOR_HANH[palace.door]
  if (dh && hanhKhac(dh, ph)) { score -= 0.5; lines.push(`Môn bức: cửa ${palace.door} (${dh}) khắc cung (${ph}) – sức cửa bị hao, việc khó trọn.`) }
  else if (dh && hanhKhac(ph, dh)) { score -= 0.5; lines.push(`Cung (${ph}) chế cửa ${palace.door} (${dh}) – cát giảm, hung cũng nhẹ đi.`) }
  else if (dh) lines.push(`Cửa ${palace.door} (${dh}) và cung (${ph}) không khắc nhau – lực cửa phát huy bình thường.`)
  for (const p of chart.patterns) { score -= 0.5; lines.push(p) }
  const goodDirs = RING.map((p) => chart.cells[p]).filter((c) => ['Khai', 'Hưu', 'Sinh'].includes(c.door)).map((c) => `${c.dir} (cửa ${c.door})`)
  lines.push(`Hướng xuất hành thuận trong giờ này: ${goodDirs.join(', ')}.`)
  return { focus, palace, score, lines, goodDirs }
}
