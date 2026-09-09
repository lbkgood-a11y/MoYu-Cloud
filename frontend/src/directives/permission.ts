import type { Directive } from 'vue';
import { useAuthStore } from '../stores/auth';

/** RuoYi 风格权限指令：无权限时移除按钮节点。 */
export const permission: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    const required = Array.isArray(binding.value) ? binding.value : [binding.value];
    const auth = useAuthStore();
    if (!required.some((code) => auth.hasPermission(code))) el.parentNode?.removeChild(el);
  },
};
