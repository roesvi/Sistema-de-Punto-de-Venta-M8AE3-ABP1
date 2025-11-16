import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import postcssImport from 'postcss-import'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000
  },
  css: {
    postcss: {
      plugins: [
        postcssImport({
          filter: (id) => !id.endsWith('.vue')
        })
      ]
    }
  }
})
