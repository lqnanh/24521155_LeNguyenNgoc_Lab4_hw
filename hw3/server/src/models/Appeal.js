import mongoose from 'mongoose';
import { APPEAL_REASONS, EMAIL_PATTERN, isHttpUrl } from '../validateAppeal.js';

const appealSchema = new mongoose.Schema(
  {
    playerId: {
      type: String,
      required: [true, 'Thiếu playerId'],
      lowercase: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: [true, 'Thiếu họ tên người gửi'],
      trim: true,
      minlength: [2, 'Họ tên quá ngắn'],
      maxlength: [100, 'Họ tên tối đa 100 ký tự'],
    },
    email: {
      type: String,
      required: [true, 'Thiếu email'],
      trim: true,
      lowercase: true,
      match: [EMAIL_PATTERN, 'Email không hợp lệ'],
    },
    reason: {
      type: String,
      required: [true, 'Thiếu lý do kháng cáo'],
      enum: {
        values: APPEAL_REASONS,
        message: 'Lý do kháng cáo không hợp lệ',
      },
    },
    statement: {
      type: String,
      required: [true, 'Thiếu nội dung trình bày'],
      trim: true,
      minlength: [30, 'Nội dung trình bày cần ít nhất 30 ký tự'],
      maxlength: [2000, 'Nội dung trình bày tối đa 2000 ký tự'],
    },
    evidenceUrl: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: (value) => !value || isHttpUrl(value),
        message: 'Link bằng chứng phải bắt đầu bằng http:// hoặc https://',
      },
    },
    agreed: {
      type: Boolean,
      required: [true, 'Phải đồng ý cam kết'],
      validate: {
        validator: (value) => value === true,
        message: 'Phải đồng ý cam kết',
      },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model('Appeal', appealSchema);
