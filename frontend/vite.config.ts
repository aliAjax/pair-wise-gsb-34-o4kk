import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 20103,
    host: "0.0.0.0",
    proxy: {
      // 本地开发经 Vite 反代到后端；容器内由 nginx.conf 代理，前端始终只请求 /api
      "/api": {
        target: "http://localhost:21103",
        changeOrigin: true
      },
      "/health": {
        target: "http://localhost:21103",
        changeOrigin: true
      }
    }
  }
});
