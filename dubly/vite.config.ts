import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // разрешает подключение снаружи
    port: 5173,
    strictPort: true,
    allowedHosts: [
      '4d32e2e3e3f6.ngrok-free.app', // твой ngrok URL
    ],
  },
})
