import { api } from '../api';
export interface FieldPermission {
  fieldCode: string;
  readable: boolean;
  writable: boolean;
  maskStrategy: string;
}
export const fetchFieldPermissions = (roleId: string) => api.get(`/system/roles/${roleId}/field-permissions`);
export const saveFieldPermissions = (roleId: string, data: FieldPermission[]) =>
  api.put(`/system/roles/${roleId}/field-permissions`, data);
