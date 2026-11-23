import { notify } from "shared/lib/notify";

/** Долгий код в тосте сокращается: целиком он всё равно не читается. */
export const formatCodeForToast = (code: string) => {
  const trimmed = code.trim();
  if (trimmed.length <= 24) return trimmed;

  return `${trimmed.slice(0, 12)}...${trimmed.slice(-8)}`;
};

const SCAN_TOAST_AUTO_CLOSE = 2200;

/**
 * Один тост на поток сканирования: следующий код обновляет показанный.
 *
 * Сканер стреляет кодами подряд, и каждый свой тост превратил бы экран в
 * ленту уведомлений.
 */
export const createScanToast = (toastId: string) => (
  type: "success" | "error",
  message: string,
) => {
  if (notify.isActive(toastId)) {
    notify.update(toastId, {
      render: message,
      type,
      autoClose: SCAN_TOAST_AUTO_CLOSE,
    });

    return;
  }

  notify[type](message, { toastId, autoClose: SCAN_TOAST_AUTO_CLOSE });
};
