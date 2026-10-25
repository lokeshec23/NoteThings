import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        minify: mode === 'production' ? {
          compress: {
            dropConsole: true,
            dropDebugger: true
          }
        } : false
      }
    }
  },
  server: {
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff'
    }
  }
}))
