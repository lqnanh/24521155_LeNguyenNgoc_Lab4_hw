import mongoose from 'mongoose';
import Player from './models/Player.js';
import Appeal from './models/Appeal.js';

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('Thiếu MONGODB_URI trong file .env');
}

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

async function main() {
  await mongoose.connect(uri);
  console.log('Đã kết nối MongoDB');

  try {
    await Player.init(); // đảm bảo index unique của playerId đã được tạo

    await Promise.all([Player.deleteMany({}), Appeal.deleteMany({})]);
    console.log('Đã xoá dữ liệu cũ');

    const now = Date.now();

    const players = await Player.create([
      {
        playerId: 'himass',
        displayName: 'Himass',
        team: 'Saigon Phoenix',
        role: 'Đi rừng',
        violations: [
          {
            type: 'Ngôn từ thiếu chuẩn mực',
            severity: 2,
            evidence: 'Ghi âm voice chat trận bán kết cho thấy lời lẽ xúc phạm đối thủ.',
            occurredAt: new Date(now - 10 * DAY),
          },
          {
            type: 'Đến trễ giờ thi đấu',
            severity: 1,
            evidence: 'Biên bản trọng tài ghi nhận có mặt trễ 12 phút so với lịch.',
            occurredAt: new Date(now - 7 * DAY),
          },
        ],
        penalty: { matchBan: 6, fine: 15000000, level: 5 },
        sanctionedAt: new Date(now - 1 * DAY),
        appealDeadline: new Date(now + 72 * HOUR),
      },
      {
        playerId: 'tanvuu',
        displayName: 'TanVuu',
        team: 'Hanoi Thunder',
        role: 'Xạ thủ',
        violations: [
          {
            type: 'Dùng phần mềm macro',
            severity: 4,
            evidence: 'Log anti-cheat phát hiện chuỗi thao tác lặp bất thường ở ván 2.',
            occurredAt: new Date(now - 12 * DAY),
          },
          {
            type: 'Chia sẻ tài khoản',
            severity: 3,
            evidence: 'Địa chỉ IP đăng nhập trùng với một người chơi ngoài đội.',
            occurredAt: new Date(now - 9 * DAY),
          },
          {
            type: 'Ngôn từ thiếu chuẩn mực',
            severity: 1,
            evidence: 'Tin nhắn chat công khai sau trận bị khán giả báo cáo.',
            occurredAt: new Date(now - 5 * DAY),
          },
        ],
        penalty: { matchBan: 2, fine: 3000000, level: 2 },
        sanctionedAt: new Date(now - 2 * DAY),
        appealDeadline: new Date(now + 2 * MINUTE),
      },
    ]);

    for (const p of players) {
      console.log(`Đã thêm ${p.displayName}, hạn kháng cáo: ${p.appealDeadline.toLocaleString('vi-VN')}`);
    }
  } finally {
    await mongoose.disconnect();
    console.log('Đã ngắt kết nối');
  }
}

main().catch((err) => {
  console.error('Seed thất bại:', err.message);
  process.exitCode = 1;
});
