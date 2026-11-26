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

## HW3 - Esports Fair-Play Appeal Tribunal
