import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

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
      // Путь разрешает резолвер алиасов, расширение в импорте — разнобой.
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ImportDeclaration[source.value=/\\.tsx?$/]',
          message: 'Импорт без расширения: путь разрешает резолвер алиасов.',
        },
        {
          selector: 'ImportExpression[source.value=/\\.tsx?$/]',
          message: 'Импорт без расширения: путь разрешает резолвер алиасов.',
        },
      ],
    },
  },
])
