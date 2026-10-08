// Thần sát ngày: tên Hán (từ lunar-javascript) -> tên Việt, trọng số và việc bị ảnh hưởng.
import type { Activity } from '../lib/dayPicker'

type Eff = { vi: string; w: number; only?: Activity[]; note?: string }

export const CAT_THAN: Record<string, Eff> = {
  天德: { vi: 'Thiên Đức', w: 2 }, 月德: { vi: 'Nguyệt Đức', w: 2 }, 天德合: { vi: 'Thiên Đức Hợp', w: 1.5 },
  月德合: { vi: 'Nguyệt Đức Hợp', w: 1.5 }, 天赦: { vi: 'Thiên Xá', w: 2.5 }, 天恩: { vi: 'Thiên Ân', w: 1 },
  天愿: { vi: 'Thiên Nguyện', w: 1.5 }, 母仓: { vi: 'Mẫu Thương', w: 1, only: ['khaitruong', 'dongtho', 'tongquat'] },
  三合: { vi: 'Tam Hợp', w: 1 }, 六合: { vi: 'Lục Hợp', w: 1, only: ['cuoihoi', 'khaitruong', 'tongquat'] },
  天喜: { vi: 'Thiên Hỷ', w: 1.5, only: ['cuoihoi', 'tongquat'] }, 不将: { vi: 'Bất Tương', w: 1.5, only: ['cuoihoi'], note: 'ngày tốt cho cưới gả' },
  益后: { vi: 'Ích Hậu', w: 1, only: ['cuoihoi'] }, 续世: { vi: 'Tục Thế', w: 1, only: ['cuoihoi'] },
  天医: { vi: 'Thiên Y', w: 0.5 }, 生气: { vi: 'Sinh Khí', w: 1, only: ['dongtho', 'tongquat'] },
  驿马: { vi: 'Dịch Mã', w: 1.5, only: ['xuathanh'] }, 天马: { vi: 'Thiên Mã', w: 1.5, only: ['xuathanh'] },
  五富: { vi: 'Ngũ Phú', w: 1.5, only: ['khaitruong'] }, 天仓: { vi: 'Thiên Thương', w: 1, only: ['khaitruong'] },
  金堂: { vi: 'Kim Đường', w: 1, only: ['khaitruong', 'dongtho'] }, 宝光: { vi: 'Bảo Quang', w: 1 },
  解神: { vi: 'Giải Thần', w: 0.5 }, 福生: { vi: 'Phúc Sinh', w: 1 }, 福德: { vi: 'Phúc Đức', w: 1 },
  月恩: { vi: 'Nguyệt Ân', w: 1 }, 四相: { vi: 'Tứ Tướng', w: 0.5 }, 时德: { vi: 'Thời Đức', w: 0.5 },
  阳德: { vi: 'Dương Đức', w: 0.5 }, 阴德: { vi: 'Âm Đức', w: 0.5 }, 圣心: { vi: 'Thánh Tâm', w: 0.5 },
  要安: { vi: 'Yếu An', w: 0.5 }, 玉宇: { vi: 'Ngọc Vũ', w: 0.5 }, 普护: { vi: 'Phổ Hộ', w: 0.5 },
}

export const HUNG_SAT: Record<string, Eff> = {
  月破: { vi: 'Nguyệt Phá', w: -3, note: 'trăm việc nên tránh' }, 大耗: { vi: 'Đại Hao', w: -2, only: ['khaitruong', 'tongquat', 'cuoihoi'] },
  小耗: { vi: 'Tiểu Hao', w: -1, only: ['khaitruong'] }, 四耗: { vi: 'Tứ Hao', w: -1, only: ['khaitruong'] },
  天贼: { vi: 'Thiên Tặc', w: -1.5, only: ['khaitruong', 'xuathanh'] }, 天罡: { vi: 'Thiên Cương', w: -1.5 },
  河魁: { vi: 'Hà Khôi', w: -1.5 }, 月煞: { vi: 'Nguyệt Sát', w: -1.5 }, 劫煞: { vi: 'Kiếp Sát', w: -1.5 },
  灾煞: { vi: 'Tai Sát', w: -1.5 }, 大煞: { vi: 'Đại Sát', w: -1 }, 死神: { vi: 'Tử Thần', w: -1 }, 致死: { vi: 'Trí Tử', w: -1 },
  往亡: { vi: 'Vãng Vong', w: -3, only: ['xuathanh', 'khaitruong'], note: 'kỵ đi xa, nhậm chức' },
  归忌: { vi: 'Quy Kỵ', w: -2, only: ['xuathanh', 'cuoihoi'], note: 'kỵ đi xa, đón dâu về' },
  天火: { vi: 'Thiên Hỏa', w: -2, only: ['dongtho'], note: 'kỵ lợp mái, làm nhà' }, 地火: { vi: 'Địa Hỏa', w: -2, only: ['dongtho'] },
  土府: { vi: 'Thổ Phủ', w: -2, only: ['dongtho'], note: 'kỵ động thổ' }, 土符: { vi: 'Thổ Phù', w: -2, only: ['dongtho'], note: 'kỵ động thổ' },
  地囊: { vi: 'Địa Nang', w: -2, only: ['dongtho'] }, 阴错: { vi: 'Âm Thác', w: -2, only: ['cuoihoi'] }, 阳错: { vi: 'Dương Thác', w: -2, only: ['cuoihoi'] },
  孤辰: { vi: 'Cô Thần', w: -1.5, only: ['cuoihoi'] }, 五离: { vi: 'Ngũ Ly', w: -1.5, only: ['cuoihoi', 'khaitruong'] },
  四废: { vi: 'Tứ Phế', w: -2, note: 'ngày khí suy, việc khó thành' }, 五墓: { vi: 'Ngũ Mộ', w: -1 },
  重日: { vi: 'Trùng Nhật', w: -1, only: ['cuoihoi'], note: 'kỵ việc hiếu' }, 复日: { vi: 'Phục Nhật', w: -0.5 },
  九空: { vi: 'Cửu Không', w: -1, only: ['khaitruong'] }, 天狗: { vi: 'Thiên Cẩu', w: -1 }, 血忌: { vi: 'Huyết Kỵ', w: -0.5 },
  月厌: { vi: 'Nguyệt Yếm', w: -1, only: ['cuoihoi', 'xuathanh'] }, 大时: { vi: 'Đại Thời', w: -1 }, 天吏: { vi: 'Thiên Lại', w: -1 },
}

/** Thọ Tử theo tháng âm (chi ngày). */
export const THO_TU: Record<number, string> = { 1: 'Tuất', 2: 'Thìn', 3: 'Hợi', 4: 'Tỵ', 5: 'Tý', 6: 'Ngọ', 7: 'Sửu', 8: 'Mùi', 9: 'Dần', 10: 'Thân', 11: 'Mão', 12: 'Dậu' }
