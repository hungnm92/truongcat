// Cách cục Tử Vi phổ biến: điều kiện nhận diện + diễn giải (biên soạn riêng).
import type { IFunctionalPalace as Palace } from 'iztro/lib/astro/FunctionalPalace'
import type { Chart } from '../lib/chart'

export interface PatternHit { name: string; tone: 'cat' | 'hung' | 'binh'; text: string }

const BRIGHT = ['Miếu', 'Vượng', 'Đắc']
const DIMS = ['Hạn', 'Hãm']

function names(p: Palace): Set<string> {
  return new Set<string>([...p.majorStars, ...p.minorStars, ...(p.adjectiveStars ?? [])].map((s) => String(s.name)))
}
function mutagens(p: Palace) {
  return [...p.majorStars, ...p.minorStars].filter((s) => s.mutagen).map((s) => s.mutagen as string)
}

export function detectPatterns(c: Chart): PatternHit[] {
  const P = (n: string) => c.palaces.find((p) => p.name === n)!
  const menh = P('Mệnh')
  const br = String(menh.earthlyBranch)
  const M = names(menh)
  const sp = c.astro.surroundedPalaces('Mệnh' as never)
  const tp = [sp.target, sp.opposite, sp.wealth, sp.career]
  const TP = new Set(tp.flatMap((p) => [...names(p)]))
  const tpMut = tp.flatMap(mutagens)
  const left = c.palaces[(menh.index + 11) % 12], right = c.palaces[(menh.index + 1) % 12]
  const flank = (a: string, b: string) => (names(left).has(a) && names(right).has(b)) || (names(left).has(b) && names(right).has(a))
  const starAt = (n: string) => c.palaces.find((p) => names(p).has(n))
  const brightOf = (n: string) => [...c.palaces].flatMap((p) => p.majorStars).find((s) => s.name === n)?.brightness ?? ''
  const vcd = menh.majorStars.length === 0
  const out: PatternHit[] = []
  const add = (cond: boolean, name: string, tone: PatternHit['tone'], text: string) => { if (cond) out.push({ name, tone, text }) }

  add(M.has('Tử Vi') && M.has('Thiên Phủ'), 'Tử Phủ đồng cung', 'cat', 'Hai sao đế – khố cùng ngồi Mệnh: vừa có tầm nhìn vừa biết giữ của, hợp làm chủ một cơ ngơi ổn định.')
  add(TP.has('Thiên Phủ') && TP.has('Thiên Tướng') && !M.has('Tử Vi'), 'Phủ Tướng triều viên', 'cat', 'Thiên Phủ, Thiên Tướng chầu về Mệnh: được người tin cậy, đường công danh và tài sản vững dần.')
  add(['Thất Sát', 'Phá Quân', 'Tham Lang'].some((s) => M.has(s)), 'Sát Phá Tham', 'binh', 'Mệnh thuộc bộ Sát – Phá – Tham: đời nhiều thay đổi, mạnh ở khai phá và ứng biến; cần kỷ luật để biến động thành cơ hội.')
  add(['Thiên Cơ', 'Thái Âm', 'Thiên Đồng', 'Thiên Lương'].every((s) => TP.has(s)), 'Cơ Nguyệt Đồng Lương', 'cat', 'Bộ sao văn – lại hội Mệnh: hợp làm việc trong tổ chức, công vụ, giáo dục, chuyên môn; ổn định hơn mạo hiểm.')
  add(M.has('Cự Môn') && M.has('Thái Dương'), 'Cự Nhật đồng cung', 'cat', 'Cự Môn gặp Thái Dương: lời nói có sức nặng, hợp nghề giảng dạy, truyền thông, ngoại giao; danh đến từ tiếng nói.')
  add(M.has('Thái Dương') && M.has('Thái Âm'), 'Nhật Nguyệt đồng cung', 'binh', 'Mặt trời, mặt trăng cùng cung: tính cách hai mặt, lúc sôi nổi lúc trầm lắng; nên dung hòa cả hai thay vì giằng co.')
  add(TP.has('Thái Dương') && TP.has('Thái Âm') && BRIGHT.includes(brightOf('Thái Dương')) && BRIGHT.includes(brightOf('Thái Âm')), 'Nhật Nguyệt tịnh minh', 'cat', 'Nhật và Nguyệt cùng sáng chiếu Mệnh: trí tuệ sáng suốt, danh lợi song toàn nếu biết dùng.')
  add(TP.has('Thái Dương') && TP.has('Thái Âm') && DIMS.includes(brightOf('Thái Dương')) && DIMS.includes(brightOf('Thái Âm')), 'Nhật Nguyệt phản bối', 'hung', 'Nhật Nguyệt cùng mờ: phải tự thân vất vả nhiều, nên rời quê lập nghiệp và kiên nhẫn đến trung vận.')
  add(vcd && br === 'Mùi' && String(starAt('Thái Dương')?.earthlyBranch) === 'Mão' && String(starAt('Thái Âm')?.earthlyBranch) === 'Hợi', 'Minh Châu xuất hải', 'cat', 'Mệnh Mùi vô chính diệu, Nhật ở Mão, Nguyệt ở Hợi chiếu về: cách quý hiếm, tài năng như ngọc gặp ánh sáng.')
  add(M.has('Cự Môn') && ['Tý', 'Ngọ'].includes(br), 'Thạch trung ẩn ngọc', 'cat', 'Cự Môn tại Tý/Ngọ: ngọc trong đá, tài năng cần thời gian mài giũa, càng về sau càng sáng.')
  add(M.has('Thiên Lương') && br === 'Ngọ', 'Thọ tinh nhập miếu', 'cat', 'Thiên Lương ở Ngọ: chính trực, được kính trọng, phúc thọ dày.')
  add(M.has('Thất Sát') && ['Dần', 'Thân', 'Tý', 'Ngọ'].includes(br), 'Thất Sát triều đẩu', 'cat', 'Thất Sát đắc địa chầu Đẩu: uy dũng, có cơ hội lập nghiệp lớn khi dám nắm thời.')
  add(M.has('Tử Vi') && M.has('Phá Quân'), 'Tử Phá đồng cung', 'binh', 'Tử Vi gặp Phá Quân: có chí cải cách nhưng dễ nóng vội; cần người cố vấn điềm tĩnh.')
  add(M.has('Liêm Trinh') && M.has('Thất Sát'), 'Liêm Sát đồng cung', 'binh', 'Liêm Trinh gặp Thất Sát: cương quyết, chịu khó, hợp nghề kỷ luật; tránh nóng nảy.')
  add(M.has('Vũ Khúc') && M.has('Tham Lang'), 'Vũ Tham đồng hành', 'binh', 'Vũ Khúc gặp Tham Lang: tài lộc đến muộn, tuổi trung niên mới phát; trẻ nên tích lũy kỹ năng.')
  add(M.has('Cự Môn') && M.has('Thiên Cơ') && ['Mão', 'Dậu'].includes(br), 'Cự Cơ đồng lâm', 'cat', 'Cự Cơ ở Mão/Dậu: mưu trí, ăn nói hay, hợp kinh doanh và chuyên môn sâu.')
  add(M.has('Tham Lang') && (M.has('Hỏa Tinh') || M.has('Linh Tinh')), 'Tham Hỏa / Tham Linh', 'cat', 'Tham Lang gặp Hỏa/Linh: có cơ hội phát nhanh bất ngờ; nhớ giữ lại thành quả vì đến nhanh dễ đi nhanh.')
  const locMa = ['Mệnh', 'Tài Bạch', 'Thiên Di', 'Quan Lộc'].some((n) => { const s = names(P(n)); return s.has('Thiên Mã') && (s.has('Lộc Tồn') || mutagens(P(n)).includes('Lộc')) })
  add(locMa, 'Lộc Mã giao trì', 'cat', 'Lộc gặp Thiên Mã ở cung trọng yếu: tiền tài gắn với di chuyển, buôn bán, làm ăn xa.')
  add(['Lộc', 'Quyền', 'Khoa'].every((m) => tpMut.includes(m)), 'Tam kỳ gia hội', 'cat', 'Hóa Lộc, Quyền, Khoa đều hội Mệnh: tài – quyền – danh đủ cả, cách rất đẹp.')
  add(TP.has('Lộc Tồn') && tpMut.includes('Lộc'), 'Song Lộc', 'cat', 'Lộc Tồn và Hóa Lộc cùng hội: hai nguồn tài lộc, kinh tế vững.')
  add(flank('Tả Phù', 'Hữu Bật'), 'Tả Hữu giáp Mệnh', 'cat', 'Tả Phù, Hữu Bật kẹp hai bên Mệnh: luôn có người giúp sức, ít khi cô độc.')
  add(M.has('Tả Phù') && M.has('Hữu Bật'), 'Tả Hữu đồng cung', 'cat', 'Tả Hữu cùng ngồi Mệnh: được nâng đỡ, giỏi tập hợp người.')
  add(flank('Văn Xương', 'Văn Khúc'), 'Xương Khúc giáp Mệnh', 'cat', 'Văn Xương, Văn Khúc kẹp Mệnh: học hành, thi cử, chữ nghĩa thuận lợi.')
  add(M.has('Văn Xương') && M.has('Văn Khúc') && ['Sửu', 'Mùi'].includes(br), 'Văn Quế Văn Hoa', 'cat', 'Xương Khúc đồng cung ở Sửu/Mùi: tài hoa, văn chương xuất sắc.')
  add((M.has('Thiên Khôi') && names(sp.opposite).has('Thiên Việt')) || (M.has('Thiên Việt') && names(sp.opposite).has('Thiên Khôi')), 'Tọa quý hướng quý', 'cat', 'Khôi – Việt ở Mệnh và Thiên Di: đi đâu cũng có quý nhân dìu dắt.')
  add(flank('Kình Dương', 'Đà La'), 'Kình Đà giáp Mệnh', 'hung', 'Kình Dương, Đà La kẹp Mệnh: hay bị áp lực hai phía; giữ bình tĩnh, tránh tranh chấp.')
  add((M.has('Địa Không') && M.has('Địa Kiếp')) || flank('Địa Không', 'Địa Kiếp'), 'Không Kiếp ở/giáp Mệnh', 'hung', 'Địa Không, Địa Kiếp: ý tưởng khác người nhưng dễ hao tán; nên đầu tư thận trọng, hợp nghề sáng tạo, tôn giáo, kỹ thuật.')
  add(M.has('Kình Dương') && br === 'Ngọ', 'Mã đầu đới kiếm', 'binh', 'Kình Dương ở Ngọ: uy vũ biên cương, hợp nghề mạo hiểm có kỷ luật; tránh liều lĩnh.')
  add(mutagens(menh).includes('Kỵ'), 'Hóa Kỵ thủ Mệnh', 'hung', 'Hóa Kỵ đóng Mệnh: hay ôm một mối bận tâm, dễ tự làm khó mình; bù lại rất bền bỉ khi đã quyết.')
  add(vcd && (M.has('Tuần Không') || M.has('Triệt Lộ')), 'Vô chính diệu đắc Tuần Triệt', 'cat', 'Mệnh vô chính diệu gặp Tuần/Triệt: theo quan niệm truyền thống lại thành tốt, đời khởi đầu chậm nhưng vững về sau.')
  add(vcd && !M.has('Tuần Không') && !M.has('Triệt Lộ'), 'Mệnh vô chính diệu', 'binh', 'Mệnh không có chính tinh: tính cách linh hoạt, chịu ảnh hưởng môi trường; nên chọn nơi chốn và bạn bè tốt.')
  return out
}

// Ánh xạ chính tinh -> nhóm nghề phù hợp (dùng với "Hành trình nhân sinh").
export const STAR_FIELDS: Record<string, string[]> = {
  'Tử Vi': ['Hành chính', 'Kinh doanh', 'Công sở'], 'Thiên Cơ': ['Kỹ thuật', 'Giáo dục', 'Công sở'],
  'Thái Dương': ['Giáo dục', 'Hành chính', 'Sáng tạo'], 'Vũ Khúc': ['Kinh doanh', 'Kỹ thuật'],
  'Thiên Đồng': ['Sáng tạo', 'Y tế', 'Công sở'], 'Liêm Trinh': ['Hành chính', 'Kinh doanh'],
  'Thiên Phủ': ['Công sở', 'Kinh doanh', 'Hành chính'], 'Thái Âm': ['Sáng tạo', 'Kinh doanh', 'Y tế'],
  'Tham Lang': ['Kinh doanh', 'Sáng tạo', 'Lao động tự do'], 'Cự Môn': ['Giáo dục', 'Kinh doanh', 'Hành chính'],
  'Thiên Tướng': ['Công sở', 'Hành chính', 'Y tế'], 'Thiên Lương': ['Y tế', 'Giáo dục', 'Hành chính'],
  'Thất Sát': ['Kỹ thuật', 'Kinh doanh', 'Lao động tự do'], 'Phá Quân': ['Kỹ thuật', 'Sáng tạo', 'Lao động tự do'],
}
