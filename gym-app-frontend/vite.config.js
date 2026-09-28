import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'ironpeak-gym-demo.up.railway.app',
      'disciplined-liberation-production.up.railway.app',
      'disciplined-liberation-production-fae5.up.railway.app',
    ],
  },
})
