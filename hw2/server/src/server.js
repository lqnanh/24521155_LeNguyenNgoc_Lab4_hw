import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Profile from './models/Profile.js';
import Swipe, { SWIPE_ACTIONS } from './models/Swipe.js';

const MONGODB_URI = process.env.MONGODB_URI;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN?.replace(/\/$/, '');
const PORT = Number(process.env.PORT) || 3000;

// Thiếu biến môi trường thì dừng luôn (project-rules: "thiếu thì throw lỗi luôn")
if (!MONGODB_URI) throw new Error('MONGODB_URI missing: thêm vào file .env');
if (!CLIENT_ORIGIN) throw new Error('CLIENT_ORIGIN missing: thêm vào file .env');

// ObjectId hợp lệ là chuỗi đúng 24 ký tự 0-9, a-f.
// Không dùng mongoose.isValidObjectId vì hàm đó coi cả chuỗi 12 ký tự bất kỳ là hợp lệ.
function isObjectIdString(value) {
  return typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value);
}

const app = express();

// Chỉ cho trang web ở CLIENT_ORIGIN gọi vào
app.use(cors({ origin: CLIENT_ORIGIN }));

// Đọc dữ liệu JSON gửi lên
app.use(express.json());

// Lấy danh sách profile
app.get('/api/profiles', async (req, res) => {
  try {
    const profiles = await Profile.find().sort({ createdAt: 1 }).lean();
    res.json(profiles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Không lấy được danh sách profile' });
  }
});

// Lưu một lần quẹt
app.post('/api/swipe', async (req, res) => {
  try {
    // Express 5: không gửi JSON thì req.body là undefined
    const { profileId, action } = req.body ?? {};

    if (!profileId || !action) {
      return res.status(400).json({ error: 'Thiếu profileId hoặc action' });
    }
    if (!SWIPE_ACTIONS.includes(action)) {
      return res
        .status(400)
        .json({ error: 'action chỉ được là NOPE, LIKE hoặc SUPERLIKE' });
    }
    if (!isObjectIdString(profileId)) {
      return res.status(400).json({ error: 'profileId sai định dạng' });
    }

    const profileExists = await Profile.exists({ _id: profileId });
    if (!profileExists) {
      return res.status(400).json({ error: 'Không có profile này' });
    }

    const swipe = await Swipe.create({ profileId, action });
    res.status(201).json(swipe);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      const firstMessage = Object.values(err.errors)[0]?.message;
      return res.status(400).json({ error: firstMessage || 'Dữ liệu không hợp lệ' });
    }
    console.error(err);
    res.status(500).json({ error: 'Không lưu được lượt quẹt' });
  }
});

// Xoá một lần quẹt (dùng cho nút hoàn tác)
app.delete('/api/swipe/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!isObjectIdString(id)) {
      return res.status(400).json({ error: 'id sai định dạng' });
    }

    const deleted = await Swipe.findByIdAndDelete(id).lean();
    if (!deleted) {
      return res.status(404).json({ error: 'Không tìm thấy lượt quẹt này' });
    }

    res.status(200).json(deleted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Không xoá được lượt quẹt' });
  }
});

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
