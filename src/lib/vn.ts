// Bảng tra Hán -> Việt và dữ liệu địa phương dùng chung.

export const THIEN_CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'] as const
export const DIA_CHI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'] as const

const CAN_HAN = '甲乙丙丁戊己庚辛壬癸'
const CHI_HAN = '子丑寅卯辰巳午未申酉戌亥'

export const canHanToVi = (c: string) => THIEN_CAN[CAN_HAN.indexOf(c)] ?? c
export const chiHanToVi = (c: string) => DIA_CHI[CHI_HAN.indexOf(c)] ?? c
export const ganZhiToVi = (gz: string) => `${canHanToVi(gz[0])} ${chiHanToVi(gz[1])}`
export const chiIndex = (name: string) => DIA_CHI.indexOf(name as (typeof DIA_CHI)[number])

export const CHI_HANH: Record<string, Hanh> = {
  Tý: 'Thủy', Sửu: 'Thổ', Dần: 'Mộc', Mão: 'Mộc', Thìn: 'Thổ', Tỵ: 'Hỏa',
  Ngọ: 'Hỏa', Mùi: 'Thổ', Thân: 'Kim', Dậu: 'Kim', Tuất: 'Thổ', Hợi: 'Thủy',
}

export type Hanh = 'Kim' | 'Mộc' | 'Thủy' | 'Hỏa' | 'Thổ'
const SINH: Record<Hanh, Hanh> = { Kim: 'Thủy', Thủy: 'Mộc', Mộc: 'Hỏa', Hỏa: 'Thổ', Thổ: 'Kim' }
const KHAC: Record<Hanh, Hanh> = { Kim: 'Mộc', Mộc: 'Thổ', Thổ: 'Thủy', Thủy: 'Hỏa', Hỏa: 'Kim' }
export const hanhSinh = (a: Hanh, b: Hanh) => SINH[a] === b // a sinh b
export const hanhKhac = (a: Hanh, b: Hanh) => KHAC[a] === b // a khắc b

export const NA_AM: Record<string, string> = {
  海中金: 'Hải Trung Kim', 炉中火: 'Lư Trung Hỏa', 大林木: 'Đại Lâm Mộc', 路旁土: 'Lộ Bàng Thổ',
  剑锋金: 'Kiếm Phong Kim', 山头火: 'Sơn Đầu Hỏa', 涧下水: 'Giản Hạ Thủy', 城头土: 'Thành Đầu Thổ',
  白蜡金: 'Bạch Lạp Kim', 杨柳木: 'Dương Liễu Mộc', 泉中水: 'Tuyền Trung Thủy', 屋上土: 'Ốc Thượng Thổ',
  霹雳火: 'Tích Lịch Hỏa', 松柏木: 'Tùng Bách Mộc', 长流水: 'Trường Lưu Thủy', 砂中金: 'Sa Trung Kim',
  山下火: 'Sơn Hạ Hỏa', 平地木: 'Bình Địa Mộc', 壁上土: 'Bích Thượng Thổ', 金箔金: 'Kim Bạch Kim',
  覆灯火: 'Phúc Đăng Hỏa', 天河水: 'Thiên Hà Thủy', 大驿土: 'Đại Trạch Thổ', 钗钏金: 'Thoa Xuyến Kim',
  桑柘木: 'Tang Đố Mộc', 大溪水: 'Đại Khê Thủy', 沙中土: 'Sa Trung Thổ', 天上火: 'Thiên Thượng Hỏa',
  石榴木: 'Thạch Lựu Mộc', 大海水: 'Đại Hải Thủy',
}

export const TRUC: Record<string, string> = {
  建: 'Kiến', 除: 'Trừ', 满: 'Mãn', 平: 'Bình', 定: 'Định', 执: 'Chấp',
  破: 'Phá', 危: 'Nguy', 成: 'Thành', 收: 'Thu', 开: 'Khai', 闭: 'Bế',
}

export const THAN_SAT: Record<string, { name: string; hoangDao: boolean }> = {
  青龙: { name: 'Thanh Long', hoangDao: true }, 明堂: { name: 'Minh Đường', hoangDao: true },
  金匮: { name: 'Kim Quỹ', hoangDao: true }, 天德: { name: 'Thiên Đức', hoangDao: true },
  玉堂: { name: 'Ngọc Đường', hoangDao: true }, 司命: { name: 'Tư Mệnh', hoangDao: true },
  天刑: { name: 'Thiên Hình', hoangDao: false }, 朱雀: { name: 'Chu Tước', hoangDao: false },
  白虎: { name: 'Bạch Hổ', hoangDao: false }, 天牢: { name: 'Thiên Lao', hoangDao: false },
  玄武: { name: 'Huyền Vũ', hoangDao: false }, 勾陈: { name: 'Câu Trận', hoangDao: false },
}

export const TU: Record<string, string> = {
  角: 'Giác', 亢: 'Cang', 氐: 'Đê', 房: 'Phòng', 心: 'Tâm', 尾: 'Vĩ', 箕: 'Cơ', 斗: 'Đẩu', 牛: 'Ngưu',
  女: 'Nữ', 虚: 'Hư', 危: 'Nguy', 室: 'Thất', 壁: 'Bích', 奎: 'Khuê', 娄: 'Lâu', 胃: 'Vị', 昴: 'Mão',
  毕: 'Tất', 觜: 'Chủy', 参: 'Sâm', 井: 'Tỉnh', 鬼: 'Quỷ', 柳: 'Liễu', 星: 'Tinh', 张: 'Trương',
  翼: 'Dực', 轸: 'Chẩn',
}

export const THU = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']

export interface Province { name: string; lat: number; lng: number }

export const PROVINCES: Province[] = [
  ['An Giang', 10.52, 105.12], ['Bà Rịa - Vũng Tàu', 10.54, 107.24], ['Bắc Giang', 21.27, 106.19],
  ['Bắc Kạn', 22.15, 105.83], ['Bạc Liêu', 9.29, 105.72], ['Bắc Ninh', 21.19, 106.07],
  ['Bến Tre', 10.24, 106.38], ['Bình Định', 13.78, 109.22], ['Bình Dương', 11.0, 106.65],
  ['Bình Phước', 11.75, 106.72], ['Bình Thuận', 10.93, 108.1], ['Cà Mau', 9.18, 105.15],
  ['Cần Thơ', 10.03, 105.78], ['Cao Bằng', 22.67, 106.26], ['Đà Nẵng', 16.05, 108.2],
  ['Đắk Lắk', 12.67, 108.04], ['Đắk Nông', 12.0, 107.69], ['Điện Biên', 21.39, 103.02],
  ['Đồng Nai', 10.95, 106.82], ['Đồng Tháp', 10.46, 105.63], ['Gia Lai', 13.98, 108.0],
  ['Hà Giang', 22.82, 104.98], ['Hà Nam', 20.54, 105.91], ['Hà Nội', 21.03, 105.85],
  ['Hà Tĩnh', 18.34, 105.91], ['Hải Dương', 20.94, 106.33], ['Hải Phòng', 20.86, 106.68],
  ['Hậu Giang', 9.78, 105.47], ['Hòa Bình', 20.81, 105.34], ['Hưng Yên', 20.65, 106.05],
  ['Khánh Hòa', 12.24, 109.19], ['Kiên Giang', 10.01, 105.08], ['Kon Tum', 14.35, 108.0],
  ['Lai Châu', 22.4, 103.46], ['Lâm Đồng', 11.94, 108.44], ['Lạng Sơn', 21.85, 106.76],
  ['Lào Cai', 22.48, 103.97], ['Long An', 10.54, 106.41], ['Nam Định', 20.42, 106.17],
  ['Nghệ An', 18.67, 105.69], ['Ninh Bình', 20.25, 105.97], ['Ninh Thuận', 11.56, 108.99],
  ['Phú Thọ', 21.32, 105.4], ['Phú Yên', 13.09, 109.31], ['Quảng Bình', 17.47, 106.62],
  ['Quảng Nam', 15.57, 108.47], ['Quảng Ngãi', 15.12, 108.8], ['Quảng Ninh', 21.01, 107.29],
  ['Quảng Trị', 16.75, 107.19], ['Sóc Trăng', 9.6, 105.97], ['Sơn La', 21.33, 103.91],
  ['Tây Ninh', 11.31, 106.1], ['Thái Bình', 20.45, 106.34], ['Thái Nguyên', 21.59, 105.84],
  ['Thanh Hóa', 19.81, 105.78], ['Thừa Thiên Huế', 16.46, 107.59], ['Tiền Giang', 10.36, 106.36],
  ['TP. Hồ Chí Minh', 10.78, 106.7], ['Trà Vinh', 9.93, 106.34], ['Tuyên Quang', 21.82, 105.21],
  ['Vĩnh Long', 10.25, 105.97], ['Vĩnh Phúc', 21.3, 105.6], ['Yên Bái', 21.72, 104.9],
].map(([name, lat, lng]) => ({ name: name as string, lat: lat as number, lng: lng as number }))

export const pad2 = (n: number) => String(n).padStart(2, '0')
