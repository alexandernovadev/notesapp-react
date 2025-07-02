import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sassPlugin from 'vite-plugin-sass'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), sassPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/store': path.resolve(__dirname, './src/store'),
      '@/helpers': path.resolve(__dirname, './src/helpers'),
      '@/firebase': path.resolve(__dirname, './src/firebase'),
      '@/theme': path.resolve(__dirname, './src/theme'),
      '@/assets': path.resolve(__dirname, './src/assets')
    }
  }
}) 