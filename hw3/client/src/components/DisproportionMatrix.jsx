import { MATRIX_THRESHOLDS } from '../computeMatrix.js';
import styles from './DisproportionMatrix.module.css';

function gapText(gap) {
  if (gap > 0) return `Nặng hơn ${gap} mức`;
  if (gap < 0) return `Nhẹ hơn ${-gap} mức`;
  return 'Bằng nhau';
}

function Verdict({ verdict }) {
  return <span className={`${styles.badge} ${styles[verdict.key]}`}>{verdict.label}</span>;
}

// Chỉ hiển thị; dữ liệu đã được tính sẵn bằng computeMatrix
export default function DisproportionMatrix({ matrix }) {
  const { SLIGHTLY_HARSH, TOO_HARSH } = MATRIX_THRESHOLDS;

  if (!matrix || matrix.rows.length === 0) {
    return <p>Không có vi phạm để so sánh.</p>;
  }

  return (
    <>
      <p className={styles.note}>
        Chênh lệch = mức án − mức độ vi phạm. Dưới +{SLIGHTLY_HARSH}: Tương xứng · từ +
        {SLIGHTLY_HARSH} đến +{TOO_HARSH - 1}: Hơi nặng · từ +{TOO_HARSH}: Quá nặng.
      </p>

      <div className={styles.scroller} role="region" aria-labelledby="matrix-caption" tabIndex={0}>
        <table className={styles.table}>
          <caption id="matrix-caption" className={styles.caption}>
            So sánh mức độ từng vi phạm với mức án {matrix.level}/5
          </caption>
          <thead>
            <tr>
              <th scope="col">Vi phạm</th>
              <th scope="col">Mức độ vi phạm</th>
              <th scope="col">Mức án</th>
              <th scope="col">Án nặng hơn vi phạm</th>
              <th scope="col">Kết luận</th>
            </tr>
          </thead>
          <tbody>
            {matrix.rows.map((row) => (
              <tr key={row.id}>
                <th scope="row">{row.type}</th>
                <td>{row.severity}/5</td>
                <td>{row.level}/5</td>
                <td>{gapText(row.gap)}</td>
                <td>
                  <Verdict verdict={row.verdict} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Tổng kết (so với vi phạm nặng nhất)</th>
              <td>{matrix.summary.maxSeverity}/5</td>
              <td>{matrix.summary.level}/5</td>
              <td>{gapText(matrix.summary.gap)}</td>
              <td>
                <Verdict verdict={matrix.summary.verdict} />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}
