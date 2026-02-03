import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      app: path.resolve(__dirname, 'src/app'),
      shared: path.resolve(__dirname, 'src/shared'),
      entities: path.resolve(__dirname, 'src/entities'),
      widgets: path.resolve(__dirname, 'src/widgets'),
      pages: path.resolve(__dirname, 'src/pages'),
    },
  },
})
