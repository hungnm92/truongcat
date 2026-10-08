// Phong thủy: Bát Trạch (theo cung phi) và Huyền Không Phi Tinh (vận 9, 2024–2043).

export const SON24 = [
  'Tý', 'Quý', 'Sửu', 'Cấn', 'Dần', 'Giáp', 'Mão', 'Ất', 'Thìn', 'Tốn', 'Tỵ', 'Bính',
  'Ngọ', 'Đinh', 'Mùi', 'Khôn', 'Thân', 'Canh', 'Dậu', 'Tân', 'Tuất', 'Càn', 'Hợi', 'Nhâm',
] as const

export type Quai = 'Khảm' | 'Cấn' | 'Chấn' | 'Tốn' | 'Ly' | 'Khôn' | 'Đoài' | 'Càn'

export const SON_QUAI: Record<string, Quai> = {
  Nhâm: 'Khảm', Tý: 'Khảm', Quý: 'Khảm', Sửu: 'Cấn', Cấn: 'Cấn', Dần: 'Cấn',
  Giáp: 'Chấn', Mão: 'Chấn', Ất: 'Chấn', Thìn: 'Tốn', Tốn: 'Tốn', Tỵ: 'Tốn',
  Bính: 'Ly', Ngọ: 'Ly', Đinh: 'Ly', Mùi: 'Khôn', Khôn: 'Khôn', Thân: 'Khôn',
  Canh: 'Đoài', Dậu: 'Đoài', Tân: 'Đoài', Tuất: 'Càn', Càn: 'Càn', Hợi: 'Càn',
}

/** Âm/Dương của 24 sơn (+1 dương, -1 âm). */
const SON_AD: Record<string, 1 | -1> = {
  Nhâm: 1, Tý: -1, Quý: -1, Sửu: -1, Cấn: 1, Dần: 1, Giáp: 1, Mão: -1, Ất: -1,
  Thìn: 1, Tốn: 1, Tỵ: -1, Bính: 1, Ngọ: -1, Đinh: -1, Mùi: -1, Khôn: 1, Thân: 1,
  Canh: 1, Dậu: -1, Tân: -1, Tuất: 1, Càn: 1, Hợi: -1,
}

/** Thiên / Địa / Nhân nguyên của từng sơn. */
const SON_NGUYEN: Record<string, 'T' | 'D' | 'N'> = {
  Nhâm: 'T', Tý: 'D', Quý: 'N', Sửu: 'N', Cấn: 'D', Dần: 'T', Giáp: 'T', Mão: 'D', Ất: 'N',
  Thìn: 'N', Tốn: 'D', Tỵ: 'T', Bính: 'T', Ngọ: 'D', Đinh: 'N', Mùi: 'N', Khôn: 'D', Thân: 'T',
  Canh: 'T', Dậu: 'D', Tân: 'N', Tuất: 'N', Càn: 'D', Hợi: 'T',
}

export const QUAI_DIR: Record<Quai, string> = {
  Khảm: 'Bắc', Cấn: 'Đông Bắc', Chấn: 'Đông', Tốn: 'Đông Nam', Ly: 'Nam', Khôn: 'Tây Nam', Đoài: 'Tây', Càn: 'Tây Bắc',
}

export const DIR_ORDER: Quai[] = ['Khảm', 'Cấn', 'Chấn', 'Tốn', 'Ly', 'Khôn', 'Đoài', 'Càn']
export const QUAI_SYMBOL: Record<Quai, string> = { Khảm: '☵', Cấn: '☶', Chấn: '☳', Tốn: '☴', Ly: '☲', Khôn: '☷', Đoài: '☱', Càn: '☰' }

export function sonOfDegree(deg: number): string {
  const d = ((deg % 360) + 360) % 360
  return SON24[Math.floor((d + 7.5) % 360 / 15)]
}
export const quaiOfDegree = (deg: number): Quai => SON_QUAI[sonOfDegree(deg)]
export const oppositeDegree = (deg: number) => (deg + 180) % 360

// ---------- Bát Trạch ----------
const QUAI_LINES: Record<Quai, [number, number, number]> = {
  Càn: [1, 1, 1], Đoài: [1, 1, 0], Ly: [1, 0, 1], Chấn: [1, 0, 0],
  Tốn: [0, 1, 1], Khảm: [0, 1, 0], Cấn: [0, 0, 1], Khôn: [0, 0, 0],
}
const quaiFromLines = (l: number[]): Quai => (Object.keys(QUAI_LINES) as Quai[]).find((q) => QUAI_LINES[q].every((v, i) => v === l[i]))!

export const BAT_TRACH_NAMES = ['Sinh Khí', 'Thiên Y', 'Diên Niên', 'Phục Vị', 'Tuyệt Mệnh', 'Ngũ Quỷ', 'Lục Sát', 'Họa Hại'] as const
export type TrachStar = (typeof BAT_TRACH_NAMES)[number]
const FLIPS: Record<TrachStar, number[]> = {
  'Sinh Khí': [2], 'Thiên Y': [0, 1], 'Diên Niên': [0, 1, 2], 'Phục Vị': [],
  'Tuyệt Mệnh': [1], 'Ngũ Quỷ': [1, 2], 'Lục Sát': [0, 2], 'Họa Hại': [0],
}
export const TRACH_GOOD: TrachStar[] = ['Sinh Khí', 'Thiên Y', 'Diên Niên', 'Phục Vị']
export const TRACH_MEANING: Record<TrachStar, string> = {
  'Sinh Khí': 'Tài lộc, hưng vượng, tinh thần phấn chấn (tốt nhất)',
  'Thiên Y': 'Sức khỏe, được giúp đỡ, hóa giải bệnh tật',
  'Diên Niên': 'Bền vững, hòa thuận, củng cố quan hệ',
  'Phục Vị': 'Bình ổn, tĩnh tại, hợp học tập và nghỉ ngơi',
  'Tuyệt Mệnh': 'Hao tổn lớn, nguy cơ về sức khỏe (xấu nhất)',
  'Ngũ Quỷ': 'Thị phi, trộm cắp, rối ren công việc',
  'Lục Sát': 'Bất hòa, rắc rối tình cảm và quan hệ',
  'Họa Hại': 'Trở ngại vặt, hay gặp chuyện phiền',
}

export function batTrach(menh: Quai): Record<TrachStar, { quai: Quai; dir: string }> {
  const out = {} as Record<TrachStar, { quai: Quai; dir: string }>
  for (const s of BAT_TRACH_NAMES) {
    const l = [...QUAI_LINES[menh]]
    FLIPS[s].forEach((i) => (l[i] = 1 - l[i]))
    const q = quaiFromLines(l)
    out[s] = { quai: q, dir: QUAI_DIR[q] }
  }
  return out
}

/** Cung phi theo năm âm lịch và giới tính. */
export function cungPhi(lunarYear: number, gender: 'Nam' | 'Nữ'): Quai {
  let d = String(lunarYear).split('').reduce((a, c) => a + Number(c), 0)
  while (d > 9) d = String(d).split('').reduce((a, c) => a + Number(c), 0)
  const after2000 = lunarYear >= 2000
  let n = gender === 'Nam' ? (after2000 ? 9 - d : 11 - d) : after2000 ? 6 + d : 4 + d
  n = ((n % 9) + 9) % 9 || 9
  const map: Record<number, Quai> = { 1: 'Khảm', 2: 'Khôn', 3: 'Chấn', 4: 'Tốn', 6: 'Càn', 7: 'Đoài', 8: 'Cấn', 9: 'Ly' }
  return n === 5 ? (gender === 'Nam' ? 'Khôn' : 'Cấn') : map[n]
}
export const nhomMenh = (q: Quai) => (['Khảm', 'Ly', 'Chấn', 'Tốn'].includes(q) ? 'Đông Tứ Mệnh' : 'Tây Tứ Mệnh')

// ---------- Huyền Không ----------
export type Cell = 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW' | 'C'
export const CELLS: Cell[] = ['SE', 'S', 'SW', 'E', 'C', 'W', 'NE', 'N', 'NW']
const CELL_QUAI: Record<Exclude<Cell, 'C'>, Quai> = { N: 'Khảm', NE: 'Cấn', E: 'Chấn', SE: 'Tốn', S: 'Ly', SW: 'Khôn', W: 'Đoài', NW: 'Càn' }
const QUAI_CELL = Object.fromEntries(Object.entries(CELL_QUAI).map(([k, v]) => [v, k])) as Record<Quai, Cell>
// Đường bay Lạc Thư: Trung → Tây Bắc → Tây → Đông Bắc → Nam → Bắc → Tây Nam → Đông → Đông Nam
const FLY_PATH: Cell[] = ['C', 'NW', 'W', 'NE', 'S', 'N', 'SW', 'E', 'SE']
// Sao nguyên bản của mỗi cung theo Lạc Thư
const LUOSHU_STAR: Record<Cell, number> = { C: 5, NW: 6, W: 7, NE: 8, S: 9, N: 1, SW: 2, E: 3, SE: 4 }
const STAR_CELL: Record<number, Cell> = Object.fromEntries(Object.entries(LUOSHU_STAR).map(([c, s]) => [s, c])) as never

function fly(center: number, forward: boolean): Record<Cell, number> {
  const board = {} as Record<Cell, number>
  FLY_PATH.forEach((cell, i) => {
    const raw = forward ? center + i : center - i
    board[cell] = ((raw - 1) % 9 + 9) % 9 + 1
  })
  return board
}

export const VAN = 9
export const VAN_LABEL = 'Vận 9 (2024–2043)'

/** Sơn thuộc cung cell có cùng nguyên với sơn gốc, dùng định chiều bay. */
function polarityFor(star: number, originMountain: string): boolean {
  if (star === 5) return SON_AD[originMountain] === 1
  const cell = STAR_CELL[star]
  const quai = CELL_QUAI[cell as Exclude<Cell, 'C'>]
  const origin = SON_NGUYEN[originMountain]
  const m = Object.keys(SON_QUAI).find((k) => SON_QUAI[k] === quai && SON_NGUYEN[k] === origin)!
  return SON_AD[m] === 1
}

export interface HKCell { van: number; son: number; huong: number }
export interface HKChart {
  tonSon: string
  huong: string
  cells: Record<Cell, HKCell>
  pattern: string
  tonSonQuai: Quai
}

export function huyenKhong(degree: number): HKChart {
  const son = sonOfDegree(degree)
  const huong = sonOfDegree(oppositeDegree(degree))
  const van = fly(VAN, true)
  const sonStar = van[QUAI_CELL[SON_QUAI[son]]]
  const huongStar = van[QUAI_CELL[SON_QUAI[huong]]]
  const sonB = fly(sonStar, polarityFor(sonStar, son))
  const huongB = fly(huongStar, polarityFor(huongStar, huong))
  const cells = {} as Record<Cell, HKCell>
  for (const c of CELLS) cells[c] = { van: van[c], son: sonB[c], huong: huongB[c] }
  const sonCell = QUAI_CELL[SON_QUAI[son]], huongCell = QUAI_CELL[SON_QUAI[huong]]
  const ss = cells[sonCell], hs = cells[huongCell]
  // Cách cục theo vị trí của sao vượng (9) trên sơn tinh/hướng tinh.
  let pattern = 'Cách cục thường, không có sao vượng nổi bật ở tọa hướng'
  if (ss.son === VAN && hs.huong === VAN) pattern = 'Vượng sơn vượng hướng (cát: người và tài đều thuận)'
  else if (ss.huong === VAN && hs.son === VAN) pattern = 'Thượng sơn hạ thủy (sơn hướng đảo ngược, cần cẩn trọng khi dùng)'
  else if (ss.son === VAN && ss.huong === VAN) pattern = 'Song tinh hội tọa (tốt cho sức khỏe, nhân đinh; kém về tài lộc)'
  else if (hs.son === VAN && hs.huong === VAN) pattern = 'Song tinh hội hướng (tốt cho tài lộc; kém về nhân đinh)'
  else if (ss.son === VAN) pattern = 'Sơn tinh đắc vượng (hợp tựa lưng vững, thuận về người)'
  else if (hs.huong === VAN) pattern = 'Hướng tinh đắc vượng (hợp mặt trước thoáng, thuận về tài)'
  return { tonSon: son, huong, cells, pattern, tonSonQuai: SON_QUAI[son] }
}

export type StarTone = 'cat' | 'binh' | 'hung'
export const starTone = (s: number): StarTone => ([1, 8, 9].includes(s) ? 'cat' : [4, 6].includes(s) ? 'binh' : 'hung')
export const STAR_NOTE: Record<number, string> = {
  1: 'Nhất Bạch (Tham Lang): quý nhân, đào hoa, thông minh',
  2: 'Nhị Hắc (Cự Môn): bệnh khí, hao tổn',
  3: 'Tam Bích (Lộc Tồn): thị phi, tranh cãi',
  4: 'Tứ Lục (Văn Khúc): học hành, văn chương',
  5: 'Ngũ Hoàng (Liêm Trinh): đại sát, tai ương',
  6: 'Lục Bạch (Võ Khúc): quyền uy, cơ hội',
  7: 'Thất Xích (Phá Quân): phá tán, trộm cướp (vận 9 đã suy)',
  8: 'Bát Bạch (Tả Phù): tài lộc, nhà đất (đang thoái khí, vẫn tốt)',
  9: 'Cửu Tử (Hữu Bật): vượng nhất vận này, hỷ sự',
}

export type Purpose = 'nha' | 'banlamviec' | 'giuong'
export const PURPOSE_LABEL: Record<Purpose, string> = { nha: 'Mua Nhà/Đất', banlamviec: 'Bàn Làm Việc', giuong: 'Kê Giường Ngủ' }

export interface FSAdvice {
  menh: Quai
  group: string
  dirQuality: TrachStar
  good: boolean
  verdict: string
  bestDirs: { star: TrachStar; dir: string; quai: Quai }[]
  hk: HKChart
  lines: string[]
}

export function adviseDirection(degree: number, purpose: Purpose, menh: Quai): FSAdvice {
  const q = quaiOfDegree(degree)
  const table = batTrach(menh)
  const dirQuality = BAT_TRACH_NAMES.find((s) => table[s].quai === q)!
  const good = TRACH_GOOD.includes(dirQuality)
  const hk = huyenKhong(purpose === 'nha' ? oppositeDegree(degree) : degree)
  const lines: string[] = []
  const what = purpose === 'nha' ? 'hướng nhà' : purpose === 'banlamviec' ? 'hướng ngồi (mặt nhìn về)' : 'hướng đầu giường'
  lines.push(`${what} ${QUAI_DIR[q]} (${sonOfDegree(degree)}, ${Math.round(degree)}°) rơi vào ${dirQuality} với mệnh ${menh}: ${TRACH_MEANING[dirQuality]}.`)
  if (purpose === 'banlamviec') lines.push('Nên ưu tiên Sinh Khí cho tiền tài, Thiên Y khi cần ổn định sức khỏe, Diên Niên cho quan hệ đồng nghiệp.')
  if (purpose === 'giuong') lines.push('Chọn hướng đầu giường Phục Vị hoặc Thiên Y để ngủ sâu; tránh Tuyệt Mệnh, Ngũ Quỷ.')
  if (purpose === 'nha') {
    lines.push(`Huyền Không ${VAN_LABEL}: tọa ${hk.tonSon} hướng ${hk.huong}. ${hk.pattern}.`)
    const hs = hk.cells[QUAI_CELL[SON_QUAI[hk.huong]]]
    lines.push(`Tại cung hướng: hướng tinh ${hs.huong} (${STAR_NOTE[hs.huong]}); sơn tinh ${hs.son} (${STAR_NOTE[hs.son]}).`)
  }
  const good4 = TRACH_GOOD.map((s) => ({ star: s, dir: table[s].dir, quai: table[s].quai }))
  const verdict = dirQuality === 'Sinh Khí' || dirQuality === 'Thiên Y' ? 'Rất hợp' : good ? 'Hợp' : dirQuality === 'Tuyệt Mệnh' ? 'Nên tránh' : 'Không hợp'
  return { menh, group: nhomMenh(menh), dirQuality, good, verdict, bestDirs: good4, hk, lines }
}
