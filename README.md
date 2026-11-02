# BATASO LIVE — Tây Sơn Edition

Một ứng dụng livestream tương tác cho thương hiệu Bataso, giao diện dọc 1080×1920, tối ưu cho TikTok LIVE Studio và OBS Browser Source.

## Mục tiêu
- Tạo stage livestream hoàn chỉnh theo phong cách Việt Nam đêm phố Tây Sơn.
- Sử dụng background Bataso đã upload làm nền chính.
- Sử dụng logo Bataso làm logo thương hiệu.
- Tự thiết kế host, bếp nướng, ghế, avatar, hiệu ứng tim, quà tặng, spotlight và khói bằng HTML/CSS/SVG.
- Có Demo Mode cho người dùng thử join / like / gift mà không cần kết nối TikTok.
- Có admin panel và backend Node.js + Socket.IO.

## Cấu trúc thư mục

```text
.
├── admin.html
├── stage.html
├── server.js
├── package.json
├── README.md
├── public/
│   └── assets/
│       ├── avatar_default.svg
│       ├── bg_bataso_street.svg
│       ├── bataso_logo.svg
│       ├── blue_stool.svg
│       ├── charcoal_stove.svg
│       ├── crisp_piece.svg
│       ├── particle_spark.svg
│       ├── red_stool.svg
│       └── README.md
├── src/
│   ├── css/
│   │   ├── admin.css
│   │   └── stage.css
│   └── js/
│       ├── admin.js
│       ├── eventManager.js
│       ├── giftManager.js
│       ├── seatManager.js
│       ├── stage.js
│       ├── ttsManager.js
│       └── vipManager.js
└──
```

## Tài nguyên chính đã dùng
- Background: `/assets/bg_bataso_street.svg`
- Logo: `/assets/bataso_logo.svg`

Các phần còn thiếu như host, ghế, lửa, khói, avatar, đĩa bánh tráng đã được tự tạo bằng CSS/SVG/Canvas và đặt dưới các layer riêng để có thể cập nhật realtime.

## Cài đặt

```bash
npm install
```

## Chạy

```bash
npm start
```

Sau đó mở:
- Admin: http://localhost:3000/
- Stage: http://localhost:3000/stage.html

## Demo Mode
- Admin panel mặc định bật Demo Mode.
- Stage sẽ tự tạo dữ liệu giả: người vào quán, comment, like, quà tặng.
- Có thể dùng nút Test event trong admin để thử nhanh.

## Kết nối TikTok LIVE
- Nhập username TikTok trong admin.
- Nhấn Connect.
- Nếu chưa tích hợp channel thật, nền Demo Mode vẫn hoạt động bình thường để test giao diện và hiệu ứng.

## Lưu ý
- Mỗi layer giao diện có khả năng animate độc lập.
- Dùng CSS và SVG để chuẩn bị thay asset thật nếu sau này muốn nâng cấp hình ảnh chất lượng hơn.
- TTS dùng SpeechSynthesis của trình duyệt, nên hoạt động tốt nhất trên Chrome / Edge.
