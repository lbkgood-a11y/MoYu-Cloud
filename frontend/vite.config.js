import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
/** Vite 开发服务器配置。 */
export default defineConfig({
    plugins: [vue()],
    server: { port: 5173, proxy: { '/api': 'http://localhost:8080' } },
});
