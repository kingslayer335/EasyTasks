import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/EasyTasks/',
  plugins: [react()],
  server: {
    allowedHosts: [
      "",
    ],
  },
})
