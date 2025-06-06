import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        format: 'iife'
      }
    },
    assetsInlineLimit: 0  // Força CSS como arquivo separado
  }
})
