import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
/** 创建并挂载 MoYu-Cloud 管理端应用。 */
createApp(App).use(createPinia()).use(ElementPlus).mount('#app');
