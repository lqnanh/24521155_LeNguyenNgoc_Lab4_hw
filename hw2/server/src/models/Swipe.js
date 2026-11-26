import mongoose from 'mongoose';

export const SWIPE_ACTIONS = ['NOPE', 'LIKE', 'SUPERLIKE'];

const swipeSchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: [true, 'Thiếu profileId'],
      index: true,
    },
    action: {
      type: String,
      required: [true, 'Thiếu action'],
      enum: {
        values: SWIPE_ACTIONS,
        message: 'action chỉ được là NOPE, LIKE hoặc SUPERLIKE',
      },
    },
  },
  // Chỉ cần thời gian tạo, không cần thời gian sửa
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Swipe = mongoose.model('Swipe', swipeSchema);

export default Swipe;
