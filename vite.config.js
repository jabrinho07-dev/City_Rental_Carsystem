import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

const clientRoot = fileURLToPath(new URL('./frontend/city-rental-car-client', import.meta.url))
const outDir = fileURLToPath(new URL('./dist', import.meta.url))

export default defineConfig({
  root: clientRoot,
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./frontend/city-rental-car-client/src', import.meta.url)),
    },
  },
  build: {
    outDir,
    emptyOutDir: true,
  },
})
