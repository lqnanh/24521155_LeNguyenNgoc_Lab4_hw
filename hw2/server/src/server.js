import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN?.replace(/\/$/, '');
const PORT = Number(process.env.PORT) || 3000;

// Thiếu biến môi trường thì dừng luôn (project-rules: "thiếu thì throw lỗi luôn")
if (!MONGODB_URI) throw new Error('MONGODB_URI missing: thêm vào file .env');
if (!CLIENT_ORIGIN) throw new Error('CLIENT_ORIGIN missing: thêm vào file .env');

const app = express();

// Chỉ cho trang web ở CLIENT_ORIGIN gọi vào
app.use(cors({ origin: CLIENT_ORIGIN }));

// Đọc dữ liệu JSON gửi lên
app.use(express.json());

// Các đường dẫn /api sẽ thêm ở bước sau

// Đường dẫn không tồn tại thì trả 404 dạng JSON
app.use((req, res) => {
  res.status(404).json({ error: `Không tìm thấy ${req.method} ${req.originalUrl}` });
});

// Lỗi bất kỳ (ví dụ JSON gửi lên bị sai) cũng trả JSON, không trả trang HTML
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: status === 400 ? 'Dữ liệu gửi lên không hợp lệ' : 'Lỗi máy chủ',
  });
});

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Đã kết nối MongoDB');

    app.listen(PORT, () => {
      console.log(`Server chạy ở http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Không kết nối được MongoDB:', err.message);
    process.exit(1);
  }
}

start();
