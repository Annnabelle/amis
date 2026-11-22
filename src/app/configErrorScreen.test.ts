import { afterEach, describe, expect, it } from "vitest";

import { renderConfigErrorScreen } from "app/configErrorScreen";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("экран «Приложение не настроено»", () => {
  it("называет каждое недостающее поле", () => {
    document.body.innerHTML = '<div id="root"></div>';

    renderConfigErrorScreen(["API_BASE_URL — адрес бэкенда", "ENV — имя окружения"]);

    const root = document.getElementById("root");

    expect(root?.textContent).toContain("Приложение не настроено");
    expect(root?.textContent).toContain("API_BASE_URL — адрес бэкенда");
    expect(root?.textContent).toContain("ENV — имя окружения");
    expect(root?.querySelectorAll("li")).toHaveLength(2);
  });

  it("без корневого узла ничего не делает и не падает", () => {
    expect(() => renderConfigErrorScreen(["API_BASE_URL"])).not.toThrow();
  });
});
