// Kiểm tra đơn kháng cáo.
// KHÔNG import thư viện nào để có thể chép y nguyên sang phía giao diện.

// Danh sách lý do kháng cáo cố định (lưu mã, giao diện sẽ hiện chữ tiếng Việt)
export const APPEAL_REASONS = [
  'DISPROPORTIONATE_PENALTY', // Án phạt quá nặng so với mức vi phạm
  'INSUFFICIENT_EVIDENCE', // Bằng chứng không đủ hoặc không chính xác
  'PROCEDURAL_ERROR', // Sai quy trình xử lý kỷ luật
  'NEW_EVIDENCE', // Có bằng chứng mới
];

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

// Lấy chuỗi đã bỏ khoảng trắng hai đầu; không phải chuỗi thì coi như bỏ trống
function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

// Nhận dữ liệu đơn, trả về { tenO: 'câu báo lỗi' }. Không có lỗi thì trả {}.
export function validateAppeal(data) {
  const input = data !== null && typeof data === 'object' && !Array.isArray(data) ? data : {};
  const errors = {};

  const fullName = text(input.fullName);
  if (!fullName) errors.fullName = 'Thiếu họ tên người gửi';
  else if (fullName.length < 2) errors.fullName = 'Họ tên quá ngắn';
  else if (fullName.length > 100) errors.fullName = 'Họ tên tối đa 100 ký tự';

  const email = text(input.email).toLowerCase();
  if (!email) errors.email = 'Thiếu email';
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Email không hợp lệ';

  const reason = input.reason;
  if (reason === undefined || reason === null || reason === '') {
    errors.reason = 'Thiếu lý do kháng cáo';
  } else if (!APPEAL_REASONS.includes(reason)) {
    errors.reason = 'Lý do kháng cáo không hợp lệ';
  }

  const statement = text(input.statement);
  if (!statement) errors.statement = 'Thiếu nội dung trình bày';
  else if (statement.length < 30) errors.statement = 'Nội dung trình bày cần ít nhất 30 ký tự';
  else if (statement.length > 2000) errors.statement = 'Nội dung trình bày tối đa 2000 ký tự';

  // Link bằng chứng không bắt buộc: bỏ trống thì được, có nhập thì phải là http/https
  const evidenceUrl = input.evidenceUrl;
  if (evidenceUrl !== undefined && evidenceUrl !== null) {
    const ok =
      typeof evidenceUrl === 'string' &&
      (evidenceUrl.trim() === '' || isHttpUrl(evidenceUrl.trim()));
    if (!ok) errors.evidenceUrl = 'Link bằng chứng phải bắt đầu bằng http:// hoặc https://';
  }

  if (input.agreed !== true) errors.agreed = 'Phải đồng ý cam kết';

  return errors;
}
