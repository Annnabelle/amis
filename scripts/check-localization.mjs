#!/usr/bin/env node
/**
 * Сверка переводов: один набор ключей на три языка.
 *
 * Правило «новый ключ во все три языка» ничем не проверялось, и языки
 * расходились на десятки ключей. Скрипт падает, если ключ есть не везде или
 * если код просит ключ, которого нет ни в одном языке; неиспользуемые ключи
 * печатает списком.
 */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { transform } from 'esbuild';

const LOCALIZATION_DIR = path.join(process.cwd(), 'src', 'shared', 'localization');
const SOURCE_DIR = path.join(process.cwd(), 'src');
const LANGUAGES = ['ru', 'en', 'uz'];

/** Образец: по нему сверяются остальные языки. */
const REFERENCE = 'ru';

const loadTranslations = async (language) => {
  const source = await readFile(path.join(LOCALIZATION_DIR, `${language}.ts`), 'utf8');
  const { code } = await transform(source, { loader: 'ts', format: 'esm' });
  const module = await import(
    `data:text/javascript;base64,${Buffer.from(code).toString('base64')}`
  );

  return module.default;
};

const flatten = (value, prefix = '', keys = new Set()) => {
  for (const [key, nested] of Object.entries(value)) {
    const full = prefix ? `${prefix}.${key}` : key;

    if (nested && typeof nested === 'object') {
      flatten(nested, full, keys);
    } else {
      keys.add(full);
    }
  }

  return keys;
};

const collectSources = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await collectSources(full)));
    } else if (/\.tsx?$/.test(entry.name) && !entry.name.includes('.test.')) {
      files.push(full);
    }
  }

  return files;
};

/**
 * Запрошенный ключ — только аргумент t(): по нему решается, не покажет ли
 * экран сам ключ вместо текста.
 */
const REQUESTED_KEY = /\bt\(\s*['"]([a-zA-Z][a-zA-Z0-9_]*(?:\.[a-zA-Z0-9_]+)+)['"]/g;

/**
 * Для поиска забытых ключей годится любой строковый литерал с точкой: ключ
 * кладут в карты, колонки и константы, а не только в t(). Шаблон даёт только
 * свой литеральный префикс — остальное известно лишь в рантайме.
 */
const MENTIONED_KEY = /['"`]([a-zA-Z][a-zA-Z0-9_]*(?:\.[a-zA-Z0-9_]+)+)['"`]/g;
const TEMPLATE_PREFIX = /`([a-zA-Z][a-zA-Z0-9_]*(?:\.[a-zA-Z0-9_]*)*)\$\{/g;

/** Ключи статусов собираются из каталога, в коде их имён нет. */
const DYNAMIC_PREFIXES = ['statusCatalog'];

/**
 * Закомментированный вызов t() ничего не просит. Снимаются строки целиком из
 * комментария и блоки JSX-комментариев; URL внутри кода не задеты.
 */
const stripComments = (source) =>
  source
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, '')
    .replace(/^\s*(\/\/|\*|\/\*).*$/gm, '')
    .replace(/(^|\s)\/\/.*$/gm, '');

const readUsage = async () => {
  const files = await collectSources(SOURCE_DIR);
  const requested = new Set();
  const mentioned = new Set();
  const prefixes = new Set(DYNAMIC_PREFIXES);

  for (const file of files) {
    if (file.startsWith(LOCALIZATION_DIR)) continue;

    const source = stripComments(await readFile(file, 'utf8'));

    for (const match of source.matchAll(REQUESTED_KEY)) requested.add(match[1]);
    for (const match of source.matchAll(MENTIONED_KEY)) mentioned.add(match[1]);
    for (const match of source.matchAll(TEMPLATE_PREFIX)) {
      const prefix = match[1].replace(/\.$/, '');

      if (prefix) prefixes.add(prefix);
    }
  }

  return { requested, mentioned, prefixes };
};

const translations = Object.fromEntries(
  await Promise.all(
    LANGUAGES.map(async (language) => [language, flatten(await loadTranslations(language))]),
  ),
);

const allKeys = new Set(LANGUAGES.flatMap((language) => [...translations[language]]));
const problems = [];

for (const language of LANGUAGES) {
  const missing = [...allKeys].filter((key) => !translations[language].has(key));

  if (missing.length) {
    problems.push(
      `${language}: нет ${missing.length} ключей\n    ${missing.slice(0, 20).join('\n    ')}` +
        (missing.length > 20 ? `\n    …и ещё ${missing.length - 20}` : ''),
    );
  }
}

const { requested, mentioned, prefixes } = await readUsage();
const reference = translations[REFERENCE];
const startsWithPrefix = (key) => [...prefixes].some((prefix) => key.startsWith(prefix));

/**
 * Ключ-ветка: код просит его целиком (returnObjects) или передаёт как
 * префикс, из которого подпись собирается в рантайме.
 */
const isBranch = (key) => [...allKeys].some((full) => full.startsWith(`${key}.`));

const brokenKeys = [...requested].filter(
  (key) => !allKeys.has(key) && !isBranch(key) && !startsWithPrefix(key),
);

if (brokenKeys.length) {
  problems.push(
    `t() просит ключи, которых нет ни в одном языке — экран покажет сам ключ:\n    ${brokenKeys.join('\n    ')}`,
  );
}

const mentionedPrefixes = [...mentioned].filter((value) => isBranch(value));

/** Лист считается живым, если упомянут сам или если упомянута его ветка. */
const isUsed = (key) =>
  mentioned.has(key) ||
  startsWithPrefix(key) ||
  mentionedPrefixes.some((prefix) => key.startsWith(`${prefix}.`));

const unused = [...reference].filter((key) => !isUsed(key));

console.log(
  `Localization check: ${reference.size} ключей в ${REFERENCE}, ${allKeys.size} всего по трём языкам.`,
);

if (unused.length) {
  console.log(`\nНе встречаются в коде — ${unused.length}:`);
  unused.forEach((key) => console.log(`  ${key}`));
}

if (problems.length) {
  console.error('\nLocalization check failed:');
  problems.forEach((problem) => console.error(`  - ${problem}`));
  process.exit(1);
}
