import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('moyu_token'));
  const permissions = ref<string[]>(JSON.parse(localStorage.getItem('moyu_permissions') || '[]'));
  const username = ref(localStorage.getItem('moyu_username') || '');
  const loggedIn = computed(() => Boolean(token.value));
  function setSession(accessToken: string, nextPermissions: string[] = [], user = '') {
    token.value = accessToken;
    permissions.value = nextPermissions;
    localStorage.setItem('moyu_token', accessToken);
    localStorage.setItem('moyu_permissions', JSON.stringify(nextPermissions));
    username.value = user; if (user) localStorage.setItem('moyu_username', user);
  }
  function setPermissions(nextPermissions: string[]) { permissions.value = nextPermissions || []; localStorage.setItem('moyu_permissions', JSON.stringify(permissions.value)); }
  function clearSession() {
    token.value = null;
    permissions.value = [];
    localStorage.removeItem('moyu_token');
    localStorage.removeItem('moyu_permissions'); localStorage.removeItem('moyu_username'); username.value = '';
  }
  function hasPermission(permission: string) { return permissions.value.includes(permission); }
  return { token, permissions, username, loggedIn, setSession, setPermissions, clearSession, hasPermission };
});
