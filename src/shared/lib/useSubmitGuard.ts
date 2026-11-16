import { useRef, useState } from "react";

/**
 * Защита от повторной отправки формы: пока предыдущий запрос не завершён,
 * новые вызовы обработчика игнорируются.
 *
 * Флаг дублируется в ref, потому что setState не успевает примениться
 * между двумя быстрыми кликами по кнопке отправки.
 *
 * Обработчик должен возвращать promise (быть async) — иначе защита снимется
 * до того, как запрос завершится.
 */
export function useSubmitGuard<TArgs extends unknown[]>(
  handler: (...args: TArgs) => void | Promise<void>
) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmittingRef = useRef(false);

  const onSubmit = async (...args: TArgs) => {
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      await handler(...args);
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, onSubmit };
}
