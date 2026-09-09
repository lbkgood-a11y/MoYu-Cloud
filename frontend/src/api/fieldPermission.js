import { api } from '../api';
export const fetchFieldPermissions = (roleId) => api.get(`/system/roles/${roleId}/field-permissions`);
export const saveFieldPermissions = (roleId, data) => api.put(`/system/roles/${roleId}/field-permissions`, data);
