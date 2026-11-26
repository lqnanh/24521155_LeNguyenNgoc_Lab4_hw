import { reasonLabel } from '../appealReasons.js';
import { formatDateTime } from '../format.js';
import styles from './ShowData.module.css';

function Row({ label, children }) {
  return (
    <div className={styles.row}>
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

// Hiện dữ liệu đơn kháng cáo bằng <dl>, không dùng JSON.stringify
export default function ShowData({ data, playerName }) {
  const evidenceUrl = text(data.evidenceUrl);

  return (
    <dl className={styles.list}>
      {data._id && <Row label="Mã đơn">{data._id}</Row>}
      {playerName && <Row label="Kháng cáo cho">{playerName}</Row>}
      {data.playerId && <Row label="Mã tuyển thủ">{data.playerId}</Row>}
      <Row label="Họ tên">{text(data.fullName)}</Row>
      <Row label="Email">{text(data.email).toLowerCase()}</Row>
      <Row label="Lý do kháng cáo">{reasonLabel(data.reason)}</Row>
      <Row label="Nội dung trình bày">
        <span className={styles.multiline}>{text(data.statement)}</span>
      </Row>
      <Row label="Link bằng chứng">{evidenceUrl || 'Không có'}</Row>
      <Row label="Đã đồng ý cam kết">{data.agreed === true ? 'Có' : 'Không'}</Row>
      {data.createdAt && (
        <Row label="Thời điểm gửi">
          <time dateTime={data.createdAt}>{formatDateTime(data.createdAt)}</time>
        </Row>
      )}
    </dl>
  );
}
