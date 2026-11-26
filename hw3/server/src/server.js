import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Player from './models/Player.js';
import Appeal from './models/Appeal.js';
import { validateAppeal } from './validateAppeal.js';

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

// ===== Các đường dẫn /api =====

// Giờ hiện tại của server, để trang web chỉnh đồng hồ đếm ngược
app.get('/api/time', (req, res, next) => {
  try {
    res.json({ now: Date.now() });
  } catch (err) {
    next(err);
  }
});

// Danh sách tuyển thủ (tóm tắt)
app.get('/api/dossiers', async (req, res, next) => {
  try {
    const players = await Player.find({}, 'playerId displayName team appealDeadline -_id')
      .sort({ displayName: 1 })
      .lean();
    res.json(players);
  } catch (err) {
    next(err);
  }
});

// Toàn bộ hồ sơ một tuyển thủ
app.get('/api/dossiers/:playerId', async (req, res, next) => {
  try {
    const playerId = req.params.playerId.toLowerCase();
    const player = await Player.findOne({ playerId }).select('-__v').lean();
    if (!player) {
      return res.status(404).json({ error: `Không tìm thấy hồ sơ của tuyển thủ "${playerId}"` });
    }
    res.json(player);
  } catch (err) {
    next(err);
  }
});

// Gửi đơn kháng cáo
app.post('/api/dossiers/:playerId/appeals', async (req, res, next) => {
  try {
    const playerId = req.params.playerId.toLowerCase();

    const player = await Player.findOne({ playerId }, 'appealDeadline').lean();
    if (!player) {
      return res.status(404).json({ error: `Không tìm thấy hồ sơ của tuyển thủ "${playerId}"` });
    }

    if (Date.now() >= new Date(player.appealDeadline).getTime()) {
      return res.status(409).json({ error: 'Đã hết hạn kháng cáo, không thể gửi đơn' });
    }

    const errors = validateAppeal(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // Chỉ lấy đúng các ô cần thiết; playerId lấy từ đường dẫn, bỏ qua playerId người dùng gửi
    const body = req.body;
    const appeal = await Appeal.create({
      playerId,
      fullName: body.fullName,
      email: body.email,
      reason: body.reason,
      statement: body.statement,
      evidenceUrl: body.evidenceUrl ?? '',
      agreed: body.agreed,
    });

    res.status(201).json(appeal);
  } catch (err) {
    // Phòng hờ: nếu Mongoose vẫn bắt được lỗi thì trả cùng dạng 400 { errors }
    if (err instanceof mongoose.Error.ValidationError) {
      const errors = {};
      for (const [field, detail] of Object.entries(err.errors)) {
        errors[field] = detail.message;
      }
      return res.status(400).json({ errors });
    }
    next(err);
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
