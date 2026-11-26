import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import SimpleForm from '../form/SimpleForm.jsx';
import InputField from '../form/InputField.jsx';
import { useFormContext } from '../form/FormContext.js';
import { validateAppeal } from '../validateAppeal.js';
import { REASON_OPTIONS } from '../appealReasons.js';
import { ApiError, isAbortError, submitAppeal } from '../api.js';
import ShowData from './ShowData.jsx';
import styles from './AppealForm.module.css';

const INITIAL_VALUES = {
  fullName: '',
  email: '',
  reason: '',
  statement: '',
  evidenceUrl: '',
  agreed: false,
};

const EXPIRED_MESSAGE = 'Đã hết hạn kháng cáo, không thể gửi đơn';
const UNEXPECTED_MESSAGE = 'Đã có lỗi không mong muốn khi gửi đơn. Vui lòng thử lại.';

// Câu thông báo cho các lỗi không gắn với ô nào (409, 404, mất kết nối, lỗi máy chủ...)
function messageFor(err) {
  if (err instanceof ApiError) {
    if (err.status === 409) return err.message || EXPIRED_MESSAGE;
    if (err.status === 404) return 'Không tìm thấy hồ sơ tuyển thủ này, không thể gửi đơn.';
    return err.message || `Máy chủ báo lỗi (mã ${err.status}).`;
  }
  return UNEXPECTED_MESSAGE;
}

function SubmitButton() {
  const { submitting } = useFormContext();
  return (
    <button type="submit" disabled={submitting} className={styles.primary}>
      {submitting ? 'Đang gửi...' : 'Gửi đơn kháng cáo'}
    </button>
  );
}

function ResetButton() {
  const { reset, submitting } = useFormContext();
  return (
    <button type="button" onClick={reset} disabled={submitting} className={styles.secondary}>
      Làm lại
    </button>
  );
}

export default function AppealForm({ playerId, playerName, isExpired, headingId }) {
  const [savedAppeal, setSavedAppeal] = useState(null);
  const [formError, setFormError] = useState(null);
  const controllerRef = useRef(null);
  const headingRef = useRef(null);

  // Rời trang hoặc đổi tuyển thủ (component bị gỡ) thì huỷ yêu cầu đang gửi dở
  useEffect(() => {
    return () => controllerRef.current?.abort();
  }, []);

  function handleError(err, showServerErrors) {
    // 400 có danh sách lỗi theo ô → hiện dưới từng ô
    if (err instanceof ApiError && err.status === 400) {
      const fieldErrors = err.data?.errors;
      if (fieldErrors && typeof fieldErrors === 'object') {
        const shown = showServerErrors(fieldErrors);
        if (!shown) {
          // Lỗi rơi vào ô không có trên form → vẫn phải báo cho người dùng
          const messages = Object.values(fieldErrors).filter((m) => typeof m === 'string');
          setFormError(messages.join(' ') || 'Dữ liệu gửi lên không hợp lệ.');
        }
        return;
      }
    }
    setFormError(messageFor(err));
  }

  async function handleSubmit(values, { showServerErrors }) {
    if (isExpired) {
      setFormError(EXPIRED_MESSAGE);
      return;
    }

    setFormError(null);
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const saved = await submitAppeal(playerId, values, { signal: controller.signal });
      if (controller.signal.aborted) return;
      if (!saved || typeof saved !== 'object') {
        setFormError('Máy chủ không trả về dữ liệu đơn. Vui lòng thử lại.');
        return;
      }
      // Hiện kết quả ngay rồi đưa con trỏ tới tiêu đề mới
      flushSync(() => setSavedAppeal(saved));
      headingRef.current?.focus();
    } catch (err) {
      if (isAbortError(err) || controller.signal.aborted) return; // bị huỷ: không báo lỗi
      try {
        handleError(err, showServerErrors);
      } catch (innerErr) {
        console.error(innerErr);
        setFormError(UNEXPECTED_MESSAGE);
      }
    } finally {
      if (controllerRef.current === controller) controllerRef.current = null;
    }
  }

  // Gửi thành công: ẩn form, hiện dữ liệu server trả về
  if (savedAppeal) {
    return (
      <>
        <h2 id={headingId} ref={headingRef} tabIndex={-1}>
          Đã gửi đơn kháng cáo
        </h2>
        <div className={styles.result}>
          <ShowData data={savedAppeal} playerName={playerName} />
        </div>
      </>
    );
  }

  return (
    <>
      <h2 id={headingId} ref={headingRef} tabIndex={-1}>
        Gửi đơn kháng cáo
      </h2>

      {isExpired ? (
        <p className={styles.expired}>{EXPIRED_MESSAGE}</p>
      ) : (
        <p className={styles.note}>Các ô có dấu * là bắt buộc.</p>
      )}

      <SimpleForm
        initialValues={INITIAL_VALUES}
        validate={validateAppeal}
        onSubmit={handleSubmit}
        onReset={() => setFormError(null)}
        aria-labelledby={headingId}
      >
        <fieldset disabled={isExpired} className={styles.fieldset}>
          <legend className={styles.srOnly}>Thông tin đơn kháng cáo</legend>

          <InputField name="fullName" label="Họ tên người gửi" required autoComplete="name" />
          <InputField name="email" label="Email" type="email" required autoComplete="email" />
          <InputField
            name="reason"
            label="Lý do kháng cáo"
            type="select"
            required
            placeholder="-- Chọn lý do --"
            options={REASON_OPTIONS}
          />
          <InputField
            name="statement"
            label="Nội dung trình bày"
            type="textarea"
            required
            hint="Từ 30 đến 2000 ký tự."
            counterMax={2000}
          />
          <InputField
            name="evidenceUrl"
            label="Link bằng chứng (không bắt buộc)"
            type="url"
            hint="Ví dụ: https://example.com/video"
          />
          <InputField
            name="agreed"
            label="Tôi cam kết thông tin trong đơn là đúng sự thật"
            type="checkbox"
            required
          />

          {formError && (
            <p role="alert" className={styles.formError}>
              {formError}
            </p>
          )}

          <div className={styles.actions}>
            <SubmitButton />
            <ResetButton />
          </div>
        </fieldset>
      </SimpleForm>
    </>
  );
}
