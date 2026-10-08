// 64 quẻ Kinh Dịch: tên và ý chính do Trường Cát Mệnh Lý tự diễn giải.
export type Tri = 'Càn' | 'Đoài' | 'Ly' | 'Chấn' | 'Tốn' | 'Khảm' | 'Cấn' | 'Khôn'
export const TRIGRAMS: Tri[] = ['Càn', 'Đoài', 'Ly', 'Chấn', 'Tốn', 'Khảm', 'Cấn', 'Khôn']

// [thượng][hạ] -> [số thứ tự, tên, ý chính, mức: 2 tốt, 1 khá, 0 bình, -1 trở ngại]
type H = [number, string, string, number]
const T: Record<Tri, Record<Tri, H>> = {
  Càn: {
    Càn: [1, 'Thuần Càn', 'Sức mạnh và sáng tạo ở đỉnh cao; tiến lên nhưng giữ khiêm tốn', 2],
    Đoài: [10, 'Thiên Trạch Lý', 'Bước đi giữa nguy hiểm mà an toàn nhờ giữ lễ và cẩn trọng', 1],
    Ly: [13, 'Thiên Hỏa Đồng Nhân', 'Hợp sức với người cùng chí hướng, việc chung thành công', 2],
    Chấn: [25, 'Thiên Lôi Vô Vọng', 'Thuận tự nhiên, đừng toan tính quá; mưu cầu bất chính sẽ hỏng', 1],
    Tốn: [44, 'Thiên Phong Cấu', 'Gặp gỡ bất ngờ; cẩn thận người hoặc việc xen vào', -1],
    Khảm: [6, 'Thiên Thủy Tụng', 'Tranh chấp, kiện tụng; nên hòa giải sớm', -1],
    Cấn: [33, 'Thiên Sơn Độn', 'Lùi lại đúng lúc để bảo toàn lực', 0],
    Khôn: [12, 'Thiên Địa Bĩ', 'Bế tắc, trên dưới không thông; chờ thời, giữ đức', -1],
  },
  Đoài: {
    Càn: [43, 'Trạch Thiên Quải', 'Quyết đoán dứt điều xấu, nhưng phải công khai và mềm mỏng', 1],
    Đoài: [58, 'Thuần Đoài', 'Vui vẻ, trao đổi, giao lưu; chớ chỉ nói mà không làm', 1],
    Ly: [49, 'Trạch Hỏa Cách', 'Đến lúc thay đổi; cải cách đúng thời thì thành', 1],
    Chấn: [17, 'Trạch Lôi Tùy', 'Thuận theo thời thế và người đáng theo', 1],
    Tốn: [28, 'Trạch Phong Đại Quá', 'Gánh nặng vượt sức; cần hành động đặc biệt và tìm người hỗ trợ', -1],
    Khảm: [47, 'Trạch Thủy Khốn', 'Khốn đốn, thiếu nguồn lực; giữ vững chí, ít nói', -1],
    Cấn: [31, 'Trạch Sơn Hàm', 'Cảm ứng, thu hút nhau; hợp chuyện tình cảm chân thành', 1],
    Khôn: [45, 'Trạch Địa Tụy', 'Tụ hội đông người; lo liệu chu đáo, đề phòng bất trắc', 1],
  },
  Ly: {
    Càn: [14, 'Hỏa Thiên Đại Hữu', 'Giàu có, thành tựu lớn; giữ đức để giữ được của', 2],
    Đoài: [38, 'Hỏa Trạch Khuê', 'Bất đồng, trái ý; việc nhỏ thì làm được, việc lớn khó', -1],
    Ly: [30, 'Thuần Ly', 'Sáng suốt, nương tựa vào chính đạo; tránh nóng vội', 1],
    Chấn: [21, 'Hỏa Lôi Phệ Hạp', 'Có vật cản phải cắn đứt; xử lý dứt khoát vấn đề', 1],
    Tốn: [50, 'Hỏa Phong Đỉnh', 'Đổi mới, cất nhắc, thành tựu bền; hợp lập nghiệp', 2],
    Khảm: [64, 'Hỏa Thủy Vị Tế', 'Chưa xong, sắp thành; cẩn thận bước cuối', 0],
    Cấn: [56, 'Hỏa Sơn Lữ', 'Đời lữ khách; giữ khiêm tốn khi ở nơi lạ', 0],
    Khôn: [35, 'Hỏa Địa Tấn', 'Tiến lên, được thăng tiến nhờ sáng suốt', 2],
  },
  Chấn: {
    Càn: [34, 'Lôi Thiên Đại Tráng', 'Thế mạnh, đừng dùng sức quá mà hỏng việc', 1],
    Đoài: [54, 'Lôi Trạch Quy Muội', 'Quan hệ thiếu chính danh; cẩn trọng cam kết', -1],
    Ly: [55, 'Lôi Hỏa Phong', 'Thịnh vượng ở đỉnh; đề phòng đi xuống sau khi cực thịnh', 1],
    Chấn: [51, 'Thuần Chấn', 'Chấn động, bất ngờ; sau lo sợ là bình tĩnh và tiến bộ', 0],
    Tốn: [32, 'Lôi Phong Hằng', 'Bền bỉ, kiên định, giữ lâu dài thì có thành', 1],
    Khảm: [40, 'Lôi Thủy Giải', 'Giải tỏa khó khăn, nhẹ gánh; làm sớm thì tốt', 2],
    Cấn: [62, 'Lôi Sơn Tiểu Quá', 'Hợp việc nhỏ, không hợp việc lớn; khiêm nhường', 0],
    Khôn: [16, 'Lôi Địa Dự', 'Vui vẻ, hào hứng, chuẩn bị sẵn thì thuận', 1],
  },
  Tốn: {
    Càn: [9, 'Phong Thiên Tiểu Súc', 'Tích lũy nhỏ, chưa đủ sức; chờ mây tan', 0],
    Đoài: [61, 'Phong Trạch Trung Phu', 'Thành tín bên trong, cảm hóa được người', 2],
    Ly: [37, 'Phong Hỏa Gia Nhân', 'Việc nhà, nền nếp; mọi người giữ đúng vai trò', 2],
    Chấn: [42, 'Phong Lôi Ích', 'Có lợi, được giúp, hợp mở việc mới', 2],
    Tốn: [57, 'Thuần Tốn', 'Thấm dần, nhẹ nhàng; việc nhỏ hợp, thiếu quyết đoán', 0],
    Khảm: [59, 'Phong Thủy Hoán', 'Phân tán khó khăn; tập hợp lòng người và nguồn lực', 1],
    Cấn: [53, 'Phong Sơn Tiệm', 'Tiến từng bước, nhất là hôn nhân; chậm mà chắc', 1],
    Khôn: [20, 'Phong Địa Quán', 'Quan sát, nhìn rộng; hợp thời học hỏi hơn hành động', 0],
  },
  Khảm: {
    Càn: [5, 'Thủy Thiên Nhu', 'Chờ đợi đúng thời; kiên nhẫn sẽ tới lúc', 1],
    Đoài: [60, 'Thủy Trạch Tiết', 'Tiết chế đúng mức; quá khắt khe cũng không tốt', 0],
    Ly: [63, 'Thủy Hỏa Ký Tế', 'Đã xong việc; giữ gìn để không đảo ngược', 1],
    Chấn: [3, 'Thủy Lôi Truân', 'Khởi đầu gian nan; cần người cùng gánh, chớ vội', -1],
    Tốn: [48, 'Thủy Phong Tỉnh', 'Giếng nước: nguồn lực bền, cần giữ gìn và khai thác', 1],
    Khảm: [29, 'Thuần Khảm', 'Hiểm trở chồng chất; giữ lòng thành sẽ vượt', -1],
    Cấn: [39, 'Thủy Sơn Kiển', 'Đường chặn trước mặt; quay về tu thân, nhờ quý nhân', -1],
    Khôn: [8, 'Thủy Địa Tỷ', 'Gần gũi, nương tựa, kết đồng minh đáng tin', 2],
  },
  Cấn: {
    Càn: [26, 'Sơn Thiên Đại Súc', 'Tích lũy lớn, được nuôi dưỡng; hợp học tập, chuẩn bị', 2],
    Đoài: [41, 'Sơn Trạch Tổn', 'Giảm bớt để được lợi lớn; bớt cái thừa', 0],
    Ly: [22, 'Sơn Hỏa Bí', 'Trang sức bên ngoài; chú trọng nội dung hơn hình thức', 0],
    Chấn: [27, 'Sơn Lôi Di', 'Nuôi dưỡng, ăn nói cẩn trọng; chú ý sức khỏe', 0],
    Tốn: [18, 'Sơn Phong Cổ', 'Chỉnh đốn cái đã hỏng; làm lại từ gốc', 0],
    Khảm: [4, 'Sơn Thủy Mông', 'Mờ mịt, cần học và tìm thầy chỉ dẫn', 0],
    Cấn: [52, 'Thuần Cấn', 'Dừng lại đúng chỗ; tĩnh để nhìn rõ', 0],
    Khôn: [23, 'Sơn Địa Bác', 'Bào mòn từng bước, thời chưa thuận; ở yên giữ mình', -1],
  },
  Khôn: {
    Càn: [11, 'Địa Thiên Thái', 'Thông suốt, trên dưới hòa; thời tốt để tiến', 2],
    Đoài: [19, 'Địa Trạch Lâm', 'Đến gần, thịnh dần; nắm thời nhưng chớ lơ là', 2],
    Ly: [36, 'Địa Hỏa Minh Di', 'Ánh sáng bị che; giấu tài, nhẫn nại chờ', -1],
    Chấn: [24, 'Địa Lôi Phục', 'Trở lại, khởi đầu mới sau thoái; từng bước một', 1],
    Tốn: [46, 'Địa Phong Thăng', 'Tiến lên chậm mà chắc, được nâng đỡ', 2],
    Khảm: [7, 'Địa Thủy Sư', 'Cần tổ chức, kỷ luật; hợp việc tập thể có người dẫn', 0],
    Cấn: [15, 'Địa Sơn Khiêm', 'Khiêm tốn thì hanh thông, càng hạ càng cao', 2],
    Khôn: [2, 'Thuần Khôn', 'Mềm mại, nhẫn nại, theo người dẫn đúng; không tranh trước', 1],
  },
}

export const lookupHexagram = (upper: Tri, lower: Tri): H => T[upper][lower]
