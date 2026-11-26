import mongoose from 'mongoose';
import Profile from './models/Profile.js';
import Swipe from './models/Swipe.js';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) throw new Error('MONGODB_URI missing: thêm vào file .env');

const profiles = [
  {
    name: 'Nguyễn Văn Bánh',
    age: 24,
    bio: 'Ngày ăn 3 ổ bánh mì, tối mơ thấy ổ thứ 4. Tìm người chia đôi pate.',
    avatar: '🥖',
  },
  {
    name: 'Trần Thị Mèo',
    age: 22,
    bio: 'Chủ của 5 con mèo. Nói đúng hơn là nô lệ của 5 con mèo.',
    avatar: '🐱',
  },
  {
    name: 'Lê Hoàng Deadline',
    age: 21,
    bio: 'Chỉ làm việc hiệu quả lúc 23:59. Trả lời tin nhắn cũng vậy.',
    avatar: '⏰',
  },
  {
    name: 'Phạm Minh Trà Sữa',
    age: 20,
    bio: 'Full topping, ít đường, nhiều drama.',
    avatar: '🧋',
  },
  {
    name: 'Võ Thu Wifi',
    age: 23,
    bio: 'Nhà có wifi mạnh nhất xóm. Đó là ưu điểm duy nhất, mong bạn hiểu.',
    avatar: '📶',
  },
  {
    name: 'Đặng Quốc Ngủ',
    age: 26,
    bio: 'Sở thích: ngủ. Ước mơ: ngủ thêm 5 phút nữa.',
    avatar: '😴',
  },
  {
    name: 'Bùi Ngọc Karaoke',
    age: 25,
    bio: 'Hát không hay nhưng được cái hát to. Hàng xóm đã quen.',
    avatar: '🎤',
  },
  {
    name: 'Hồ Anh Gym',
    age: 27,
    bio: 'Đi tập 1 ngày, khoe ảnh 7 ngày.',
    avatar: '💪',
  },
  {
    name: 'Ngô Thảo Lẩu',
    age: 24,
    bio: 'Không có chuyện gì một nồi lẩu không giải quyết được. Trừ tiền nhà.',
    avatar: '🍲',
  },
  {
    name: 'Dương Tuấn Code',
    age: 22,
    bio: 'Code chạy được thì không biết tại sao. Code lỗi cũng không biết tại sao.',
    avatar: '💻',
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Đã kết nối MongoDB');

    // Xoá dữ liệu cũ để chạy lại nhiều lần không bị trùng
    const deletedSwipes = await Swipe.deleteMany({});
    const deletedProfiles = await Profile.deleteMany({});
    console.log(
      `Đã xoá ${deletedProfiles.deletedCount} profile và ${deletedSwipes.deletedCount} lượt quẹt cũ`
    );

    const created = await Profile.insertMany(profiles);
    console.log(`Đã thêm ${created.length} profile`);
  } catch (err) {
    console.error('Seed bị lỗi:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Đã ngắt kết nối');
  }
}

seed();
