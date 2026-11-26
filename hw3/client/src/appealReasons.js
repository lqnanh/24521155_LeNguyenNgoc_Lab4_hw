import { APPEAL_REASONS } from './validateAppeal.js';

// Chữ tiếng Việt cho từng mã lý do kháng cáo
export const REASON_LABELS = {
  DISPROPORTIONATE_PENALTY: 'Án phạt quá nặng so với mức vi phạm',
  INSUFFICIENT_EVIDENCE: 'Bằng chứng không đủ hoặc không chính xác',
  PROCEDURAL_ERROR: 'Sai quy trình xử lý kỷ luật',
  NEW_EVIDENCE: 'Có bằng chứng mới',
};

// Danh sách lựa chọn cho ô chọn, theo đúng thứ tự trong APPEAL_REASONS
export const REASON_OPTIONS = APPEAL_REASONS.map((value) => ({
  value,
  label: REASON_LABELS[value] ?? value,
}));

export function reasonLabel(value) {
  return REASON_LABELS[value] ?? value;
}
