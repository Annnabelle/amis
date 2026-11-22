import fs from 'fs';
import path from 'path';

/**
 * Временный тип, описывающий форму, которой ещё нет в @edem2000/amis.contracts,
 * помечается в комментарии как `@blocked-by-contracts <версия>`. Пока такой
 * файл жив, фронт описывает контракт сам — ветка не готова к мержу, и сборка
 * об этом говорит вместо человека.
 *
 * Снять блокировку на один прогон (стенд, проверка пары с бэкендом):
 * ALLOW_CONTRACT_BLOCKERS=1 npm run build
 */
const MARKER = '@blocked-by-contracts';

const sourceRoot = path.join(process.cwd(), 'src');

const listSourceFiles = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) return listSourceFiles(entryPath);
    return /\.tsx?$/.test(entry.name) ? [entryPath] : [];
  });

const blockers = listSourceFiles(sourceRoot).flatMap((file) => {
  const source = fs.readFileSync(file, 'utf8');
  const index = source.indexOf(MARKER);

  if (index === -1) return [];

  const version =
    source.slice(index + MARKER.length).match(/^\s*([^\s*]+)/)?.[1] ?? '?';

  return [{ file: path.relative(process.cwd(), file), version }];
});

if (blockers.length === 0) {
  console.log('Contract blocker check passed: no local contract shapes left.');
  process.exit(0);
}

const lines = blockers.map(
  ({ file, version }) => `  ${file} — ждёт публикации ${version}`
);

if (process.env.ALLOW_CONTRACT_BLOCKERS === '1') {
  console.warn(
    ['Contract blockers present, build allowed explicitly:', ...lines].join('\n')
  );
  process.exit(0);
}

console.error(
  [
    'Ветка не готова к мержу: фронт описывает контракт сам.',
    ...lines,
    '',
    'Опубликуйте пакет контрактов, обновите зависимость и удалите файл.',
    'Собрать как есть: ALLOW_CONTRACT_BLOCKERS=1 npm run build',
  ].join('\n')
);
process.exit(1);
