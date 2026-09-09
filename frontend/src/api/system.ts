import { api } from '../api';

export function fetchUsers(page: number, size: number) {
  return api.get('/system/users/page', { params: { page, size } });
}
export function fetchRoles(page: number, size: number) {
  return api.get('/system/roles/page', { params: { page, size } });
}
export function createUser(payload: { username: string; password: string }) {
  return api.post('/system/users', payload);
}
export function createRole(payload: { roleCode: string; roleName: string }) {
  return api.post('/system/roles', payload);
}
export function assignUserRole(id: string, roleCode: string) {
  return api.put(`/system/users/${id}/role`, { roleCode });
}
export function setUserEnabled(id: string, enabled: boolean) {
  return api.put(`/system/users/${id}/enabled`, null, { params: { enabled } });
}
export function updateUser(id: string, payload: { username: string }) {
  return api.put(`/system/users/${id}`, payload);
}
export function deleteUser(id: string) {
  return api.delete(`/system/users/${id}`);
}
export function resetUserPassword(id: string, password: string) {
  return api.post(`/system/users/${id}/reset-password`, { password });
}
export function fetchMenus() {
  return api.get('/system/menus');
}
export function fetchRoleMenus(id: string) {
  return api.get(`/system/roles/${id}/menus`);
}
export function saveRoleMenus(id: string, menuIds: string[]) {
  return api.put(`/system/roles/${id}/menus`, { menuIds });
}
export function updateRole(id: string, roleName: string) {
  return api.put(`/system/roles/${id}`, { roleName });
}
export function deleteRole(id: string) {
  return api.delete(`/system/roles/${id}`);
}
export function setRoleEnabled(id: string, enabled: boolean) {
  return api.put(`/system/roles/${id}/enabled`, null, { params: { enabled } });
}
