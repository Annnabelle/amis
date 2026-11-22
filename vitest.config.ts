import path from 'path'
import { fileURLToPath } from 'url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      app: path.resolve(__dirname, 'src/app'),
      shared: path.resolve(__dirname, 'src/shared'),
      entities: path.resolve(__dirname, 'src/entities'),
      widgets: path.resolve(__dirname, 'src/widgets'),
      pages: path.resolve(__dirname, 'src/pages'),
      test: path.resolve(__dirname, 'src/test'),
    },
  },
  test: {
    /**
     * Компонентным тестам нужен DOM, остальным он не мешает: jsdom
     * поднимается один раз на файл и стоит доли секунды.
     */
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
