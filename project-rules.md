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


