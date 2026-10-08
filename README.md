# Trường Cát Mệnh Lý

Ứng dụng web tĩnh (Vite + React + TypeScript) gồm 5 mục, mọi tính toán chạy trên trình duyệt:

1. **Tổng Quan**: tổng quan lá số, chọn ngày tốt (Xuất hành, Động thổ, Khai trương, Cưới hỏi).
2. **12 Cung**: tinh bàn Tử Vi, đại vận, luận từng cung, sao chép ảnh.
3. **Vận Hạn**: luận 12 cung theo năm lưu niên.
4. **La Bàn**: Bát Trạch + Huyền Không Phi Tinh (vận 9) cho nhà, bàn làm việc, giường ngủ.
5. **Gieo Quẻ**: Lục Hào (nạp giáp, thế ứng, lục thân, lục thần, vượng suy, ứng kỳ) kèm bàn **Kỳ Môn Độn Giáp** giờ
   (chuyển bàn, sách bổ định cục, trực phù/trực sử, cách phục/phản ngâm, môn bức, hướng xuất hành).

Ngoài ra: luồng popup *Thiên cơ soi chiếu → Hành trình nhân sinh → Đang an sao*, trang chủ (giới thiệu, ba góc nhìn,
triết lý, đồng hành, ủng hộ), lịch vạn niên, thời tiết theo tỉnh (Open-Meteo), cỡ chữ A+/A-.

## Cấu hình thương hiệu

Sửa `src/config.ts`: tên, khẩu hiệu, link đặt lịch (`bookingUrl`), link liên hệ (`contactUrl`) và ảnh QR ủng hộ
(`supportQr`, đặt file trong `public/`). Để trống thì nút/khối tương ứng tự ẩn hoặc hiện "đang cập nhật".

## Chạy

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # vitest
npm run build
```

## Nguồn tri thức và giấy phép

- An sao Tử Vi: thư viện [`iztro`](https://github.com/SylarLong/iztro) (MIT), ngôn ngữ `vi-VN`.
- Lịch âm, can chi, nạp âm, trực, nhị thập bát tú: [`lunar-javascript`](https://github.com/6tail/lunar-javascript) (MIT).
- Toàn bộ văn bản luận giải (`src/data/*`, `src/lib/readings.ts`, `src/lib/iching.ts`) được biên soạn riêng,
  không sao chép từ website nào. Thương hiệu, logo và giao diện là của dự án này.

## Dữ liệu luận giải (có thể tự sửa)

- `src/data/stars.ts`: tính chất 14 chính tinh, ý nghĩa 12 cung.
- `src/data/starPalace.ts`: lời luận từng chính tinh tại từng cung, khi sáng và khi mờ.
- `src/data/patterns.ts`: khoảng 30 cách cục (điều kiện + diễn giải) và nhóm nghề hợp với từng sao.
- `src/data/thansat.ts`: cát thần / hung sát ngày, trọng số và việc bị ảnh hưởng.
- `src/data/hexagrams.ts`: 64 quẻ.

## Giới hạn đã biết

- Huyền Không có vận 6–9 theo năm xây, thế quái khi kiêm hướng > 4.5°, phi tinh lưu niên; chưa có thành môn, đả kiếp.
- Kỳ Môn dùng phép sách bổ (không xét siêu thần, nhuận kỳ); nên coi là tham khảo.
- Luận giải là mô hình quy tắc, không phải dự đoán.
