import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode`
  const env = loadEnv(mode, process.cwd(), '')
  console.log(`Loading environment for mode: ${mode}`)
  console.log('Environment variables:', {
    VITE_WS_URL: env.VITE_WS_URL,
    VITE_CLIENT_URL: env.VITE_CLIENT_URL
  })

  return {
    base: '/tanki.io/',
    server: { host: '0.0.0.0' },
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_WS_URL': JSON.stringify(env.VITE_WS_URL),
      'import.meta.env.VITE_CLIENT_URL': JSON.stringify(env.VITE_CLIENT_URL)
    }
  }
})