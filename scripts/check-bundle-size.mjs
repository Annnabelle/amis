#!/usr/bin/env node
/**
 * Бюджет размера сборки: держит регрессии видимыми.
 *
 * Проверяется распакованный размер — именно он тратит время на разбор
 * JavaScript, и именно он растёт незаметно при новой зависимости.
 */
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';

const ASSETS_DIR = path.join(process.cwd(), 'dist', 'assets');

/** Лимиты в килобайтах: запас над текущими размерами — на рост по делу. */
const MAX_CHUNK_KB = 1200;
const MAX_TOTAL_KB = 3400;

const toKb = (bytes) => Math.round(bytes / 1024);

const files = (await readdir(ASSETS_DIR)).filter((name) => name.endsWith('.js'));

if (!files.length) {
  console.error('Bundle size check: в dist/assets нет js-файлов — сборка не выполнялась.');
  process.exit(1);
}

const sizes = await Promise.all(
  files.map(async (name) => ({
    name,
    kb: toKb((await stat(path.join(ASSETS_DIR, name))).size),
  })),
);

const totalKb = sizes.reduce((sum, file) => sum + file.kb, 0);
const tooBig = sizes.filter((file) => file.kb > MAX_CHUNK_KB);
const biggest = [...sizes].sort((a, b) => b.kb - a.kb).slice(0, 5);

console.log(
  `Bundle size check: ${files.length} чанков, ${totalKb} КБ всего (лимит ${MAX_TOTAL_KB} КБ).`,
);
biggest.forEach((file) => console.log(`  ${String(file.kb).padStart(6)} КБ  ${file.name}`));

const problems = [];

tooBig.forEach((file) =>
  problems.push(`чанк ${file.name} — ${file.kb} КБ при лимите ${MAX_CHUNK_KB} КБ`),
);

if (totalKb > MAX_TOTAL_KB) {
  problems.push(`сумма чанков ${totalKb} КБ при лимите ${MAX_TOTAL_KB} КБ`);
}

if (problems.length) {
  console.error('\nBundle size check failed:');
  problems.forEach((problem) => console.error(`  - ${problem}`));
  console.error('\nЛибо разнести код по чанкам, либо поднять лимит осознанно.');
  process.exit(1);
}
