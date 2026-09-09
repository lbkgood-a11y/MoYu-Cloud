import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import './styles/index.css';
import { permission } from './directives/permission';
import App from './App.vue';
import { router } from './router';

/** 创建并挂载 MoYu-Cloud 管理端应用。 */
createApp(App).use(createPinia()).use(router).use(ElementPlus).directive('permission', permission).mount('#app');
