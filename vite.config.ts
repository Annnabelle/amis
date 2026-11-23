import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        /**
         * Вендорные чанки отдельно от кода приложения: библиотеки меняются
         * редко и переживают деплой в кеше браузера.
         */
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          antd: ['antd', '@ant-design/icons'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          i18n: ['i18next', 'react-i18next'],
        },
      },
    },
  },
  resolve: {
    alias: {
      app: path.resolve(__dirname, 'src/app'),
      shared: path.resolve(__dirname, 'src/shared'),
      entities: path.resolve(__dirname, 'src/entities'),
      features: path.resolve(__dirname, 'src/features'),
      widgets: path.resolve(__dirname, 'src/widgets'),
      pages: path.resolve(__dirname, 'src/pages'),
    },
  },
})
