import mongoose from 'mongoose';

const violationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Thiếu loại vi phạm'],
      trim: true,
    },
    severity: {
      type: Number,
      required: [true, 'Thiếu mức độ vi phạm'],
      min: [1, 'Mức độ vi phạm nhỏ nhất là 1'],
      max: [5, 'Mức độ vi phạm lớn nhất là 5'],
      validate: {
        validator: Number.isInteger,
        message: 'Mức độ vi phạm phải là số nguyên',
      },
    },
    evidence: {
      type: String,
      required: [true, 'Thiếu mô tả bằng chứng'],
      trim: true,
    },
    occurredAt: {
      type: Date,
      required: [true, 'Thiếu ngày xảy ra vi phạm'],
    },
  },
  { _id: true }
);

const penaltySchema = new mongoose.Schema(
  {
    matchBan: {
      type: Number,
      required: [true, 'Thiếu số trận bị cấm'],
      min: [0, 'Số trận bị cấm không được âm'],
      validate: {
        validator: Number.isInteger,
        message: 'Số trận bị cấm phải là số nguyên',
      },
    },
    fine: {
      type: Number,
      required: [true, 'Thiếu tiền phạt'],
      min: [0, 'Tiền phạt không được âm'],
    },
    level: {
      type: Number,
      required: [true, 'Thiếu mức án'],
      min: [1, 'Mức án nhỏ nhất là 1'],
      max: [5, 'Mức án lớn nhất là 5'],
      validate: {
        validator: Number.isInteger,
        message: 'Mức án phải là số nguyên',
      },
    },
  },
  { _id: false }
);

const playerSchema = new mongoose.Schema(
  {
    playerId: {
      type: String,
      required: [true, 'Thiếu playerId'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9_-]+$/, 'playerId chỉ gồm chữ thường, số, "_" hoặc "-"'],
    },
    displayName: {
      type: String,
      required: [true, 'Thiếu tên hiển thị'],
      trim: true,
    },
    team: {
      type: String,
      required: [true, 'Thiếu tên đội'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Thiếu vai trò'],
      trim: true,
    },
    violations: {
      type: [violationSchema],
      default: [],
    },
    penalty: {
      type: penaltySchema,
      required: [true, 'Thiếu án phạt'],
    },
    sanctionedAt: {
      type: Date,
      required: [true, 'Thiếu thời điểm ra án'],
    },
    appealDeadline: {
      type: Date,
      required: [true, 'Thiếu hạn kháng cáo'],
      validate: {
        validator(value) {
          return !this.sanctionedAt || value > this.sanctionedAt;
        },
        message: 'Hạn kháng cáo phải sau thời điểm ra án',
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Player', playerSchema);
