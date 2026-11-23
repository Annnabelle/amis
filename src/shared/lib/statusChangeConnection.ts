import { useSyncExternalStore } from "react";

/**
 * Состояние соединения с раздачей уведомлений.
 *
 * `offline` означает, что переходы статусов приходить перестали: список на
 * экране может расходиться с сервером, пока соединение не поднимется.
 */
export const StatusChangeConnectionStates = {
  Online: "online",
  Offline: "offline",
} as const;

export type StatusChangeConnectionState =
  (typeof StatusChangeConnectionStates)[keyof typeof StatusChangeConnectionStates];

/**
 * Причина разрыва, по которой сервер отказал в соединении.
 *
 * Гейтвей рвёт сокет в handleConnection — без события ошибки и без кода, так
 * что отличить протухший токен от перезапуска сервера клиенту нечем: обе
 * ситуации лечатся продлением сессии и новым подключением.
 */
const SERVER_DISCONNECT_REASON = "io server disconnect";

export const isServerRejection = (reason: string): boolean =>
  reason === SERVER_DISCONNECT_REASON;

let state: StatusChangeConnectionState = StatusChangeConnectionStates.Online;
const listeners = new Set<() => void>();

export const getStatusChangeConnection = (): StatusChangeConnectionState => state;

export const setStatusChangeConnection = (next: StatusChangeConnectionState) => {
  if (state === next) return;

  state = next;
  listeners.forEach((listener) => listener());
};

export const subscribeToStatusChangeConnection = (listener: () => void) => {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
};

/** Состояние соединения для интерфейса: шапка показывает отключение. */
export const useStatusChangeConnection = (): StatusChangeConnectionState =>
  useSyncExternalStore(
    subscribeToStatusChangeConnection,
    getStatusChangeConnection,
    getStatusChangeConnection,
  );
