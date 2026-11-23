import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Languages from "shared/ui/languages";
import { renderWithProviders } from "test/render";

describe("переключатель языка", () => {
  it("открывается с клавиатуры и предлагает языки", async () => {
    renderWithProviders(<Languages />);

    const trigger = screen.getByRole("button", { name: "Язык интерфейса" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    trigger.focus();
    await userEvent.keyboard("{Enter}");

    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getAllByRole("menuitem")).toHaveLength(3);
  });

  it("язык выбирается с клавиатуры", async () => {
    const chosen: string[] = [];
    renderWithProviders(<Languages onLanguageChange={(language) => chosen.push(language)} />);

    screen.getByRole("button", { name: "Язык интерфейса" }).focus();
    await userEvent.keyboard("{Enter}");

    const option = screen.getByRole("menuitem", { name: "English" });
    option.focus();
    await userEvent.keyboard("{Enter}");

    expect(chosen).toEqual(["en"]);
  });
});
