import { api } from '../api';
export function exportResource(resource: string) { return api.get(`/customers/export`, { responseType: 'blob', params: { resource } }); }
export function batchDelete(resource: string, ids: string[]) { return api.delete(`/${resource}`, { data: { ids } }); }
export function fetchDetail(resource: string, id: string) { return api.get(`/${resource}/${id}`); }
