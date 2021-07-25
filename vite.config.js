import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
const path = require('path')

export default defineConfig({
  plugins: [vue(), WindiCSS()],

  server: {
    port: 8080
  },

  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, './src'),
      'pages': path.resolve(__dirname, './src/pages'),
      'css': path.resolve(__dirname, './src/assets/css'),
      'js': path.resolve(__dirname, './src/assets/js'),
      'img': path.resolve(__dirname, './src/assets/img'),
      'components': path.resolve(__dirname, './src/components')
    }
  },
})
