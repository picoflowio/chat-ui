import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? './' : '/',
  plugins: [react()],
  server: {
    proxy: {
      '/ai': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  }
}))
