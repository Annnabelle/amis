import { io, type Socket } from "socket.io-client";

import { BASE_URL } from "shared/lib/consts";
import {
  emitStatusChange,
  type StatusChangeNotification,
} from "shared/lib/statusChanges";

const STATUS_CHANGE_EVENT = "statusChange";

/**
 * Соединение с раздачей уведомлений о переходах статуса.
 *
 * Адрес — тот же, что у API: сокеты раздаёт core, и отдельного хоста под них
 * нет. Токен уходит в handshake.auth, как его ждёт гейтвей; компанию клиент не
 * называет — комнаты выдаются по членствам на стороне сервера.
 *
 * pingInterval не задаём: умолчание socket.io (25 с) согласовано с
 * proxy_read_timeout у nginx. Подняв одно, надо поднимать и другое, иначе
 * соединение будет рваться по таймауту прокси.
 */
export const connectStatusChanges = (token: string): Socket => {
  const socket = io(BASE_URL, {
    auth: { token },
    // Апгрейд nginx пропускает; long-polling остаётся запасным путём.
    transports: ["websocket", "polling"],
    withCredentials: false,
  });

  socket.on(STATUS_CHANGE_EVENT, (notification: StatusChangeNotification) => {
    emitStatusChange(notification);
  });

  return socket;
};
