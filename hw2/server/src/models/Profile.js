import mongoose from 'mongoose';

// Emoji thường hoặc cờ (cờ ghép từ 2 ký tự "Regional Indicator")
const EMOJI_REGEX = /\p{Extended_Pictographic}|\p{Regional_Indicator}/u;

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Thiếu tên'],
      trim: true,
      maxlength: [50, 'Tên tối đa 50 ký tự'],
    },
    age: {
      type: Number,
      required: [true, 'Thiếu tuổi'],
      min: [18, 'Tuổi phải từ 18 trở lên'],
      max: [120, 'Tuổi không hợp lệ'],
      validate: {
        validator: Number.isInteger,
        message: 'Tuổi phải là số nguyên',
      },
    },
    bio: {
      type: String,
      required: [true, 'Thiếu câu giới thiệu'],
      trim: true,
      maxlength: [150, 'Câu giới thiệu tối đa 150 ký tự'],
    },
    avatar: {
      type: String,
      required: [true, 'Thiếu emoji đại diện'],
      trim: true,
      maxlength: [16, 'Emoji đại diện quá dài'],
      match: [EMOJI_REGEX, 'Ảnh đại diện phải là emoji'],
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;
