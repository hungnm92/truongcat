import { describe, expect, it } from 'vitest'
import { buildChart, NO_JOURNEY, timeIndexOf, validateBirth, type BirthInput } from '../lib/chart'
import { dayInfo } from '../lib/calendar'
import { batTrach, cungPhi, huyenKhong, sonOfDegree } from '../lib/fengshui'
import { interpret, type LineValue } from '../lib/iching'
import { buildOverview, readPalace, readYear } from '../lib/readings'
import { rateDay } from '../lib/dayPicker'

const base: BirthInput = {
  name: 'Thử', day: 15, month: 6, year: 1990, hour: 10, minute: 30, gender: 'Nam', province: 'Hà Nội',
  viewYear: 2026, solarAdjust: false, journey: NO_JOURNEY,
}

describe('lịch', () => {
  it('7/10/2026 là Giáp Dần, tháng Đinh Dậu, năm Bính Ngọ, Đại Khê Thủy, trực Chấp', () => {
    const d = dayInfo(2026, 10, 7)
    expect(d.lunar.dayGZ).toBe('Giáp Dần')
    expect(d.lunar.monthGZ).toBe('Đinh Dậu')
    expect(d.lunar.yearGZ).toBe('Bính Ngọ')
    expect(d.napAm).toBe('Đại Khê Thủy')
    expect(d.truc).toBe('Chấp')
    expect(d.lunar.m).toBe(8)
    expect(d.lunar.d).toBe(27)
  })
  it('chấm điểm ngày không lỗi', () => {
    expect(rateDay(2026, 10, 7, 'cuoihoi', 'Ngọ').level).toBeTruthy()
  })
})

describe('lá số', () => {
  it('chỉ số giờ', () => {
    expect([0, 1, 5, 11, 22, 23].map(timeIndexOf)).toEqual([0, 1, 3, 6, 11, 12])
    expect(timeIndexOf(10)).toBe(5)
  })
  it('15/06/1990 10:30 nam: Mệnh Sửu, Hỏa Lục Cục, Lộ Bàng Thổ', () => {
    const c = buildChart(base)
    expect(c.astro.earthlyBranchOfSoulPalace).toBe('Sửu')
    expect(c.astro.fiveElementsClass).toBe('Hỏa Lục Cục')
    expect(c.napAm).toBe('Lộ Bàng Thổ')
    const menh = c.palaces.find((p) => p.name === 'Mệnh')!
    expect(menh.majorStars.map((s) => s.name)).toEqual(['Thái Dương', 'Thái Âm'])
  })
  it('đọc cung, tổng quan, vận hạn chạy được', () => {
    const c = buildChart(base)
    expect(readPalace(c, 'Thiên Di').vcd).toBe(true)
    expect(buildOverview(c).summary.length).toBeGreaterThan(20)
    expect(readYear(c, 2026).items).toHaveLength(12)
  })
  it('kiểm tra ngày không tồn tại', () => {
    expect(validateBirth({ ...base, day: 31, month: 2 })).toMatch(/chỉ có 28/)
    expect(validateBirth(base)).toBeNull()
  })
})

describe('phong thủy', () => {
  it('24 sơn theo độ', () => {
    expect(sonOfDegree(0)).toBe('Tý')
    expect(sonOfDegree(180)).toBe('Ngọ')
    expect(sonOfDegree(90)).toBe('Mão')
    expect(sonOfDegree(270)).toBe('Dậu')
    expect(sonOfDegree(359)).toBe('Tý')
    expect(sonOfDegree(337.6)).toBe('Nhâm')
  })
  it('cung phi: nam 1990 = Khôn? (11-1=10→1 Khảm); nữ 1990 = 4+1=5 → Cấn', () => {
    expect(cungPhi(1990, 'Nam')).toBe('Khảm')
    expect(cungPhi(1990, 'Nữ')).toBe('Cấn')
    expect(cungPhi(1984, 'Nam')).toBe('Đoài')
  })
  it('bát trạch Càn: Sinh Khí Đoài, Thiên Y Cấn, Diên Niên Khôn, Tuyệt Mệnh Ly, Ngũ Quỷ Chấn, Lục Sát Khảm, Họa Hại Tốn', () => {
    const t = batTrach('Càn')
    expect(t['Sinh Khí'].quai).toBe('Đoài')
    expect(t['Thiên Y'].quai).toBe('Cấn')
    expect(t['Diên Niên'].quai).toBe('Khôn')
    expect(t['Tuyệt Mệnh'].quai).toBe('Ly')
    expect(t['Ngũ Quỷ'].quai).toBe('Chấn')
    expect(t['Lục Sát'].quai).toBe('Khảm')
    expect(t['Họa Hại'].quai).toBe('Tốn')
    expect(batTrach('Khảm')['Sinh Khí'].quai).toBe('Tốn')
  })
  it('huyền không vận 9 tọa Tý hướng Ngọ: sao vận trung cung là 9', () => {
    const h = huyenKhong(0)
    expect(h.cells.C.van).toBe(9)
    expect(h.cells.NW.van).toBe(1)
    expect(h.cells.S.van).toBe(4)
    for (const c of Object.values(h.cells)) {
      expect(c.son).toBeGreaterThanOrEqual(1)
      expect(c.huong).toBeLessThanOrEqual(9)
    }
  })
})

describe('lục hào', () => {
  it('Thế/Ứng và cung của quẻ Thiên Địa Bĩ (Càn cung, Tam Thế)', () => {
    // Bĩ: hạ Khôn (000), thượng Càn (111)  => hào 1-3 âm (8), 4-6 dương (7)
    const v: LineValue[] = [8, 8, 8, 7, 7, 7]
    const r = interpret('Công việc có thuận không?', v, new Date(2026, 9, 7, 10))
    expect(r.main.name).toBe('Thiên Địa Bĩ')
    expect(r.cung.tri).toBe('Càn')
    expect(r.cung.kind).toBe('Tam Thế')
    expect(r.lines.find((l) => l.the)!.pos).toBe(3)
    expect(r.lines.find((l) => l.ung)!.pos).toBe(6)
    expect(r.changed).toBeNull()
  })
  it('quẻ Thuần Càn có Thế ở hào 6; hào động đổi quẻ', () => {
    const r = interpret('tiền bạc', [9, 7, 7, 7, 7, 7], new Date(2026, 9, 7, 10))
    expect(r.main.name).toBe('Thuần Càn')
    expect(r.lines.find((l) => l.the)!.pos).toBe(6)
    expect(r.changed?.name).toBe('Thiên Phong Cấu')
    expect(r.topic.dung).toBe('Thê Tài')
  })
})

describe('nhận diện chủ đề quẻ', () => {
  const dung = (q: string, g?: 'Nam' | 'Nữ') => interpret(q, [7, 7, 7, 7, 7, 7], new Date(2026, 9, 7, 10), g).topic.dung
  it('có dấu và không dấu', () => {
    expect(dung('Công việc năm nay có thuận lợi không?')).toBe('Quan Quỷ')
    expect(dung('Cong viec nam nay co thuan loi khong?')).toBe('Quan Quỷ')
    expect(dung('Tôi có nên đầu tư chứng khoán?')).toBe('Thê Tài')
    expect(dung('Con tôi thi đỗ không?')).toBe('Quan Quỷ')
    expect(dung('Chuyện gì sẽ xảy ra')).toBe('Thế')
  })
  it('tình cảm: nữ xem Quan Quỷ, nam xem Thê Tài', () => {
    expect(dung('Tình cảm của tôi ra sao', 'Nữ')).toBe('Quan Quỷ')
    expect(dung('Tình cảm của tôi ra sao', 'Nam')).toBe('Thê Tài')
  })
})

describe('cách cục huyền không', () => {
  it('Tý sơn Ngọ hướng vận 9: sơn 9 và hướng 9 cùng ở cung tọa', () => {
    const h = huyenKhong(0)
    expect(h.tonSon).toBe('Tý')
    expect(h.huong).toBe('Ngọ')
    expect(h.cells.N.son).toBe(9)
    expect(h.cells.N.huong).toBe(9)
    expect(h.pattern).toMatch(/Song tinh hội tọa/)
  })
})

import { qimenChart } from '../lib/qimen'
describe('kỳ môn', () => {
  it('bàn đủ 8 sao, 8 cửa, 8 thần khác nhau', () => {
    const c = qimenChart(new Date(2026, 9, 7, 15, 10))
    const outer = [1, 2, 3, 4, 6, 7, 8, 9].map((p) => c.cells[p])
    expect(new Set(outer.map((x) => x.star)).size).toBe(8)
    expect(new Set(outer.map((x) => x.door)).size).toBe(8)
    expect(new Set(outer.map((x) => x.god)).size).toBe(8)
    expect(c.duong).toBe(false) // sau Hạ chí, trước Đông chí
    expect(c.jieqi).toBe('Thu Phân')
  })
  it('trực phù đóng tại cung có can giờ trên địa bàn', () => {
    const c = qimenChart(new Date(2026, 9, 7, 15, 10))
    const hourStem = c.hourGZ.split(' ')[0]
    const stem = hourStem === 'Giáp' ? c.tuanThu : hourStem
    const p = [1, 2, 3, 4, 6, 7, 8, 9].find((k) => c.cells[k].earth === stem) ?? 2
    expect(c.cells[p].star).toBe(c.trucPhu)
    expect(c.cells[p].god).toBe('Trực Phù')
  })
  it('giờ Giáp luôn phục ngâm', () => {
    // 2026-10-07 là ngày Giáp Dần → giờ Tý (0h) là Giáp Tý
    const c = qimenChart(new Date(2026, 9, 7, 0, 30))
    expect(c.hourGZ.startsWith('Giáp')).toBe(true)
    expect(c.patterns.some((p) => p.includes('phục ngâm'))).toBe(true)
  })
  it('dương độn sau Đông chí', () => {
    expect(qimenChart(new Date(2026, 11, 25, 9)).duong).toBe(true)
  })
})

import { detectPatterns } from '../data/patterns'
import { personalAdvice } from '../lib/readings'
describe('cách cục và cá nhân hóa', () => {
  it('lá số mẫu có Nhật Nguyệt đồng cung (Mệnh Sửu có Thái Dương, Thái Âm)', () => {
    const names = detectPatterns(buildChart(base)).map((p) => p.name)
    expect(names).toContain('Nhật Nguyệt đồng cung')
  })
  it('lời luận cung dùng câu riêng theo sao', () => {
    const r = readPalace(buildChart(base), 'Quan Lộc')
    expect(r.paragraphs.join(' ')).toMatch(/Thiên Lương/)
  })
  it('lời khuyên theo hoàn cảnh', () => {
    const c = buildChart({ ...base, journey: { love: 'Đang yêu', children: '', field: 'Giáo dục', stage: 'Đang chuyển hướng' } })
    const a = personalAdvice(c)
    expect(a.length).toBe(3)
    expect(a[0]).toMatch(/Giáo dục/)
  })
})

import { annualStar, kiemDo, vanOfYear } from '../lib/fengshui'
describe('huyền không nâng cao', () => {
  it('sao lưu niên: 2024 Tam Bích, 2025 Nhị Hắc, 2026 Nhất Bạch, 2027 Cửu Tử', () => {
    expect([2024, 2025, 2026, 2027].map(annualStar)).toEqual([3, 2, 1, 9])
  })
  it('vận theo năm xây', () => {
    expect([1995, 2010, 2024, 2030].map(vanOfYear)).toEqual([7, 8, 9, 9])
  })
  it('kiêm hướng > 4.5° thì dùng thế quái và đổi sao nhập trung', () => {
    expect(kiemDo(0)).toBe(0)
    expect(kiemDo(6)).toBe(6)
    const chinh = huyenKhong(0, 9, 2026), kiem = huyenKhong(6, 9, 2026)
    expect(chinh.theQuai).toBe(false)
    expect(kiem.theQuai).toBe(true)
    expect(kiem.tonSon).toBe('Tý')
  })
})

import { coinBacksToLine, timeLines } from '../lib/iching'
describe('lục hào – đối chiếu quẻ mẫu hocvienlyso (23/9/2025 11:12, Bát Thuần Khôn → Lôi Sơn Tiểu Quá)', () => {
  const r = interpret('Bán nhà', [8, 8, 6, 6, 8, 8], new Date(2025, 8, 23, 11, 12), 'Nam')
  const L = (pos: number) => r.lines[pos - 1]
  it('thông tin thời gian', () => {
    expect(r.ngayThang.hourGZ).toBe('Nhâm Ngọ')
    expect(r.ngayThang.dayGZ).toBe('Ất Mùi')
    expect(r.ngayThang.monthGZ).toBe('Ất Dậu')
    expect(r.ngayThang.yearGZ).toBe('Ất Tỵ')
    expect(r.ngayThang.jieqi).toBe('Thu Phân')
    expect(r.ngayThang.tuanKhong).toEqual(['Thìn', 'Tỵ'])
  })
  it('quẻ chủ và quẻ biến', () => {
    expect(r.main.name).toBe('Thuần Khôn')
    expect(r.main.xungHop).toBe('Lục xung')
    expect(r.changed?.name).toBe('Lôi Sơn Tiểu Quá')
    expect(r.changed?.cung).toBe('Đoài')
    expect(r.changed?.kind).toBe('Du Hồn')
  })
  it('can chi, lục thân, vượng suy, thế ứng của quẻ chủ', () => {
    expect([6, 5, 4, 3, 2, 1].map((p) => `${L(p).can} ${L(p).chi}`)).toEqual(['Quý Dậu', 'Quý Hợi', 'Quý Sửu', 'Ất Mão', 'Ất Tỵ', 'Ất Mùi'])
    expect([6, 5, 4, 3, 2, 1].map((p) => L(p).lucThan)).toEqual(['Tử Tôn', 'Thê Tài', 'Huynh Đệ', 'Quan Quỷ', 'Phụ Mẫu', 'Huynh Đệ'])
    expect([6, 5, 4, 3, 2, 1].map((p) => L(p).vuongSuy)).toEqual(['Vượng', 'Tướng', 'Hưu', 'Tử', 'Tù', 'Hưu'])
    expect(L(6).the).toBe(true)
    expect(L(3).ung).toBe(true)
    expect(L(2).tuanKhong).toBe(true)
  })
  it('quái thân Hợi, lộc Mão, mã Tỵ', () => {
    expect(L(5).quaiThan).toBe(true)
    expect(L(3).loc).toBe(true)
    expect(L(2).ma).toBe(true)
    expect(r.lines.filter((l) => l.quy || l.dao)).toHaveLength(0)
  })
  it('quẻ biến: can chi, lục thân theo cung Khôn, vượng suy, tuần không, quý nhân', () => {
    const c = r.changedLines!
    expect([5, 4, 3, 2, 1, 0].map((i) => `${c[i].can} ${c[i].chi}`)).toEqual(['Canh Tuất', 'Canh Thân', 'Canh Ngọ', 'Bính Thân', 'Bính Ngọ', 'Bính Thìn'])
    expect([5, 4, 3, 2, 1, 0].map((i) => c[i].lucThan)).toEqual(['Huynh Đệ', 'Tử Tôn', 'Phụ Mẫu', 'Tử Tôn', 'Phụ Mẫu', 'Huynh Đệ'])
    expect([5, 4, 3, 2, 1, 0].map((i) => c[i].vuongSuy)).toEqual(['Hưu', 'Vượng', 'Tù', 'Vượng', 'Tù', 'Hưu'])
    expect(c[0].tuanKhong).toBe(true)
    expect(c[4].quy && c[2].quy).toBe(true)
  })
  it('lục thú', () => {
    expect(r.lines.map((l) => l.lucThu)).toEqual(['Thanh Long', 'Chu Tước', 'Câu Trần', 'Đằng Xà', 'Bạch Hổ', 'Huyền Vũ'])
  })
  it('chọn việc cần xem: bán nhà lấy Thê Tài', () => {
    expect(r.topic.dung).toBe('Thê Tài')
    expect(interpret('x', [8, 8, 6, 6, 8, 8], new Date(2025, 8, 23, 11, 12), 'Nam', 'nha-o').topic.dung).toBe('Phụ Mẫu')
  })
})

describe('phục thần, biến hào, cách lập quẻ', () => {
  it('Thiên Phong Cấu (Càn cung) thiếu Thê Tài → phục Dần dưới hào 2', () => {
    // Cấu: hạ Tốn (0,1,1), thượng Càn
    const r = interpret('tiền', [8, 7, 7, 7, 7, 7], new Date(2026, 9, 7, 10))
    expect(r.main.name).toBe('Thiên Phong Cấu')
    const p = r.lines.find((l) => l.phuc)
    expect(p?.phuc?.lucThan).toBe('Thê Tài')
    expect(p?.phuc?.chi).toBe('Dần')
    expect(p?.pos).toBe(2)
    expect(r.dungThan?.phuc).toBe(true)
  })
  it('xu: 1 lưng dương, 2 lưng âm, 3 lưng dương động, 0 lưng âm động', () => {
    expect([1, 2, 3, 0].map(coinBacksToLine)).toEqual([7, 8, 9, 6])
  })
  it('Mai Hoa theo thời gian luôn có đúng 1 hào động', () => {
    const t = timeLines(new Date(2026, 9, 9, 10, 0))
    expect(t.values.filter((v) => v === 6 || v === 9)).toHaveLength(1)
  })
})

import { compassDeg, dirOfDeg, houseCenter, nineGrid } from '../lib/plan'
describe('mặt bằng: tâm nhà, cửu cung, khuyết góc', () => {
  const frame = { x: 0, y: 0, w: 60, h: 118 } // nhà 6 x 11.8m, cửa ở cạnh dưới
  it('tâm hình chữ nhật', () => {
    expect(houseCenter(frame, [], 'rect')).toEqual({ x: 30, y: 59 })
  })
  it('trọng tâm lệch khỏi góc khuyết', () => {
    const c = houseCenter(frame, [{ x: 30, y: 0, w: 30, h: 20 }], 'centroid')
    expect(c.x).toBeLessThan(30)
    expect(c.y).toBeGreaterThan(59)
  })
  it('nhà hướng Nam (180°): cạnh dưới là Nam, cạnh trên là Bắc, bên trái là Tây, bên phải là Đông (như bản đồ)', () => {
    const ctr = { x: 30, y: 59 }
    expect(dirOfDeg(compassDeg({ x: 30, y: 118 }, ctr, 180))).toBe('S')
    expect(dirOfDeg(compassDeg({ x: 30, y: 0 }, ctr, 180))).toBe('N')
    expect(dirOfDeg(compassDeg({ x: 0, y: 59 }, ctr, 180))).toBe('W')
    expect(dirOfDeg(compassDeg({ x: 60, y: 59 }, ctr, 180))).toBe('E')
  })
  it('lưới 9 ô: ô giữa là trung cung, ô giữa-dưới là hướng nhà, ô khuyết được đo', () => {
    const g = nineGrid(frame, [{ x: 40, y: 0, w: 20, h: 118 / 3 }], { x: 30, y: 59 }, 60)
    expect(g[4].dir).toBe('C')
    expect(g[7].dir).toBe(dirOfDeg(60)) // hướng Dần (60°) thuộc Đông Bắc
    expect(g[2].missing).toBeCloseTo(1)
    expect(g[0].missing).toBe(0)
  })
})

describe('cửu cung theo hình nhà', () => {
  it('nhà dài hẹp hướng Dần: 8 ô ngoài là 8 phương vị khác nhau, hướng ở giữa cạnh trước, tọa ở giữa cạnh sau', () => {
    const g = nineGrid({ x: 0, y: 0, w: 400, h: 793 }, [], { x: 200, y: 396 }, 60)
    const outer = g.filter((c) => c.dir !== 'C').map((c) => c.dir)
    expect(new Set(outer).size).toBe(8)
    expect(g[7].dir).toBe('NE') // giữa cạnh trước = cung hướng
    expect(g[1].dir).toBe('SW') // giữa cạnh sau = cung tọa
    expect(g[6].dir).toBe('E') // góc trước bên trái
    expect(g[8].dir).toBe('N') // góc trước bên phải
  })
  it('nhà hướng Nam: bên trái là Tây, bên phải là Đông', () => {
    const g = nineGrid({ x: 0, y: 0, w: 60, h: 60 }, [], { x: 30, y: 30 }, 180)
    expect(g[3].dir).toBe('W')
    expect(g[5].dir).toBe('E')
  })
})
