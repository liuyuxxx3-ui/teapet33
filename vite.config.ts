import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // 👇 只需新增这个 server 配置块
  server: {
    host: '0.0.0.0', // 允许局域网和公网访问
    port: 5173,       // 你可以改成任何喜欢的端口，保持一致即可
    strictPort: true, // 端口被占用时报错，而不是自动换端口
  }
});