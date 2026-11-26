# AI_FAILURE_AUDIT.md - Lab 4 Homework

Ghi lại mọi chỗ AI sinh code sai, API không tồn tại, vòng lặp effect, hoặc lệch project-rules.
Mỗi mục gồm: lỗi là gì (dẫn chứng file/dòng hoặc rule bị vi phạm) và cách đã kiểm tra, sửa.

## HW1 - Photo & Evidence Gallery SPA

## HW2 - Card-Swipe Deck "Hen Ho Nhung Khong Yeu"

- server.js: thiếu MONGODB_URI thì AI dùng process.exit(1), sai rule thiếu thì throw lỗi.
  Sửa: đổi thành throw new Error('MONGODB_URI missing').
- server.js: lỗi 4xx khác 400 (vd 413) đều báo là Lỗi máy chủ, dễ hiểu nhầm.
  Chưa sửa vì lỗi nhẹ, mã lỗi trả về vẫn đúng.
- models/Profile.js: kiểm tra avatar chỉ xem có chứa emoji hay không, nên chuỗi như abc😀 vẫn lọt qua dù báo lỗi là phải là emoji.
  Chưa sửa vì lỗi nhẹ, dữ liệu profile do file seed tự thêm chứ người dùng không gửi lên.
- client/hooks/useProfiles.js: thiếu VITE_API_URL thì throw ngay khi nạp file, trang trắng trơn, lỗi chỉ hiện trong console chứ không hiện trên trang.
  Chưa sửa vì chỉ xảy ra khi quên tạo file .env lúc cài đặt, người dùng thật không gặp.
- SwipeDeck.module.css: màu nút thích (#16a34a) và hoàn tác (#d97706) trên nền trắng chỉ đạt khoảng 3.2:1, nút hoàn tác chữ nhỏ có thể bị Lighthouse báo thiếu tương phản.
  Chưa sửa, để bước kiểm tra Lighthouse cuối cùng, nếu bị báo thì đổi sang màu đậm hơn (vd #15803d, #b45309).
- SwipeDeck.jsx: đang đứng ở nút quẹt mà bấm tới thẻ cuối thì nút bị mờ (disabled), người dùng bàn phím bị mất chỗ đang đứng.
  Chưa sửa vì lỗi nhẹ, vẫn dùng phím mũi tên và Backspace được.

## HW3 - Esports Fair-Play Appeal Tribunal
