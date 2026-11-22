import type { ReactElement, ReactNode } from "react";
import { render as renderWithoutProviders } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import ru from "shared/localization/ru";

/**
 * Отдельный экземпляр i18next: переводы подставляются синхронно, без чанков и
 * без обращения к приложению.
 */
export const testI18n = i18n.createInstance();

void testI18n.use(initReactI18next).init({
  lng: "ru",
  fallbackLng: "ru",
  resources: { ru: { translation: ru } },
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

type RenderOptions = {
  /** Начальный адрес: от него зависят права и разбор компании. */
  route?: string;
  /** Состояние стора целиком — тест задаёт только то, что читает компонент. */
  preloadedState?: Record<string, unknown>;
  /** Редьюсеры под состояние теста. */
  reducers?: Record<string, (state: unknown) => unknown>;
};

const identity = (state: unknown = null) => state;

/**
 * Рендер компонента в том окружении, которое он ждёт от приложения: стор,
 * переводы и маршрут.
 */
export const renderWithProviders = (
  ui: ReactElement,
  { route = "/", preloadedState = {}, reducers }: RenderOptions = {},
) => {
  const reducer = Object.fromEntries(
    Object.keys(preloadedState).map((key) => [key, reducers?.[key] ?? identity]),
  );

  const store = configureStore({
    reducer: Object.keys(reducer).length ? reducer : { noop: identity },
    preloadedState: Object.keys(reducer).length ? preloadedState : undefined,
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <I18nextProvider i18n={testI18n}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </I18nextProvider>
    </Provider>
  );

  return { store, ...renderWithoutProviders(ui, { wrapper }) };
};
