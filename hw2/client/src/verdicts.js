// Câu nhận xét theo điểm: muốn đổi câu hoặc mốc điểm thì chỉ sửa ở đây.
// Xếp từ điểm cao xuống thấp, lấy mức đầu tiên mà điểm >= minScore.
export const VERDICTS = [
  { minScore: 150, text: 'Ai cũng thích, tim bạn là chợ đầu mối à? 💘' },
  { minScore: 80, text: 'Dễ mến, dễ thương, dễ... bị lừa. Cẩn thận nhé! 😏' },
  { minScore: 30, text: 'Có chọn lọc, có tiêu chuẩn. Mẹ chắc chắn hài lòng. 👌' },
  { minScore: 0, text: 'Thích thì ít, bỏ qua thì nhiều. Đang giữ giá đúng không? 🤔' },
  { minScore: -Infinity, text: 'Khó tính thế này thì ế là đúng rồi. 🧊' },
];

export function getVerdict(score) {
  return VERDICTS.find((verdict) => score >= verdict.minScore).text;
}
