import { api } from '../api';
export interface Department {
  id: string;
  name: string;
  parentId: string | null;
  enabled: boolean;
  sortOrder: number;
}
export interface DepartmentRequest {
  name: string;
  parentId?: string | null;
  sortOrder: number;
}
export const fetchDepartments = () => api.get<{ data: Department[] }>('/departments');
export const createDepartment = (data: DepartmentRequest) => api.post('/departments', data);
export const updateDepartment = (id: string, data: DepartmentRequest) => api.put(`/departments/${id}`, data);
export const deleteDepartment = (id: string) => api.delete(`/departments/${id}`);
