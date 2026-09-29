import { defineConfig } from 'vite'
import { resolve } from 'path'

const root = import.meta.dirname;

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        firma: resolve(root, 'firma.html'),
        serwis: resolve(root, 'serwis.html'),
        umowy: resolve(root, 'umowy.html'),
        urzadzenia: resolve(root, 'urzadzenia.html'),
        uslugi: resolve(root, 'uslugi.html'),
        kontakt: resolve(root, 'kontakt.html'),
      },
    },
  },
})
