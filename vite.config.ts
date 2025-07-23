import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  base: '/admin/',
  plugins: [
    vue(),
    // vueDevTools(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
      // 排除自定义组件的自动导入
      exclude: [/\/src\/components\//],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: 5172,
    open: true,
    proxy: {
      '/api': {
        target: 'http://8.138.37.133:3000/',
        // target: 'http://localhost:3000/',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
      '/uploads': {
        target: 'http://8.138.37.133:3000/',
        // target: 'http://localhost:3000/',
        changeOrigin: true,
      },
      '/admin/uploads': {
        target: 'http://8.138.37.133:3000/',
        // target: 'http://localhost:3000/',
        rewrite: (path) => path.replace(/^\/admin\/uploads/, '/uploads'),
        changeOrigin: true,
      },
    },
  },
})
