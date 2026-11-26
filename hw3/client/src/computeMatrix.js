// Tính ma trận bất cân xứng: so sánh mức độ từng vi phạm với mức án.
// Hàm thuần, không dùng React.

// ===== Các mốc kết luận: sửa ở đây =====
// Chênh lệch = mức án − mức độ vi phạm
//   chênh < SLIGHTLY_HARSH            → Tương xứng
//   SLIGHTLY_HARSH ≤ chênh < TOO_HARSH → Hơi nặng
//   chênh ≥ TOO_HARSH                  → Quá nặng
export const MATRIX_THRESHOLDS = {
  SLIGHTLY_HARSH: 1,
  TOO_HARSH: 3,
};

export const VERDICTS = {
  PROPORTIONATE: { key: 'PROPORTIONATE', label: 'Tương xứng' },
  SLIGHTLY_HARSH: { key: 'SLIGHTLY_HARSH', label: 'Hơi nặng' },
  TOO_HARSH: { key: 'TOO_HARSH', label: 'Quá nặng' },
};

export function getVerdict(gap) {
  if (gap >= MATRIX_THRESHOLDS.TOO_HARSH) return VERDICTS.TOO_HARSH;
  if (gap >= MATRIX_THRESHOLDS.SLIGHTLY_HARSH) return VERDICTS.SLIGHTLY_HARSH;
  return VERDICTS.PROPORTIONATE;
}

// Trả về { level, rows: [...], summary: {...} | null }
export function computeMatrix(violations, penaltyLevel) {
  const level = Number(penaltyLevel);
  const list = Array.isArray(violations) ? violations : [];

  if (!Number.isFinite(level) || list.length === 0) {
    return { level: Number.isFinite(level) ? level : null, rows: [], summary: null };
  }

  const rows = list.map((v, index) => {
    const severity = Number(v.severity);
    const gap = level - severity;
    return {
      id: v._id ?? String(index),
      type: v.type,
      severity,
      level,
      gap,
      verdict: getVerdict(gap),
    };
  });

  const maxSeverity = Math.max(...rows.map((r) => r.severity));
  const summaryGap = level - maxSeverity;

  return {
    level,
    rows,
    summary: {
      maxSeverity,
      level,
      gap: summaryGap,
      verdict: getVerdict(summaryGap),
    },
  };
}
