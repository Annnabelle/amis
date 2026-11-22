import { beforeEach, describe, expect, it } from "vitest";

import {
  getStatusChangeConnection,
  isServerRejection,
  setStatusChangeConnection,
  StatusChangeConnectionStates,
  subscribeToStatusChangeConnection,
} from "shared/lib/statusChangeConnection";

describe("соединение с уведомлениями", () => {
  beforeEach(() => {
    setStatusChangeConnection(StatusChangeConnectionStates.Online);
  });

  it("отказ сервера отличается от обрыва связи", () => {
    // Гейтвей рвёт сокет сам, и socket.io после этого не переподключается.
    expect(isServerRejection("io server disconnect")).toBe(true);
    expect(isServerRejection("transport close")).toBe(false);
    expect(isServerRejection("ping timeout")).toBe(false);
    expect(isServerRejection("io client disconnect")).toBe(false);
  });

  it("состояние меняется и доходит до подписчика", () => {
    const seen: string[] = [];
    const unsubscribe = subscribeToStatusChangeConnection(() =>
      seen.push(getStatusChangeConnection()),
    );

    setStatusChangeConnection(StatusChangeConnectionStates.Offline);
    setStatusChangeConnection(StatusChangeConnectionStates.Online);

    expect(seen).toEqual(["offline", "online"]);

    unsubscribe();
  });

  it("повторное то же состояние подписчиков не будит", () => {
    let calls = 0;
    const unsubscribe = subscribeToStatusChangeConnection(() => {
      calls += 1;
    });

    setStatusChangeConnection(StatusChangeConnectionStates.Offline);
    setStatusChangeConnection(StatusChangeConnectionStates.Offline);

    expect(calls).toBe(1);

    unsubscribe();
  });
});
