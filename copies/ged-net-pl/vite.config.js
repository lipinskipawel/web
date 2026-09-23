import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        firma: resolve(__dirname, 'firma.html'),
        serwis: resolve(__dirname, 'serwis.html'),
        umowy: resolve(__dirname, 'umowy.html'),
        urzadzenia: resolve(__dirname, 'urzadzenia.html'),
        uslugi: resolve(__dirname, 'uslugi.html'),
        kontakt: resolve(__dirname, 'kontakt.html'),
      },
    },
  },
})
