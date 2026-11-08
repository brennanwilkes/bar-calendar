import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // react-player splits its HLS/DASH players into large lazy chunks that are never loaded for YouTube
    chunkSizeWarningLimit: 1000,
  },
})
