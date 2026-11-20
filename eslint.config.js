import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

/**
 * Направление зависимостей FSD: pages → widgets → entities → shared.
 * Каждому слою запрещены импорты из тех, что выше него.
 */
const layerBoundaries = [
  { layer: 'shared', forbidden: ['app', 'entities', 'widgets', 'pages'] },
  { layer: 'entities', forbidden: ['widgets', 'pages'] },
  { layer: 'widgets', forbidden: ['pages'] },
].map(({ layer, forbidden }) => ({
  files: [`src/${layer}/**/*.{ts,tsx}`],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: forbidden.map((upper) => ({
          group: [`${upper}/*`, `${upper}/**`],
          message: `Слой ${layer} не зависит от ${upper}: поднимите использование выше или опустите тип в shared.`,
        })),
      },
    ],
  },
}));

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Забытая зависимость хука — это не стиль, а расчёт по устаревшим данным:
      // мемо считает для прошлой компании, эффект не перезапускается.
      'react-hooks/exhaustive-deps': 'error',
    },
  },
  ...layerBoundaries,
])
