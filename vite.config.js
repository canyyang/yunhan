import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ElementPlus from 'unplugin-element-plus/vite'
import path from 'path'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), ElementPlus()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/')
    }
  },
  server: {
    host: '0.0.0.0',  // 监听所有网络接口
    port: 7002,       // 配置监听端口
    https: {
      key: fs.readFileSync('/etc/letsencrypt/live/canyyang.xyz/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/canyyang.xyz/fullchain.pem'),
    }
  }
})
