# AMIS — фронтенд

Веб-приложение AMIS: маркировка, заказы кодов, доставка, документы. React 19 +
TypeScript + Vite, Redux Toolkit с RTK Query, React Router 7, Ant Design 5,
i18next, Sass.

Архитектура, правила слоёв и контур доступа описаны в [CLAUDE.md](./CLAUDE.md) —
читать перед первой правкой.

## Запуск

```bash
npm ci        # нужен доступ к приватному реестру, см. ниже
npm run dev   # http://localhost:5173
```

Пакет `@edem2000/amis.contracts` лежит в GitHub Packages, поэтому `npm ci`
требует токен с правом `read:packages`:

```bash
# ~/.npmrc
//npm.pkg.github.com/:_authToken=<токен>
```

## Команды

| Команда                   | Что делает                                              |
| ------------------------- | ------------------------------------------------------- |
| `npm run dev`             | дев-сервер Vite                                         |
| `npm run build`           | проверка контрактов и эндпоинтов, `tsc -b`, сборка      |
| `npm run check:endpoints` | сверяет каждый запрос с картой доступа                  |
| `npm run check:contracts` | падает, пока в `dtos/` лежит временная форма контракта  |
| `npm run test`            | vitest (`shared/api`, `shared/lib`, связка стора)       |
| `npm run lint`            | eslint; входит в оба пайплайна деплоя                   |
| `npm run preview`         | отдаёт собранный `dist/`                                |

## Конфигурация окружения

Адрес API и ключи Яндекса читаются из `window.__CONFIG__` — его задаёт
`public/runtime-config.js`, обычный скрипт рядом с бандлом:

```js
window.__CONFIG__ = {
  API_BASE_URL: "http://127.0.0.1:3000",
  ENV: "development",
  YANDEX_MAPS_JS_API_KEY: "...",
  YANDEX_GEOCODER_API_KEY: "...",
};
```

Сборка от окружения не зависит: файл заменяется при деплое. В коде значения
читаются только через `shared/config/runtime.ts`. Локальные правки
`public/runtime-config.js` коммитить не нужно.

## Деплой

`.github/workflows/deploy.yml` собирает каждый push в `master` и выкладывает
артефакт; сам деплой запускается вручную через `workflow_dispatch`.
`stage-deploy.yml` — то же для стейджа. Оба прогоняют `npm run lint` перед
сборкой.
