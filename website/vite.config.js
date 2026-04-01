import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        team: resolve(__dirname, 'team.html'),
        technology: resolve(__dirname, 'technology.html'),
        vision: resolve(__dirname, 'vision.html'),
      },
    },
  },
})
