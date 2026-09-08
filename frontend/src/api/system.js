import { api } from '../api';
export function fetchUsers(page, size) {
    return api.get('/system/users/page', { params: { page, size } });
}
export function fetchRoles(page, size) {
    return api.get('/system/roles/page', { params: { page, size } });
}
export function createUser(payload) { return api.post('/system/users', payload); }
export function createRole(payload) { return api.post('/system/roles', payload); }
export function assignUserRole(id, roleCode) { return api.put(`/system/users/${id}/role`, { roleCode }); }
export function setUserEnabled(id, enabled) { return api.put(`/system/users/${id}/enabled`, null, { params: { enabled } }); }
export function fetchMenus() { return api.get('/system/menus'); }
export function fetchRoleMenus(id) { return api.get(`/system/roles/${id}/menus`); }
export function saveRoleMenus(id, menuIds) { return api.put(`/system/roles/${id}/menus`, { menuIds }); }
