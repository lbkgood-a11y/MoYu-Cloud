import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

/** Vitest 组件测试配置。 */
export default defineConfig({ plugins: [vue()], test: { environment: 'jsdom' } });
