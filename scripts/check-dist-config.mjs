#!/usr/bin/env node
/**
 * Артефакт сборки не содержит конфигурации окружения.
 *
 * Vite копирует public/ в dist целиком, поэтому локальный runtime-config.js
 * уезжает в сборку вместе с адресом дев-бэкенда. На машине разработчика это
 * удобно и проверка только предупреждает; в CI собирается то, что поедет на
 * стенд, и там наличие файла — ошибка.
 */
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const CONFIG_PATH = path.join(process.cwd(), 'dist', 'runtime-config.js');
const isCi = Boolean(process.env.CI);

const exists = await access(CONFIG_PATH).then(
  () => true,
  () => false,
);

if (!exists) {
  console.log('Dist config check: артефакт без конфигурации — её отдаёт окружение.');
  process.exit(0);
}

const contents = (await readFile(CONFIG_PATH, 'utf8')).trim();

if (!isCi) {
  console.log(
    'Dist config check: в dist попал локальный runtime-config.js — для сборки на своей машине это нормально.',
  );
  process.exit(0);
}

console.error('Dist config check failed: в артефакт попала конфигурация окружения.');
console.error(`  ${CONFIG_PATH}`);
console.error(`  ${contents.split('\n').slice(0, 6).join('\n  ')}`);
console.error(
  '\nФайл обязан приходить от окружения: на стенде его отдаёт nginx из каталога окружения.',
);
console.error('Локальная копия лежит в .gitignore — проверьте, что она не попала в репозиторий.');
process.exit(1);
