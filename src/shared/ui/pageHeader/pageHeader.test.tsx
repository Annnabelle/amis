import { afterEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PageHeader from "shared/ui/pageHeader";
import { renderWithProviders } from "test/render";

/** Ширину экрана задаёт matchMedia: его и подменяем. */
const setMobile = (matches: boolean) => {
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

afterEach(() => {
  setMobile(false);
});

describe("заголовок страницы", () => {
  it("на десктопе показывает заголовок, кнопку возврата и действия", () => {
    setMobile(false);

    renderWithProviders(
      <PageHeader
        title="Компания"
        subtitle="Детали"
        onBack={() => {}}
        backLabel="Назад к списку"
        actions={<button type="button">Войти</button>}
      />,
    );

    expect(screen.getByText("Компания")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Назад к списку" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Войти" })).toBeInTheDocument();
  });

  it("на мобильном оставляет панель со стрелкой, и у стрелки есть имя", () => {
    setMobile(true);

    renderWithProviders(
      <PageHeader
        title="Компания"
        subtitle="Детали"
        onBack={() => {}}
        backLabel="Назад к списку"
      />,
    );

    expect(screen.queryByText("Компания")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Назад к списку" })).toBeInTheDocument();
  });

  it("мобильные действия задаются отдельно от десктопных", () => {
    setMobile(true);

    renderWithProviders(
      <PageHeader
        title="Рейс"
        actions={<button type="button">Печать</button>}
        mobileActions={<button type="button">Погрузка</button>}
      />,
    );

    expect(screen.getByRole("button", { name: "Погрузка" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Печать" })).not.toBeInTheDocument();
  });

  it("возврат срабатывает по нажатию", async () => {
    setMobile(false);
    const onBack = vi.fn();

    renderWithProviders(
      <PageHeader title="Компания" onBack={onBack} backLabel="Назад к списку" />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Назад к списку" }));

    expect(onBack).toHaveBeenCalledOnce();
  });
});
