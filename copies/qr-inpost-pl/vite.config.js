import { defineConfig } from 'vite'
import { resolve } from 'path'

const root = import.meta.dirname;

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
      },
    },
  },
})
