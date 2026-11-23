import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import jsxA11y from 'eslint-plugin-jsx-a11y'
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

/** Адреса страниц живут в shared/config/routes. */
const ROUTE_LITERAL_MESSAGE =
  'Адрес страницы собирается билдером из shared/config/routes, литерал пути здесь запрещён.';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      jsxA11y.flatConfigs.recommended,
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
        {
          selector: "ImportDeclaration[source.value='react-toastify']",
          message:
            'Уведомления показывает notify из shared/lib/notify: общие настройки тостов живут там.',
        },
        {
          selector: 'JSXAttribute[name.name=/^(to|path|backPath)$/] > Literal[value=/^\\u002f/]',
          message: ROUTE_LITERAL_MESSAGE,
        },
        {
          selector:
            'JSXAttribute[name.name=/^(to|path|backPath)$/] > JSXExpressionContainer > TemplateLiteral',
          message: ROUTE_LITERAL_MESSAGE,
        },
        {
          selector:
            'CallExpression[callee.name=/^(navigate|navigateBack)$/] > Literal[value=/^\\u002f/]',
          message: ROUTE_LITERAL_MESSAGE,
        },
        {
          selector: 'CallExpression[callee.name=/^(navigate|navigateBack)$/] > TemplateLiteral',
          message: ROUTE_LITERAL_MESSAGE,
        },
        {
          selector:
            'Property[key.name=/^(backPath|listPath|createPath)$/] > Literal[value=/^\\u002f(organization|users|leads|audit-logs|system-employees|profile|welcome)/]',
          message: ROUTE_LITERAL_MESSAGE,
        },
      ],
    },
  },
  ...layerBoundaries,
])
