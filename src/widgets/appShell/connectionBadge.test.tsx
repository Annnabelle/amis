import { afterEach, describe, expect, it } from "vitest";
import { act, screen } from "@testing-library/react";

import ConnectionBadge from "widgets/appShell/connectionBadge";
import {
  setStatusChangeConnection,
  StatusChangeConnectionStates,
} from "shared/lib/statusChangeConnection";
import { renderWithProviders } from "test/render";

afterEach(() => {
  setStatusChangeConnection(StatusChangeConnectionStates.Online);
});

describe("отметка о соединении с уведомлениями", () => {
  it("на живом соединении ничего не показывает", () => {
    renderWithProviders(<ConnectionBadge />);

    expect(screen.queryByText("Уведомления отключены")).not.toBeInTheDocument();
  });

  it("после разрыва предупреждает, что переходы могут отставать", () => {
    renderWithProviders(<ConnectionBadge />);

    act(() => setStatusChangeConnection(StatusChangeConnectionStates.Offline));

    expect(screen.getByText("Уведомления отключены")).toBeInTheDocument();
  });

  it("возвращение связи убирает отметку", () => {
    renderWithProviders(<ConnectionBadge />);

    act(() => setStatusChangeConnection(StatusChangeConnectionStates.Offline));
    act(() => setStatusChangeConnection(StatusChangeConnectionStates.Online));

    expect(screen.queryByText("Уведомления отключены")).not.toBeInTheDocument();
  });
});
