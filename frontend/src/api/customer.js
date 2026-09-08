import { api } from '../api';
export function fetchCustomers(keyword, page, size) {
    return api.get('/customers/page', { params: { keyword: keyword || undefined, page, size } });
}
export function createCustomer(payload) { return api.post('/customers', payload); }
export function updateCustomer(id, payload) { return api.put(`/customers/${id}`, payload); }
export function deleteCustomer(id) { return api.delete(`/customers/${id}`); }
