import { describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ErrorBoundary from "shared/ui/errorBoundary";
import { renderWithProviders } from "test/render";

const Boom = ({ explode }: { explode: boolean }) => {
  if (explode) throw new Error("обращение к полю необязательного DTO");

  return <span>страница</span>;
};

describe("ErrorBoundary", () => {
  it("ошибка рендера заменяется фолбэком, а не белым экраном", () => {
    // React печатает пойманную ошибку в консоль — в отчёте теста она лишняя.
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    renderWithProviders(
      <ErrorBoundary>
        <Boom explode />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Что-то пошло не так")).toBeInTheDocument();
    expect(screen.queryByText("страница")).not.toBeInTheDocument();

    consoleError.mockRestore();
  });

  it("кнопка «Попробовать снова» поднимает поддерево заново", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const user = userEvent.setup();

    const { rerender } = renderWithProviders(
      <ErrorBoundary>
        <Boom explode />
      </ErrorBoundary>,
    );

    rerender(
      <ErrorBoundary>
        <Boom explode={false} />
      </ErrorBoundary>,
    );
    await user.click(screen.getByRole("button", { name: "Попробовать снова" }));

    expect(screen.getByText("страница")).toBeInTheDocument();

    consoleError.mockRestore();
  });

  it("переход на другой маршрут снимает упавшее состояние", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    const { rerender } = renderWithProviders(
      <ErrorBoundary resetKey="/orders">
        <Boom explode />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Что-то пошло не так")).toBeInTheDocument();

    rerender(
      <ErrorBoundary resetKey="/products">
        <Boom explode={false} />
      </ErrorBoundary>,
    );

    expect(screen.getByText("страница")).toBeInTheDocument();

    consoleError.mockRestore();
  });
});
