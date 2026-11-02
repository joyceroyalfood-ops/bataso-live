# BATASO LIVE — Tây Sơn Edition

Một dự án livestream tương tác dành cho thương hiệu Bataso, mang phong cách đường phố Việt Nam, 9:16, tối ưu cho TikTok LIVE Studio và OBS Browser Source.

## Mục tiêu

- Tạo stage livestream chính thức với các khu vực header, host, ghế người xem, banner và footer.
- Kết nối realtime bằng Socket.IO.
- Quản lý ghế, quà tặng, VIP, TTS và demo mode từ admin panel.
- Có thể chạy trên máy local bằng npm start.

## Công nghệ chính

- Node.js + Express
- Socket.IO
- HTML/CSS/JavaScript thuần
- Browser Source phục vụ livestream

## Cấu trúc

```text
.
├── admin.html
├── stage.html
├── server.js
├── package.json
├── README.md
├── public/
│   └── assets/
│       ├── README.md
│       ├── avatar_default.svg
│       ├── batalso_logo.svg
│       ├── bg_bataso_street.svg
│       ├── blue_stool.svg
│       ├── charcoal_stove.svg
│       ├── crisp_piece.svg
│       ├── particle_spark.svg
│       └── red_stool.svg
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

## Demo mode

- Admin panel có chế độ Demo Mode bật mặc định.
- Khi mở stage, ứng dụng sẽ tạo dữ liệu giả từ backend để kiểm tra hiệu ứng, ghế, tim và quà tặng.
- Panel admin có nút test event để thử join, comment, like, gift.

## Ghi chú tài nguyên

Các file hình ảnh và âm thanh gốc chưa có sẵn trong repo. Thay vì dùng nhãn hiệu ngoài ý đồ, project đã dùng các placeholder SVG đơn giản trong public/assets. Bạn có thể thay bằng asset thật nếu muốn.

## Lưu ý vận hành

- Dùng Browser Source trong TikTok LIVE Studio với tỉ lệ 1080×1920.
- Cấu hình stage ở dạng hiển thị dọc 9:16.
- Tất cả layout có thể tùy chỉnh thêm trong file src/css/stage.css.
- TTS sử dụng Speech Synthesis của trình duyệt, nên hoạt động tốt nhất trên Chrome/Edge.
