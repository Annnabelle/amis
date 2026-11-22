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
требует токен с правом `read:packages`. Репозиторный `.npmrc` берёт его из
переменной окружения:

```bash
# ~/.bashrc, ~/.zshrc или переменные среды Windows
export GITHUB_TOKEN=<токен с read:packages>
```

Токен создаётся в GitHub → Settings → Developer settings → Personal access
tokens; fine-grained токену достаточно прав `Packages: read` на организацию.
`npm ci`, упавший с `401 Unauthorized` на `npm.pkg.github.com`, означает именно
отсутствующий или просроченный токен. В CI то же место закрывает секрет
`PACKAGES_READ_TOKEN`.

## Команды

| Команда                   | Что делает                                              |
| ------------------------- | ------------------------------------------------------- |
| `npm run dev`             | дев-сервер Vite                                         |
| `npm run build`           | пять проверок ниже, `tsc -b` и сборка                   |
| `npm run check:endpoints` | сверяет каждый запрос с картой доступа                  |
| `npm run check:contracts` | падает, пока в `dtos/` лежит временная форма контракта  |
| `npm run check:localization` | сверяет ключи трёх языков и находит забытые          |
| `npm run check:dist-config` | в CI не даёт конфигурации уехать в артефакт           |
| `npm run check:bundle`    | бюджет размера чанков                                   |
| `npm run test`            | vitest (`shared/api`, `shared/lib`, `shared/config`, связка стора) |
| `npm run lint`            | eslint; входит в оба пайплайна деплоя                   |
| `npm run preview`         | отдаёт собранный `dist/`                                |

## Конфигурация окружения

Адрес API и ключи Яндекса читаются из `window.__CONFIG__`, который задаёт
`/runtime-config.js` — обычный скрипт рядом с бандлом. В коде значения доступны
только через `shared/config/runtime.ts`.

**Файл приходит от окружения, а не из сборки.** В артефакте его нет: на стенде
его отдаёт nginx из каталога окружения, локально — копия примера. Поэтому смена
адреса API не требует пересборки, а дев-значения не могут уехать на прод.

Локально:

```bash
cp runtime-config.example.js public/runtime-config.js
```

`public/runtime-config.js` в `.gitignore`. Без него `npm run dev` всё равно
поднимется: в дев-режиме подставляется `http://127.0.0.1:3000`. В собранном
приложении умолчаний нет — без `API_BASE_URL` и `ENV` вместо белого экрана
показывается страница «Приложение не настроено» с перечнем недостающих полей.

На сервере:

```nginx
# Конфигурация живёт вне релиза и переживает деплой
location = /runtime-config.js {
    alias /etc/amis/frontend/runtime-config.js;
    add_header Cache-Control "no-store";
}
```

`npm run check:dist-config` следит за границей: в CI сборка падает, если
конфигурация всё-таки попала в `dist/`. На своей машине проверка только
предупреждает — там файл в `public/` лежит по делу.

## Деплой

`.github/workflows/deploy.yml` собирает каждый push в `master` и выкладывает
артефакт; сам деплой запускается вручную через `workflow_dispatch`.
`stage-deploy.yml` — то же для стейджа. Оба прогоняют `npm run lint` перед
сборкой.
