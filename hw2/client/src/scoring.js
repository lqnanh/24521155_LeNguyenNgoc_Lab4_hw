// Bảng điểm: muốn đổi điểm thì chỉ sửa ở đây
export const SCORE_BY_ACTION = {
  LIKE: 10,
  SUPERLIKE: 25,
  NOPE: -5,
};

// Điểm của một kiểu quẹt
export function getPoints(action) {
  return SCORE_BY_ACTION[action] ?? 0;
}

// Tổng điểm, tính từ danh sách đã quẹt
export function calculateScore(swipes) {
  return swipes.reduce((total, swipe) => total + getPoints(swipe.action), 0);
}

// Đếm số lần mỗi kiểu quẹt: { LIKE: 3, SUPERLIKE: 1, NOPE: 6 }
export function countByAction(swipes) {
  const counts = Object.fromEntries(Object.keys(SCORE_BY_ACTION).map((action) => [action, 0]));
  for (const swipe of swipes) {
    if (swipe.action in counts) counts[swipe.action] += 1;
  }
  return counts;
}

// 10 -> "+10", -5 -> "-5", 0 -> "0"
export function formatPoints(points) {
  return points > 0 ? `+${points}` : String(points);
}
