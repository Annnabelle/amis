import { io, type Socket } from "socket.io-client";

import { BASE_URL } from "shared/lib/consts";
import { debugLog } from "shared/lib/debugLog";
import {
  isServerRejection,
  setStatusChangeConnection,
  StatusChangeConnectionStates,
} from "shared/lib/statusChangeConnection";
import {
  emitStatusChange,
  type StatusChangeNotification,
} from "shared/lib/statusChanges";

const STATUS_CHANGE_EVENT = "statusChange";

type ConnectOptions = {
  token: string;
  /**
   * Сервер отказал в соединении. socket.io после такого разрыва сам не
   * переподключается, поэтому поднимать сессию и соединение — дело вызывающего.
   */
  onServerRejection: () => void;
};

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
export const connectStatusChanges = ({
  token,
  onServerRejection,
}: ConnectOptions): Socket => {
  const socket = io(BASE_URL, {
    auth: { token },
    // Апгрейд nginx пропускает; long-polling остаётся запасным путём.
    transports: ["websocket", "polling"],
    withCredentials: false,
  });

  socket.on("connect", () => {
    setStatusChangeConnection(StatusChangeConnectionStates.Online);
  });

  socket.on("connect_error", (error: Error) => {
    // Сеть, прокси или остановленный сервер: socket.io пробует снова сам.
    setStatusChangeConnection(StatusChangeConnectionStates.Offline);
    debugLog.warn("[statusChanges] connect error", error.message);
  });

  socket.on("disconnect", (reason: string) => {
    setStatusChangeConnection(StatusChangeConnectionStates.Offline);
    debugLog.info("[statusChanges] disconnected", reason);

    if (isServerRejection(reason)) {
      onServerRejection();
    }
  });

  socket.on(STATUS_CHANGE_EVENT, (notification: StatusChangeNotification) => {
    emitStatusChange(notification);
  });

  return socket;
};
