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
- SwipeDeck.jsx: hoàn tác một thẻ, DELETE đang chờ thì quẹt lại đúng thẻ đó, nếu DELETE lỗi thì code bỏ qua việc trả thẻ lại nên server còn 2 bản ghi cho cùng một người trong khi giao diện chỉ có 1.
  Chưa sửa vì rất hiếm gặp (phải vừa lỗi mạng vừa bấm thật nhanh) và không làm sai điểm hay thẻ trên giao diện.
- SwipeDeck.jsx (bước 11): code coi "không tìm thấy lần quẹt trong danh sách" là đã hoàn tác rồi gọi DELETE, nên khi thêm nút Chơi lại thì các lần quẹt đang chờ server sẽ bị xoá nhầm trên server.
  Sửa: ở bước 12 ghi rõ các lần hoàn tác lúc đang chờ vào undoneWhilePendingRef và đánh dấu ván cũ bằng roundStartRef, không đoán nữa.

## HW3 - Esports Fair-Play Appeal Tribunal

- Layout.jsx và HomePage.jsx: cả hai cùng gọi useDossierList, ở trang chủ danh sách tuyển thủ bị tải 2 lần từ server.
  Sửa: ở bước 7 chỉ Layout gọi useDossierList, truyền xuống trang chủ qua Outlet context (useOutletContext).
- index.css: viền focus màu vàng #f2a900 trên nền trắng chỉ đạt khoảng 1.9:1, dưới mức 3:1 mà WCAG 2.2 AA yêu cầu cho chỉ báo focus.
  Sửa: ở bước 7 đổi viền focus thành xanh #0b4fb3 (khoảng 7,5:1 trên nền trắng), riêng thanh điều hướng tối giữ màu vàng.
- AppealForm.module.css: nút bị khoá dùng opacity 0.6 làm chữ trên nút nhạt, thiếu tương phản.
  Sửa: ở bước 7 bỏ opacity, đặt màu nền và màu chữ riêng cho nút bị khoá.
- computeMatrix.js: án nhẹ hơn vi phạm (chênh lệch âm, vd TanVuu -2) vẫn kết luận là Tương xứng, dễ hiểu nhầm.
  Chưa sửa vì bảng chỉ dùng để xem án có nặng quá không (phục vụ kháng cáo), cột chênh lệch vẫn ghi rõ "Nhẹ hơn 2 mức".
- InputField.jsx: chỗ báo lỗi chỉ là thẻ p thường, thiếu role="alert" như code mẫu slide 25, nên lỗi hiện ra lúc rời ô thì trình đọc màn hình không tự đọc.
  Sửa: ở bước 6 thêm role="alert" cho chỗ báo lỗi dưới mỗi ô.
