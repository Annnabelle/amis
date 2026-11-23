import type { ReactNode } from "react";
// eslint-disable-next-line no-restricted-syntax -- оболочка над тостами
import { toast, type Id, type ToastOptions, type UpdateOptions } from "react-toastify";

const MOBILE_MEDIA_QUERY = "(max-width: 600px)";

/** На узком экране тост встаёт снизу и не закрывает шапку страницы. */
const resolvePosition = (): ToastOptions["position"] => {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return undefined;
  }

  return window.matchMedia(MOBILE_MEDIA_QUERY).matches ? "bottom-center" : undefined;
};

const show =
  (kind: "success" | "error" | "info" | "warning") =>
  (message: ReactNode, options?: ToastOptions) =>
    toast[kind](message, { position: resolvePosition(), ...options });

/**
 * Единственная точка показа уведомлений.
 *
 * Общие настройки — положение на узком экране, в дальнейшем длительность и
 * оформление — живут здесь, а страницы передают только текст.
 */
export const notify = {
  success: show("success"),
  error: show("error"),
  info: show("info"),
  warning: show("warning"),
  /** Обновление показанного тоста по его идентификатору. */
  update: (id: Id, options: UpdateOptions) => toast.update(id, options),
  isActive: (id: Id) => toast.isActive(id),
  dismiss: (id?: Id) => toast.dismiss(id),
};
