import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { FormContext } from './FormContext.js';
import { validateAppeal } from '../validateAppeal.js';
import styles from './SimpleForm.module.css';

export default function SimpleForm({
  initialValues,
  validate = validateAppeal,
  onSubmit,
  onReset,
  children,
  className,
  ...formProps
}) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  // Lỗi từ server không tự tính ra được nên phải giữ lại; lỗi phía giao diện vẫn tính lúc render
  const [serverErrors, setServerErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false); // chặn bấm gửi 2 lần liên tiếp
  const formRef = useRef(null);

  const clientErrors = validate(values);
  // Ô nào có lỗi phía giao diện thì ưu tiên lỗi đó, không thì dùng lỗi server
  const errors = { ...serverErrors, ...clientErrors };

  function setValue(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Người dùng sửa ô thì bỏ lỗi server của ô đó
    setServerErrors((prev) => {
      if (!(name in prev)) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }

  function markTouched(name) {
    setTouched((prev) => (prev[name] ? prev : { ...prev, [name]: true }));
  }

  // Chỉ hiện lỗi khi ô đã rời khỏi, đã bấm gửi, hoặc server vừa báo lỗi ô đó
  function shouldShowError(name) {
    return Boolean(errors[name]) && (submitted || touched[name] === true || name in serverErrors);
  }

  // Đưa con trỏ tới ô sai đầu tiên (theo thứ tự trên trang). Trả về true nếu tìm thấy ô.
  function focusFirstInvalid(errs) {
    const elements = formRef.current ? Array.from(formRef.current.elements) : [];
    const first = elements.find((el) => el.name && errs[el.name]);
    if (!first) return false;
    first.focus();
    return true;
  }

  // Cho nơi gọi đưa lỗi server vào từng ô. Trả về true nếu có ô tương ứng để hiện lỗi.
  function showServerErrors(errs) {
    const clean = {};
    for (const [field, message] of Object.entries(errs ?? {})) {
      if (typeof message === 'string' && message) clean[field] = message;
    }
    flushSync(() => {
      setServerErrors(clean);
      setSubmitted(true);
    });
    return focusFirstInvalid(clean);
  }

  function reset() {
    setValues(initialValues);
    setTouched({});
    setSubmitted(false);
    setServerErrors({});
    onReset?.();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submittingRef.current) return;

    if (Object.keys(clientErrors).length > 0) {
      // Vẽ lại ngay để mọi chỗ báo lỗi hiện ra, rồi mới đưa con trỏ tới ô sai đầu tiên
      flushSync(() => setSubmitted(true));
      focusFirstInvalid(clientErrors);
      return;
    }

    if (!onSubmit) return;

    submittingRef.current = true;
    setSubmitting(true);
    try {
      await onSubmit(values, { showServerErrors });
    } catch (err) {
      // Lưới an toàn cuối cùng: onSubmit lẽ ra đã tự bắt lỗi
      console.error('Lỗi không mong muốn khi gửi form:', err);
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  const contextValue = {
    values,
    errors,
    touched,
    submitting,
    setValue,
    markTouched,
    shouldShowError,
    reset,
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form
        {...formProps}
        ref={formRef}
        noValidate
        onSubmit={handleSubmit}
        className={className ? `${styles.form} ${className}` : styles.form}
      >
        {children}
      </form>
    </FormContext.Provider>
  );
}
