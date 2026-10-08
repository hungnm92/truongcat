// Nội dung luận giải tự biên soạn cho Trường Cát Mệnh Lý.
export interface StarText {
  hanh: string
  core: string // bản chất chung
  look: string // cốt cách
  career: string
  wealth: string
  love: string
  social: string
  health: string
}

export const MAJOR_STARS: Record<string, StarText> = {
  'Tử Vi': {
    hanh: 'Thổ',
    core: 'tính chủ động, có tầm nhìn và thích giữ vai trò đứng đầu; coi trọng danh dự và thể diện',
    look: 'dáng vẻ đàng hoàng, đoan chính, ánh mắt có uy',
    career: 'hợp vị trí quản lý, điều phối; làm tốt khi được trao quyền quyết định',
    wealth: 'tiền bạc đến từ vị thế và uy tín hơn là chạy vặt; ngại chi tiêu mất mặt',
    love: 'trọng tình nghĩa, muốn người bạn đời tương xứng; cần học cách mềm hơn',
    social: 'có người nể trọng, dễ gặp quý nhân cùng tầm; đừng áp đặt khiến bạn bè xa',
    health: 'cần để ý tỳ vị, huyết áp và áp lực vì ôm việc',
  },
  'Thiên Cơ': {
    hanh: 'Mộc',
    core: 'nhanh trí, thích suy tính, ham học và hay thay đổi phương án',
    look: 'thân hình thanh gọn, vẻ mặt linh hoạt',
    career: 'hợp việc cần mưu lược: tham mưu, nghiên cứu, kỹ thuật, giáo dục',
    wealth: 'tiền đến nhờ chất xám, nhiều nguồn nhỏ; tránh nghĩ nhiều mà chậm xuống tay',
    love: 'tình cảm hay lo nghĩ, nhạy cảm; nên nói thẳng thay vì đoán ý nhau',
    social: 'khéo ứng xử, nhưng dễ bị xem là khó nắm bắt',
    health: 'chú ý thần kinh, giấc ngủ, gan mật',
  },
  'Thái Dương': {
    hanh: 'Hỏa',
    core: 'hào phóng, thẳng thắn, thích giúp người; sống để lại tiếng tốt',
    look: 'khuôn mặt sáng, dáng đứng thẳng',
    career: 'hợp công việc có tính công khai, truyền thông, giáo dục, dịch vụ cộng đồng',
    wealth: 'kiếm được nhưng cũng dễ cho đi; cần giữ phần dự phòng',
    love: 'ấm áp, chu đáo, hay hy sinh; đừng im lặng chịu đựng quá lâu',
    social: 'được lòng người, nhưng dễ bị nhờ vả quá mức',
    health: 'lưu ý mắt, tim mạch và làm việc quá sức',
  },
  'Vũ Khúc': {
    hanh: 'Kim',
    core: 'quyết đoán, thực tế, ngại nói suông; gắn với tiền bạc và kỷ luật',
    look: 'dáng vẻ rắn rỏi, giọng dứt khoát',
    career: 'hợp tài chính, kinh doanh, quản trị, kỹ thuật có kỷ luật',
    wealth: 'có khiếu quản lý tiền, biết tích lũy; tránh tính toán quá chặt với người thân',
    love: 'tình cảm trầm, thể hiện bằng hành động hơn lời nói',
    social: 'ít lời nhưng giữ chữ tín; dễ bị coi là lạnh',
    health: 'chú ý phổi, hô hấp, xương khớp',
  },
  'Thiên Đồng': {
    hanh: 'Thủy',
    core: 'hiền hòa, dễ thích nghi, thích cuộc sống yên ổn; phúc phần nhẹ nhàng',
    look: 'nét mặt hiền, hay cười, dáng mềm',
    career: 'hợp việc ổn định, chăm sóc, dịch vụ, nghệ thuật; ít hợp cạnh tranh gay gắt',
    wealth: 'tiền đến đều nhưng ít đột biến; cẩn thận tính hưởng thụ',
    love: 'dịu dàng, dễ thương; đôi khi thiếu chủ kiến trong chuyện lớn',
    social: 'dễ làm bạn, hay được giúp; đừng ỷ lại',
    health: 'chú ý thận, bàng quang, tiêu hóa',
  },
  'Liêm Trinh': {
    hanh: 'Hỏa',
    core: 'tự trọng cao, cá tính mạnh, có sức hút và nội tâm phức tạp',
    look: 'đường nét rõ, thần thái sắc',
    career: 'hợp việc cần bản lĩnh: pháp lý, quản lý nhân sự, thương mại, công vụ',
    wealth: 'kiếm tiền bằng kỷ luật và chính danh; tránh vì sĩ diện mà chi quá tay',
    love: 'đam mê và chiếm hữu; cần học cách tin tưởng',
    social: 'ân oán phân minh, có người mến có người ngại',
    health: 'lưu ý huyết áp, viêm nhiễm, tim mạch',
  },
  'Thiên Phủ': {
    hanh: 'Thổ',
    core: 'ôn hòa, biết giữ của, thích ổn định và có đầu óc quản lý tài sản',
    look: 'dáng đầy đặn, phúc hậu',
    career: 'hợp hành chính, ngân hàng, kế toán, vận hành; làm lâu bền',
    wealth: 'biết tích trữ, đầu tư an toàn; ít dám mạo hiểm',
    love: 'chung thủy, trọng gia đình; có phần bảo thủ',
    social: 'được tin cậy, hay là chỗ dựa cho người khác',
    health: 'chú ý cân nặng, tiểu đường, tiêu hóa',
  },
  'Thái Âm': {
    hanh: 'Thủy',
    core: 'tinh tế, kín đáo, giàu cảm xúc và có khiếu thẩm mỹ',
    look: 'nét mặt dịu, da sáng, ánh mắt sâu',
    career: 'hợp việc tỉ mỉ: thiết kế, văn chương, tài chính, bất động sản, y tế',
    wealth: 'tích lũy chậm mà chắc; hợp giữ tiền hơn là đầu cơ',
    love: 'chân thành và nhạy cảm; hay giấu lòng',
    social: 'quan hệ có chiều sâu, ít nhưng bền',
    health: 'chú ý thận, mắt, nội tiết',
  },
  'Tham Lang': {
    hanh: 'Thủy',
    core: 'đa tài, nhiều ham muốn, hoạt bát và thích trải nghiệm',
    look: 'vẻ ngoài cuốn hút, nhanh nhẹn',
    career: 'hợp kinh doanh, nghệ thuật, giao tế, giải trí; làm nhiều nghề',
    wealth: 'cơ hội nhiều nhưng dễ phân tán; nên chọn một hướng chính',
    love: 'nhiều duyên, cần giữ ranh giới rõ ràng',
    social: 'rộng quan hệ, vui tính; cẩn thận bạn bè rủ rê',
    health: 'chú ý gan, rượu bia, thức khuya',
  },
  'Cự Môn': {
    hanh: 'Thủy',
    core: 'sắc sảo về lời nói, hay suy xét, thích tranh biện để tìm lẽ phải',
    look: 'miệng nói giỏi, ánh mắt tinh',
    career: 'hợp luật, giảng dạy, truyền thông, tư vấn, nghiên cứu',
    wealth: 'tiền đến từ lời nói và chuyên môn; tránh tranh chấp tiền bạc',
    love: 'hay nghi ngờ, dễ hiểu lầm; cần nói rõ và bớt đa nghi',
    social: 'dễ vướng thị phi vì lời nói; kiệm lời sẽ lợi',
    health: 'chú ý dạ dày, miệng họng',
  },
  'Thiên Tướng': {
    hanh: 'Thủy',
    core: 'nghĩa khí, biết giữ lễ, thích hỗ trợ và làm cầu nối',
    look: 'dáng vẻ gọn gàng, lịch sự',
    career: 'hợp vai trò phụ tá, điều phối, dịch vụ, hành chính',
    wealth: 'thu nhập ổn khi có người đỡ đầu; nên rõ ràng giấy tờ',
    love: 'chu toàn, tử tế; hay nhường nhịn',
    social: 'được quý mến, dễ nhận trách nhiệm hộ người',
    health: 'chú ý da, thận, bàng quang',
  },
  'Thiên Lương': {
    hanh: 'Mộc',
    core: 'điềm đạm, che chở, ưa lẽ phải; có duyên với việc thiện và người lớn tuổi',
    look: 'phong thái chững chạc, nét mặt hiền',
    career: 'hợp y tế, giáo dục, công chức, tư vấn, phúc lợi xã hội',
    wealth: 'tiền vừa đủ, ổn định; không hợp đầu cơ nóng vội',
    love: 'ân cần như người lớn, đôi khi quá lo cho đối phương',
    social: 'hay được tin cậy, giải quyết bất đồng tốt',
    health: 'chú ý dạ dày, hệ thần kinh, tuổi trung niên về sau',
  },
  'Thất Sát': {
    hanh: 'Kim',
    core: 'mạnh mẽ, dám làm, thích tự mình xông pha; đời nhiều biến động nhưng cũng nhiều cơ hội',
    look: 'dáng cứng cáp, ánh mắt kiên quyết',
    career: 'hợp việc cần dũng khí: khởi nghiệp, quân đội, kỹ thuật, thể thao, quản lý khủng hoảng',
    wealth: 'tiền lên xuống theo thời cuộc; nên có quỹ dự phòng',
    love: 'tình cảm mạnh nhưng ít nói; tránh nóng nảy trong lời',
    social: 'chuộng bạn thẳng tính, ít vòng vo',
    health: 'chú ý chấn thương, huyết áp, nóng nảy sinh bệnh',
  },
  'Phá Quân': {
    hanh: 'Thủy',
    core: 'thích đổi mới, phá cái cũ lập cái mới, can đảm thử thách',
    look: 'nét mặt cương, hành động nhanh',
    career: 'hợp việc đột phá, cải tổ, sáng tạo, khởi nghiệp, nghệ thuật',
    wealth: 'tiền biến động mạnh; nên chia nhỏ rủi ro, tránh dồn hết một ván',
    love: 'tình cảm nhiều thay đổi, cần ổn định niềm tin',
    social: 'tính khí thẳng, dễ va chạm; biết lắng nghe sẽ thành đòn bẩy',
    health: 'chú ý thận, hệ bài tiết, tai nạn do liều',
  },
}

export const MAJOR_ORDER = Object.keys(MAJOR_STARS)

export const CAT_TINH = ['Tả Phù', 'Hữu Bật', 'Văn Xương', 'Văn Khúc', 'Thiên Khôi', 'Thiên Việt', 'Lộc Tồn', 'Thiên Mã', 'Long Trì', 'Phượng Các', 'Thiên Quý', 'Ân Quang', 'Tam Thai', 'Bát Tọa']
export const SAT_TINH = ['Kình Dương', 'Đà La', 'Hỏa Tinh', 'Linh Tinh', 'Địa Không', 'Địa Kiếp']
export const CAT_THIEN_TU = ['Lộc', 'Quyền', 'Khoa']

export interface PalaceText { topic: string; field: keyof StarText; intro: string }

export const PALACES: Record<string, PalaceText> = {
  'Mệnh': { topic: 'bản thân, tính cách và định hướng chung', field: 'core', intro: 'Cung Mệnh nói về cốt lõi con người bạn' },
  'Phụ Mẫu': { topic: 'cha mẹ, bề trên, giấy tờ, học vấn', field: 'social', intro: 'Cung Phụ Mẫu cho thấy quan hệ với cha mẹ và người lớn' },
  'Phúc Đức': { topic: 'phúc phần, đời sống tinh thần, họ hàng', field: 'core', intro: 'Cung Phúc Đức phản ánh nền tinh thần và phúc phần' },
  'Điền Trạch': { topic: 'nhà đất, tài sản tích lũy', field: 'wealth', intro: 'Cung Điền Trạch nói về nhà đất và của cải tích lũy' },
  'Quan Lộc': { topic: 'sự nghiệp, công danh', field: 'career', intro: 'Cung Quan Lộc chỉ hướng sự nghiệp' },
  'Nô Bộc': { topic: 'bạn bè, cấp dưới, đồng nghiệp', field: 'social', intro: 'Cung Nô Bộc cho thấy duyên với bạn bè, cấp dưới' },
  'Thiên Di': { topic: 'môi trường bên ngoài, đi xa, giao tế', field: 'social', intro: 'Cung Thiên Di nói về cách bạn ra ngoài đời' },
  'Tật Ách': { topic: 'sức khỏe, bệnh tật', field: 'health', intro: 'Cung Tật Ách nhắc về thể trạng và nguy cơ sức khỏe' },
  'Tài Bạch': { topic: 'tiền bạc, nguồn thu', field: 'wealth', intro: 'Cung Tài Bạch cho thấy cách kiếm và giữ tiền' },
  'Tử Nữ': { topic: 'con cái, đời sống sinh dưỡng', field: 'love', intro: 'Cung Tử Tức nói về con cái và đường sinh nở' },
  'Phu Thê': { topic: 'hôn nhân, bạn đời', field: 'love', intro: 'Cung Phu Thê nói về duyên vợ chồng' },
  'Huynh Đệ': { topic: 'anh chị em, đối tác thân cận', field: 'social', intro: 'Cung Huynh Đệ nói về anh em và người cùng vai' },
}

export const BRIGHTNESS_TEXT: Record<string, string> = {
  Miếu: 'sáng rực, phát huy trọn vẹn',
  Vượng: 'sáng, lực mạnh',
  Đắc: 'đủ sáng, làm việc đáng tin',
  Lợi: 'khá sáng',
  Bình: 'sáng vừa, cần thêm trợ lực',
  Bất: 'chưa đắc, sức yếu đi',
  Hạn: 'mờ (hãm), nên thận trọng',
  Hãm: 'mờ (hãm), nên thận trọng',
}

export const MUTAGEN_TEXT: Record<string, string> = {
  Lộc: 'Hóa Lộc: thêm thuận lợi, cơ hội sinh lợi',
  Quyền: 'Hóa Quyền: có thêm uy lực và khả năng quyết định',
  Khoa: 'Hóa Khoa: thêm danh tiếng, được người nâng đỡ',
  Kỵ: 'Hóa Kỵ: dễ vướng trở ngại, nên chậm lại và kiểm tra kỹ',
}

export const CUC_TEXT: Record<string, string> = {
  'Thủy Nhị Cục': 'Thủy Nhị Cục: khởi vận sớm, cuộc sống linh hoạt',
  'Mộc Tam Cục': 'Mộc Tam Cục: phát triển dần, cần thời gian để vươn',
  'Kim Tứ Cục': 'Kim Tứ Cục: rõ ràng, thực tế, hợp kỷ luật',
  'Thổ Ngũ Cục': 'Thổ Ngũ Cục: vững chắc, chậm mà chắc',
  'Hỏa Lục Cục': 'Hỏa Lục Cục: nhiệt huyết, vận đến muộn hơn nhưng bền',
}
