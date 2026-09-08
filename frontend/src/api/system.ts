import { api } from '../api';

export function fetchUsers(page: number, size: number) {
  return api.get('/system/users/page', { params: { page, size } });
}
export function fetchRoles(page: number, size: number) {
  return api.get('/system/roles/page', { params: { page, size } });
}
export function createUser(payload: { username: string; password: string }) { return api.post('/system/users', payload); }
export function createRole(payload: { roleCode: string; roleName: string }) { return api.post('/system/roles', payload); }
export function assignUserRole(id: number, roleCode: string) { return api.put(`/system/users/${id}/role`, { roleCode }); }
export function setUserEnabled(id: number, enabled: boolean) { return api.put(`/system/users/${id}/enabled`, null, { params: { enabled } }); }
export function fetchMenus() { return api.get('/system/menus'); }
export function fetchRoleMenus(id: number) { return api.get(`/system/roles/${id}/menus`); }
export function saveRoleMenus(id: number, menuIds: number[]) { return api.put(`/system/roles/${id}/menus`, { menuIds }); }

