import { beforeEach, describe, expect, it, vi } from "vitest";

const calls = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
  update: vi.fn(),
  isActive: vi.fn(),
  dismiss: vi.fn(),
}));

vi.mock("react-toastify", () => ({ toast: calls }));

import { notify } from "shared/lib/notify";

/** Ширину экрана задаёт matchMedia: его и подменяем. */
const setNarrow = (matches: boolean) => {
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
};

beforeEach(() => {
  Object.values(calls).forEach((mock) => mock.mockClear());
});

describe("уведомления", () => {
  it("на широком экране оставляет положение тоста по умолчанию", () => {
    setNarrow(false);

    notify.success("Сохранено");

    expect(calls.success).toHaveBeenCalledWith("Сохранено", { position: undefined });
  });

  it("на узком экране показывает тост снизу", () => {
    setNarrow(true);

    notify.error("Ошибка");

    expect(calls.error).toHaveBeenCalledWith("Ошибка", { position: "bottom-center" });
  });

  it("настройки вызова важнее общих", () => {
    setNarrow(true);

    notify.info("Идёт обработка", { position: "top-right", autoClose: 2200 });

    expect(calls.info).toHaveBeenCalledWith("Идёт обработка", {
      position: "top-right",
      autoClose: 2200,
    });
  });
});
