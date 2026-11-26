# project rules lab4 hw

## chung
- component viết dạng hàm, ko dùng class
- ko dùng defaultProps, để default trong tham số luôn
- ko xài router v5 (Switch, Redirect, exact...), dùng react-router v7
- css để trong file .module.css, ko style={{}} inline
- map list thì key = id, ko lấy index
- nút nhớ ghi type="button", nút chỉ có icon thì phải có aria-label
- báo lỗi bằng role="alert", ko dùng alert()
- màn 375px ko bị cuộn ngang
- mỗi bài 1 folder riêng (hw1, hw2, hw3)

## hw1 - photo gallery
- route: / , /gallery , * (404)
- trang gallery load bằng React.lazy + Suspense, có skeleton (aria-busy)
- url dạng /gallery?category=abc&photoId=xyz
- category vs photoId lấy từ useSearchParams, ko để trong useState
- category sai/ko có thì hiện hết ảnh
- lọc ảnh tính luôn lúc render, ko dùng useEffect
- đổi filter thì chỉ đổi category, ko làm mất photoId
- photoId sai thì ko mở ảnh, hiện thông báo
- đóng ảnh chỉ xoá photoId thôi, giữ category (ko setSearchParams({}))
- lightbox dùng thẻ <dialog>, mở showModal() đóng close()
- ảnh có width height alt, ảnh ở dưới thì loading="lazy"
- lưới ảnh dùng css grid
- dùng được bằng bàn phím (tab, enter, esc)
- lighthouse đo bản build, cố gắng 100

## hw2 - hẹn hò nhưng không yêu
### server
- express + mongoose 8 (ko lên 9), async/await hết, ko callback kiểu cũ
- chuỗi kết nối db lấy từ process.env.MONGODB_URI, thiếu thì throw lỗi luôn
- dùng 127.0.0.1 chứ ko dùng localhost trong MONGODB_URI (localhost bị lỗi ::1)
- mongoose.connect ko thêm useNewUrlParser, useUnifiedTopology
- cors chỉ cho CLIENT_ORIGIN, ko cors() mở hết
- .env ko commit, có .env.example
- api:
  - GET /api/profiles -> list profile, dùng .lean()
  - POST /api/swipe { profileId, action } -> 201, sai thì 400 { error }
  - DELETE /api/swipe/:id -> để hoàn tác, ko thấy thì 404
- action chỉ có NOPE, LIKE, SUPERLIKE
- route nào cũng try/catch, route ko có thì trả 404 json

### client
- url server lấy từ import.meta.env.VITE_API_URL
- fetch trong useEffect phải có AbortController
- phím: ← bỏ qua, → thích, ↑ siêu thích, Backspace hoàn tác
- kéo thẻ bằng pointer event, lệch quá 50px mới tính
- có nút bấm cho người ko dùng phím/kéo, nút icon có aria-label
- hoàn tác dùng stack (LIFO), bỏ cái cuối ra
- điểm tính từ history luôn (LIKE +10, SUPERLIKE +25, NOPE -5), ko để trong useState, ko useEffect
- thẻ đang hiện cũng tính lúc render
- lỗi gọi api hiện role="alert"
- màn 375px ko cuộn ngang


