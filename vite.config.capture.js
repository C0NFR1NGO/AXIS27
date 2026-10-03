import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-capture',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        dunesea: 'dunesea-capture.html',
      },
      output: {
        manualChunks(id) {
          if (id.includes('three') || id.includes('@react-three')) return 'three'
          if (id.includes('framer-motion')) return 'framer'
          if (id.includes('node_modules')) return 'vendor'
        },
      },
    },
  },
})