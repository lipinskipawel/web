import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        hello: resolve(__dirname, 'hello.html'),
        todo: resolve(__dirname, 'todo.html'),
        quiz: resolve(__dirname, 'quiz.html'),
        expense: resolve(__dirname, 'expense.html'),
        weather: resolve(__dirname, 'weather.html'),
      },
    },
  },
})
