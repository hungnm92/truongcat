import type { IFunctionalPalace as Palace } from 'iztro/lib/astro/FunctionalPalace'
import { BRIGHTNESS_TEXT, CAT_TINH, CUC_TEXT, MAJOR_STARS, MUTAGEN_TEXT, PALACES, SAT_TINH } from '../data/stars'
import { palaceByName, type Chart } from './chart'
import { dayInfo } from './calendar'
import { PALACE_KEY, STAR_PALACE, isDim } from '../data/starPalace'
import { STAR_FIELDS, detectPatterns, type PatternHit } from '../data/patterns'

export type Level = 'Rất tốt' | 'Tốt' | 'Trung bình' | 'Cần thận trọng'

export interface PalaceReading {
  name: string
  branch: string
  stem: string
  stars: string[]
  score: number
  level: Level
  vcd: boolean
  headline: string
  paragraphs: string[]
  decadal: string
}

const BRIGHT_SCORE: Record<string, number> = { Miếu: 2, Vượng: 2, Đắc: 1, Lợi: 1, Bình: 0, Bất: -0.5, Hạn: -1, Hãm: -1 }
const MUTAGEN_SCORE: Record<string, number> = { Lộc: 2, Quyền: 1.5, Khoa: 1.5, Kỵ: -2 }

export const levelOf = (s: number): Level => (s >= 5 ? 'Rất tốt' : s >= 2 ? 'Tốt' : s > -1 ? 'Trung bình' : 'Cần thận trọng')
export const levelIcon = (l: Level) => (l === 'Rất tốt' || l === 'Tốt' ? '✨' : l === 'Cần thận trọng' ? '⚠️' : '◦')

function starsOf(p: Palace) {
  return [...p.majorStars, ...p.minorStars]
}

function ownScore(p: Palace): number {
  let s = 0
  for (const st of starsOf(p)) {
    if (st.type === 'major') s += BRIGHT_SCORE[st.brightness ?? 'Bình'] ?? 0
    else if (CAT_TINH.includes(st.name)) s += 1
    else if (SAT_TINH.includes(st.name)) s -= st.brightness === 'Miếu' ? 0.5 : 1
    if (st.mutagen) s += MUTAGEN_SCORE[st.mutagen] ?? 0
  }
  for (const a of p.adjectiveStars ?? []) {
    if (a.name === 'Tuần Không' || a.name === 'Triệt Lộ') s -= 0.5
  }
  return s
}

/** Tam phương tứ chính: bản cung + đối cung + 2 tam hợp (trọng số 1 / 0.7 / 0.5). */
export function palaceScore(c: Chart, name: string): number {
  const sp = c.astro.surroundedPalaces(name as never)
  const own = ownScore(sp.target)
  const opp = ownScore(sp.opposite)
  const tri = ownScore(sp.wealth) + ownScore(sp.career)
  return Math.round((own + opp * 0.7 + tri * 0.5) * 10) / 10
}

const joinNames = (xs: string[]) => (xs.length <= 1 ? xs.join('') : `${xs.slice(0, -1).join(', ')} và ${xs[xs.length - 1]}`)

function lowerFirst(s: string) { return s.charAt(0).toLowerCase() + s.slice(1) }

export function readPalace(c: Chart, name: string): PalaceReading {
  const p = palaceByName(c, name)
  const meta = PALACES[name] ?? { topic: '', field: 'core' as const, intro: `Cung ${name}` }
  const vcd = p.majorStars.length === 0
  const score = palaceScore(c, name)
  const level = levelOf(score)
  const paragraphs: string[] = []
  const opp = c.astro.surroundedPalaces(name as never).opposite
  const mains = vcd ? opp.majorStars : p.majorStars

  if (vcd) {
    const borrow = opp.majorStars.map((s) => s.name)
    paragraphs.push(
      `${meta.intro}. Cung này không có chính tinh (vô chính diệu), nên mượn sao đối cung ${opp.earthlyBranch}${borrow.length ? ` là ${joinNames(borrow)}` : ' cũng trống'} để luận. Tính chất kém ổn định, chịu ảnh hưởng nhiều của hoàn cảnh và các phụ tinh, sao vận hạn.`,
    )
  } else {
    paragraphs.push(`${meta.intro}, thuộc phạm vi ${meta.topic}.`)
  }

  for (const st of mains) {
    const t = MAJOR_STARS[st.name]
    if (!t) continue
    const bright = BRIGHTNESS_TEXT[st.brightness ?? 'Bình'] ?? ''
    const who = vcd ? `${st.name} (mượn từ đối cung)` : st.name
    const mu = st.mutagen ? ` ${MUTAGEN_TEXT[st.mutagen] ?? ''}.` : ''
    const key = PALACE_KEY[name]
    const pair = key ? STAR_PALACE[st.name]?.[key] : undefined
    const specific = pair ? pair[isDim(st.brightness) ? 1 : 0] : `${lowerFirst(String(t[meta.field]))}.`
    paragraphs.push(`${who} (${t.hanh}, ${bright}): ${specific}${mu}`)
  }

  const cat = [...p.minorStars].filter((s) => CAT_TINH.includes(s.name)).map((s) => s.name)
  const sat = [...p.minorStars].filter((s) => SAT_TINH.includes(s.name)).map((s) => s.name)
  if (cat.length) paragraphs.push(`Trợ lực: ${joinNames(cat)} đồng cung, giúp việc thêm thuận.`)
  if (sat.length) paragraphs.push(`Cần lưu ý: ${joinNames(sat)} đồng cung, dễ gây trắc trở nếu nóng vội.`)
  const tt = (p.adjectiveStars ?? []).map((s) => s.name).filter((n) => n === 'Tuần Không' || n === 'Triệt Lộ')
  if (tt.length) paragraphs.push(`${tt.join(' và ')} đóng ở cung này: sức của các sao bị giảm hoặc chậm phát, thường đến muộn hơn người.`)

  const sp = c.astro.surroundedPalaces(name as never)
  const sup = [...starsOf(sp.opposite), ...starsOf(sp.wealth), ...starsOf(sp.career)]
  const supCat = Array.from(new Set(sup.filter((s) => CAT_TINH.includes(s.name)).map((s) => s.name)))
  const supSat = Array.from(new Set(sup.filter((s) => SAT_TINH.includes(s.name)).map((s) => s.name)))
  if (supCat.length || supSat.length) {
    paragraphs.push(
      `Tam phương tứ chính: ${supCat.length ? `được ${joinNames(supCat)} hội chiếu` : ''}${supCat.length && supSat.length ? '; ' : ''}${supSat.length ? `bị ${joinNames(supSat)} xung chiếu` : ''}.`,
    )
  }

  const stars = [...p.majorStars, ...p.minorStars.filter((s) => CAT_TINH.includes(s.name) || SAT_TINH.includes(s.name))].map(
    (s) => s.name + (s.mutagen ? ` (${s.mutagen})` : ''),
  )
  return {
    name,
    branch: p.earthlyBranch,
    stem: p.heavenlyStem,
    stars,
    score,
    level,
    vcd,
    headline: `${name} tại ${p.earthlyBranch}`,
    paragraphs,
    decadal: `${p.decadal.range[0]}–${p.decadal.range[1]} tuổi`,
  }
}

export function readAllPalaces(c: Chart): PalaceReading[] {
  return c.palaces.map((p) => readPalace(c, p.name))
}

// ---------- Tổng quan ----------

export interface Overview {
  title: string
  summary: string
  highlights: string[]
  cautions: string[]
  actions: string[]
  yang: number
  yin: number
  catRatio: number
  satRatio: number
  look: string
  past: { year: number; age: number; text: string }[]
  gauge: string
  patterns: PatternHit[]
  personal: string[]
}

const YANG_BRANCH = ['Tý', 'Dần', 'Thìn', 'Ngọ', 'Thân', 'Tuất']

const KY_TOPIC: Record<string, string> = {
  Mệnh: 'bản thân hay bị nghĩ ngợi, tự tạo áp lực',
  'Phụ Mẫu': 'quan hệ với cha mẹ, giấy tờ cần kiểm tra kỹ',
  'Phúc Đức': 'tinh thần dễ lo, họ hàng có chuyện cần xử lý',
  'Điền Trạch': 'chuyện nhà đất, sửa chữa, tranh chấp tài sản',
  'Quan Lộc': 'công việc, cấp trên, thay đổi vị trí',
  'Nô Bộc': 'bạn bè, cấp dưới, đối tác',
  'Thiên Di': 'đi lại, môi trường mới',
  'Tật Ách': 'sức khỏe cần khám định kỳ',
  'Tài Bạch': 'dòng tiền, khoản chi bất ngờ',
  'Tử Nữ': 'chuyện con cái hoặc dự định sinh nở',
  'Phu Thê': 'tình cảm, hôn nhân dễ hiểu lầm',
  'Huynh Đệ': 'anh em, đối tác, vay mượn',
}

export function buildOverview(c: Chart): Overview {
  const a = c.astro
  const menh = palaceByName(c, 'Mệnh')
  const mains = menh.majorStars.length ? menh.majorStars : a.surroundedPalaces('Mệnh' as never).opposite.majorStars
  const mainNames = mains.map((s) => s.name)
  const spM = a.surroundedPalaces('Mệnh' as never)
  const around = [...starsOfAll(spM.target), ...starsOfAll(spM.opposite), ...starsOfAll(spM.wealth), ...starsOfAll(spM.career)]
  const has = (n: string) => around.some((s) => s.name === n)
  const satAround = Array.from(new Set(around.filter((s) => SAT_TINH.includes(s.name)).map((s) => s.name)))

  const highlights: string[] = []
  if (has('Tả Phù') && has('Hữu Bật')) highlights.push('Tả Phù – Hữu Bật hội về Mệnh: được nhiều người giúp sức, làm việc nhóm thuận.')
  if (has('Văn Xương') && has('Văn Khúc')) highlights.push('Văn Xương – Văn Khúc hội Mệnh: nhạy bén về chữ nghĩa, học hỏi nhanh, có khiếu trình bày.')
  if (has('Thiên Khôi') && has('Thiên Việt')) highlights.push('Thiên Khôi – Thiên Việt hội Mệnh: gặp quý nhân vào lúc cần, dễ nhận được cơ hội từ người đi trước.')
  const mut = around.filter((s) => s.mutagen && s.mutagen !== 'Kỵ').map((s) => s.mutagen)
  if (mut.length >= 2) highlights.push(`Có ${mut.length} trong ba hóa Lộc – Quyền – Khoa chiếu về Mệnh: nền tảng tài năng và cơ hội khá tốt.`)
  if (has('Lộc Tồn')) highlights.push('Lộc Tồn hội Mệnh: biết giữ của, có nền tảng kinh tế vững dần theo thời gian.')
  if (!highlights.length) highlights.push('Lá số không có tổ hợp cát tinh nổi trội, thành quả đến chủ yếu nhờ nỗ lực đều đặn của bản thân.')

  const cautions: string[] = []
  if (satAround.length) cautions.push(`${joinNames(satAround)} xung chiếu Mệnh: những lúc căng thẳng dễ hành động vội, nên chậm một nhịp trước khi quyết định.`)
  const ky = around.find((s) => s.mutagen === 'Kỵ')
  if (ky) cautions.push(`Hóa Kỵ (${ky.name}) về Mệnh: dễ bị ám ảnh bởi một chuyện, cần kiểm chứng thông tin thay vì suy đoán.`)
  const kyPalace = c.palaces.find((p) => starsOfAll(p).some((s) => s.mutagen === 'Kỵ'))
  if (kyPalace) cautions.push(`Hóa Kỵ gốc nằm ở cung ${kyPalace.name}: ${KY_TOPIC[kyPalace.name] ?? 'cần cẩn trọng'}.`)
  if (menh.adjectiveStars?.some((s) => s.name === 'Tuần Không' || s.name === 'Triệt Lộ')) cautions.push('Mệnh gặp Tuần/Triệt: đường đời khởi đầu chậm, về sau mới rõ nét; đừng nản sớm.')
  if (!cautions.length) cautions.push('Không có sát tinh nặng chiếu Mệnh, điều cần giữ là tính chủ quan khi mọi việc đang thuận.')

  const thanPalace = c.palaces.find((p) => p.isBodyPalace)
  const sinhKhac = relation(c)
  const actions: string[] = []
  actions.push(`Mệnh ${c.napAm} an tại ${menh.earthlyBranch}; ${CUC_TEXT[a.fiveElementsClass] ?? a.fiveElementsClass}. ${sinhKhac}`)
  const forward = (c.input.gender === 'Nam') === (isYangStem(c.canNam))
  actions.push(`${isYangStem(c.canNam) ? 'Dương' : 'Âm'} ${c.input.gender} nên đại vận đi ${forward ? 'thuận' : 'nghịch'}: ${forward ? 'vận trải xuôi theo hướng tiến' : 'vận cần tính lùi bước, tích lũy trước khi tiến'}.`)
  if (thanPalace) actions.push(`Thân cư ${thanPalace.name}: về lâu dài, sức nặng cuộc đời nghiêng về ${PALACES[thanPalace.name]?.topic ?? ''}.`)

  // Âm dương: theo chi của các cung có sao + hành động của chính tinh
  let yang = 0, yin = 0
  for (const p of c.palaces) {
    const w = p.majorStars.length + p.minorStars.length * 0.5
    if (YANG_BRANCH.includes(p.earthlyBranch)) yang += w; else yin += w
  }
  const tot = yang + yin || 1
  const allStars = c.palaces.flatMap((p) => [...p.majorStars, ...p.minorStars])
  const nCat = allStars.filter((s) => CAT_TINH.includes(s.name)).length
  const nSat = allStars.filter((s) => SAT_TINH.includes(s.name)).length
  const nAll = allStars.length || 1

  const past = pastYears(c)
  const patterns = detectPatterns(c)

  const name = mainNames.length ? joinNames(mainNames) : 'Vô Chính Diệu'
  const summary = mainNames.length
    ? `Mệnh có ${menh.majorStars.length ? name : `${name} (mượn đối cung)`} tại ${menh.earthlyBranch}. Nhìn tổng thể: ${mains.map((s) => MAJOR_STARS[s.name]?.core).filter(Boolean).join('; ')}.`
    : 'Mệnh vô chính diệu: đường đời chịu ảnh hưởng lớn bởi môi trường, nên chọn người và nơi mình sống làm việc.'

  return {
    title: `Mệnh ${name}`,
    summary,
    highlights,
    cautions,
    actions,
    yang: Math.round((yang / tot) * 100),
    yin: Math.round((yin / tot) * 100),
    catRatio: Math.round((nCat / nAll) * 100),
    satRatio: Math.round((nSat / nAll) * 100),
    look: mains.map((s) => MAJOR_STARS[s.name]?.look).filter(Boolean).join('; '),
    past,
    patterns,
    personal: personalAdvice(c),
    gauge: Math.abs(yang - yin) / tot < 0.2 ? 'Âm dương khá cân bằng: có thể chuyển nhịp giữa hành động và quan sát.' : yang > yin ? 'Dương khí trội: thiên về chủ động, nhanh quyết.' : 'Âm khí trội: thiên về cân nhắc, kín đáo.',
  }
}

const isYangStem = (can: string) => ['Giáp', 'Bính', 'Mậu', 'Canh', 'Nhâm'].includes(can)

export function relation(c: Chart): string {
  const cucHanh = c.astro.fiveElementsClass.split(' ')[0]
  const menhHanh = c.napAm.split(' ').pop() ?? ''
  const SINH: Record<string, string> = { Kim: 'Thủy', Thủy: 'Mộc', Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim' }
  const KHAC: Record<string, string> = { Kim: 'Mộc', Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim' }
  if (cucHanh === menhHanh) return `Cục và Mệnh cùng hành ${cucHanh} (bình hòa).`
  if (SINH[cucHanh] === menhHanh) return `Cục ${cucHanh} sinh Mệnh ${menhHanh}: được nâng đỡ, thế thuận.`
  if (SINH[menhHanh] === cucHanh) return `Mệnh ${menhHanh} sinh Cục ${cucHanh}: hao sức nhiều, nên biết giữ nhịp.`
  if (KHAC[cucHanh] === menhHanh) return `Cục ${cucHanh} khắc Mệnh ${menhHanh}: nhiều thử thách, cần kiên trì.`
  if (KHAC[menhHanh] === cucHanh) return `Mệnh ${menhHanh} khắc Cục ${cucHanh}: tự lực mạnh, ít người giúp.`
  return `Cục ${cucHanh}, Mệnh ${menhHanh}.`
}

const starsOfAll = (p: Palace) => [...p.majorStars, ...p.minorStars, ...(p.adjectiveStars ?? [])]

/** Gợi ý quá khứ: các năm lưu niên có Hóa Kỵ/Hóa Lộc nhập cung quan trọng. Chỉ mang tính tham khảo. */
function pastYears(c: Chart) {
  const now = new Date().getFullYear()
  const out: { year: number; age: number; text: string; w: number }[] = []
  for (let y = c.input.year + 18; y < now; y++) {
    const h = c.astro.horoscope(`${y}-6-30`)
    const names = h.yearly.palaceNames
    const mutagen = h.yearly.mutagen // [Lộc, Quyền, Khoa, Kỵ]
    const kyStar = mutagen[3]
    const kyPal = c.palaces.find((p) => starsOfAll(p).some((s) => s.name === kyStar))
    const loc = c.palaces.find((p) => starsOfAll(p).some((s) => s.name === mutagen[0]))
    if (kyPal) {
      const topic = names[kyPal.index]
      const weight = ['Mệnh', 'Tài Bạch', 'Quan Lộc', 'Phu Thê', 'Tật Ách', 'Điền Trạch'].includes(topic) ? 2 : 1
      out.push({
        year: y, age: y - c.input.year + 1, w: weight,
        text: `Hóa Kỵ lưu niên (${kyStar}) rơi vào ${topic} của năm đó: giai đoạn dễ có trắc trở về ${KY_TOPIC[topic] ?? topic.toLowerCase()}.${loc ? ` Hóa Lộc lưu niên cũng gợi cơ hội ở cung ${names[loc.index]}.` : ''}`,
      })
    }
  }
  return out.sort((x, y) => y.w - x.w || y.year - x.year).slice(0, 3).map(({ year, age, text }) => ({ year, age, text }))
}

// ---------- Vận hạn theo năm ----------

export interface YearReading {
  year: number
  age: number
  canChi: string
  decadalRange: string
  yearly: { stem: string; branch: string }
  mutagen: { Lộc: string; Quyền: string; Khoa: string; Kỵ: string }
  items: { palace: string; yearPalace: string; branch: string; stars: string[]; score: number; level: Level; text: string }[]
  summary: string
  highlights: string[]
  cautions: string[]
  actions: string[]
  menhPalace: string
}

const YEAR_SUFFIX: Record<Level, string> = {
  'Rất tốt': 'Năm này mảng này đón nhiều thuận lợi, nên chủ động nắm bắt.',
  Tốt: 'Nhìn chung thuận, giữ nhịp đều sẽ có kết quả.',
  'Trung bình': 'Ít biến động lớn, tiến chậm mà chắc.',
  'Cần thận trọng': 'Nên phòng ngừa: kiểm tra kỹ, tránh quyết định lớn vội vàng.',
}

export function readYear(c: Chart, year: number): YearReading {
  const h = c.astro.horoscope(`${year}-6-30`)
  const names = h.yearly.palaceNames
  const mutagen = h.yearly.mutagen
  const mt = { Lộc: mutagen[0], Quyền: mutagen[1], Khoa: mutagen[2], Kỵ: mutagen[3] }
  const items = c.palaces.map((p) => {
    let s = palaceScore(c, p.name)
    const yearly = names[p.index]
    const flowStars = [] as string[]
    for (const [k, v] of Object.entries(mt)) {
      if (starsOfAll(p).some((st) => st.name === v)) {
        s += (MUTAGEN_SCORE[k] ?? 0) * 1.5
        flowStars.push(`${v} hóa ${k}`)
      }
    }
    const lvl = levelOf(s)
    const yearlyStars = (h.yearly.stars?.[p.index] ?? []).map((x) => x.name)
    return {
      palace: p.name,
      yearPalace: yearly,
      branch: p.earthlyBranch,
      stars: [...flowStars, ...yearlyStars],
      score: Math.round(s * 10) / 10,
      level: lvl,
      text: `Cung ${p.name} gốc, năm ${year} đóng vai trò cung ${yearly} (${PALACES[yearly]?.topic ?? ''}). ${flowStars.length ? `Có ${flowStars.join(', ')}. ` : ''}${YEAR_SUFFIX[lvl]}`,
    }
  })
  const best = [...items].sort((a, b) => b.score - a.score)[0]
  const worst = [...items].sort((a, b) => a.score - b.score)[0]
  const luu = h.yearly
  const di = dayInfo(year, 6, 30)
  const menhPalace = c.palaces[names.indexOf('Mệnh')]?.name ?? ''
  const tieuHan = c.palaces.find((p) => String(p.earthlyBranch) === String(h.age.earthlyBranch))?.name ?? ''
  const sorted = [...items].sort((a, b) => b.score - a.score)
  const topic = (n: string) => PALACES[n]?.topic ?? n.toLowerCase()
  const highlights = sorted.slice(0, 3).filter((x) => x.score > 0).map((x) => `Mảng ${topic(x.yearPalace)} (cung ${x.palace} gốc) sáng nhất năm, ${x.stars.length ? `có ${x.stars.slice(0, 2).join(', ')}` : 'tam phương được cát tinh trợ lực'}.`)
  if (!highlights.length) highlights.push('Năm không có mảng nào nổi trội, thành quả đến từ sự đều đặn hơn là cơ hội lớn.')
  const cautions = sorted.slice(-3).reverse().filter((x) => x.score < 2).map((x) => `Mảng ${topic(x.yearPalace)} (cung ${x.palace} gốc) yếu nhất năm: ${x.level === 'Cần thận trọng' ? 'nên phòng ngừa, kiểm tra kỹ trước khi quyết' : 'giữ nhịp, tránh mở rộng vội'}.`)
  const locP = c.palaces.find((p) => starsOfAll(p).some((s) => s.name === mt.Lộc))
  const kyP = c.palaces.find((p) => starsOfAll(p).some((s) => s.name === mt.Kỵ))
  const actions: string[] = []
  if (locP) actions.push(`Hóa Lộc (${mt.Lộc}) vào ${names[locP.index]}: chủ động đầu tư thời gian, công sức cho mảng ${topic(names[locP.index])}.`)
  if (kyP) actions.push(`Hóa Kỵ (${mt.Kỵ}) vào ${names[kyP.index]}: chậm lại, ghi chép rõ ràng mọi việc liên quan ${topic(names[kyP.index])}.`)
  actions.push(`Đại vận đang ở ${h.decadal.heavenlyStem} ${h.decadal.earthlyBranch}: các quyết định dài hạn nên xét theo nhịp 10 năm này, không chỉ riêng năm ${year}.`)
  return {
    year,
    age: h.age.nominalAge,
    canChi: di.lunar.yearGZ,
    decadalRange: (() => {
      const dp = c.palaces.find((p) => p.decadal.earthlyBranch === h.decadal.earthlyBranch && p.decadal.heavenlyStem === h.decadal.heavenlyStem)
      return dp ? `${dp.decadal.range.join('–')} tuổi (cung ${dp.name})` : ''
    })(),
    yearly: { stem: luu.heavenlyStem, branch: luu.earthlyBranch },
    mutagen: mt,
    items,
    summary: `Năm ${di.lunar.yearGZ}, lưu niên Mệnh nhập cung ${menhPalace} gốc (${luu.heavenlyStem} ${luu.earthlyBranch}); tiểu hạn đóng ở cung ${tieuHan}. Thuận nhất là mảng ${PALACES[best.yearPalace]?.topic ?? best.yearPalace}; cần thận trọng ở mảng ${PALACES[worst.yearPalace]?.topic ?? worst.yearPalace}.`,
    highlights,
    cautions,
    actions,
    menhPalace,
  }
}

// ---------- Lời khuyên theo "Hành trình nhân sinh" ----------

export function personalAdvice(c: Chart): string[] {
  const j = c.input.journey
  const out: string[] = []
  const y = c.input.viewYear
  const yr = readYearLite(c, y)
  const lv = (n: string) => yr[n] ?? levelOf(palaceScore(c, n))
  const ql = palaceByName(c, 'Quan Lộc')
  const qlStars = (ql.majorStars.length ? ql.majorStars : c.astro.surroundedPalaces('Quan Lộc' as never).opposite.majorStars).map((s) => s.name)
  if (j.field && j.field !== 'Khác') {
    const fit = qlStars.filter((s) => STAR_FIELDS[s]?.some((f) => j.field.startsWith(f)))
    const suggested = Array.from(new Set(qlStars.flatMap((s) => STAR_FIELDS[s] ?? [])))
    out.push(fit.length
      ? `Lĩnh vực "${j.field}" hợp với ${fit.join(', ')} ở cung Quan Lộc – bạn đang đi đúng sở trường, nên đào sâu chuyên môn.`
      : `Lĩnh vực "${j.field}" chưa trùng sở trường của cung Quan Lộc (${qlStars.join(', ') || 'vô chính diệu'}). Các mảng hợp hơn: ${suggested.join(', ') || 'linh hoạt'}; có thể phát triển kỹ năng phụ theo hướng này.`)
  }
  if (j.stage === 'Đang chuyển hướng') out.push(`Đang chuyển hướng: năm ${y} cung Quan Lộc ở mức "${lv('Quan Lộc')}", Thiên Di ở mức "${lv('Thiên Di')}". ${lv('Thiên Di') === 'Cần thận trọng' ? 'Nên chuẩn bị kỹ trước khi rời chỗ cũ.' : 'Thời điểm khá thuận để thử môi trường mới.'}`)
  if (j.stage === 'Kinh doanh riêng') out.push(`Kinh doanh riêng: cung Tài Bạch năm ${y} ở mức "${lv('Tài Bạch')}". ${lv('Tài Bạch') === 'Cần thận trọng' ? 'Ưu tiên giữ dòng tiền, hạn chế vay.' : 'Có thể mở rộng có kiểm soát.'}`)
  if (j.stage === 'Đang đi học') out.push(`Đang đi học: cung Phụ Mẫu (giấy tờ, thi cử) năm ${y} ở mức "${lv('Phụ Mẫu')}". Văn Xương, Văn Khúc ${['Văn Xương', 'Văn Khúc'].some((n) => palaceByName(c, 'Mệnh').minorStars.some((s) => s.name === n)) ? 'có mặt ở Mệnh – thuận học hành' : 'không ở Mệnh – cần phương pháp học đều đặn'}.`)
  if (j.stage === 'Đã nghỉ hưu') out.push(`Tuổi nghỉ ngơi: chú trọng cung Tật Ách ("${lv('Tật Ách')}") và Phúc Đức ("${lv('Phúc Đức')}") – giữ sức khỏe và đời sống tinh thần.`)
  if (j.love === 'Độc thân' || j.love === 'Đang yêu') out.push(`Tình cảm: cung Phu Thê năm ${y} ở mức "${lv('Phu Thê')}". ${['Rất tốt', 'Tốt'].includes(lv('Phu Thê')) ? 'Nhiều tín hiệu thuận để gặp gỡ hoặc tiến xa.' : 'Nên tìm hiểu kỹ, đừng vội quyết.'}`)
  if (j.love === 'Đã kết hôn') out.push(`Hôn nhân: cung Phu Thê năm ${y} ở mức "${lv('Phu Thê')}". ${lv('Phu Thê') === 'Cần thận trọng' ? 'Dành thời gian lắng nghe nhau, tránh để chuyện nhỏ thành lớn.' : 'Gia đạo khá êm, hợp cùng lên kế hoạch chung.'}`)
  if (j.love === 'Đã ly hôn' || j.love === 'Góa') out.push(`Giai đoạn chữa lành: cung Phúc Đức ("${lv('Phúc Đức')}") là điểm tựa tinh thần; tìm niềm vui từ sở thích, cộng đồng.`)
  if (j.children === 'Đang mong con') out.push(`Mong con: cung Tử Tức năm ${y} ở mức "${lv('Tử Nữ')}". ${['Rất tốt', 'Tốt'].includes(lv('Tử Nữ')) ? 'Tín hiệu khá thuận.' : 'Nên chăm sóc sức khỏe hai vợ chồng, kiên nhẫn.'}`)
  if (j.children === 'Đã có con') out.push(`Con cái: cung Tử Tức gốc ở mức "${levelOf(palaceScore(c, 'Tử Nữ'))}"; năm ${y} ở mức "${lv('Tử Nữ')}".`)
  return out
}

function readYearLite(c: Chart, year: number): Record<string, Level> {
  try {
    const r = readYear(c, year)
    return Object.fromEntries(r.items.map((i) => [i.palace, i.level]))
  } catch { return {} }
}
