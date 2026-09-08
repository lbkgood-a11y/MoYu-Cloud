import { api } from '../api';

export interface Customer {
  id: number;
  name: string;
  contact: string;
  phone: string;
  status: string;
}

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

export function fetchCustomers(keyword: string, page: number, size: number) {
  return api.get<{ data: PageResult<Customer> }>('/customers/page', { params: { keyword: keyword || undefined, page, size } });
}

export function createCustomer(payload: Omit<Customer, 'id'>) { return api.post('/customers', payload); }
export function updateCustomer(id: number, payload: Omit<Customer, 'id'>) { return api.put(`/customers/${id}`, payload); }
export function deleteCustomer(id: number) { return api.delete(`/customers/${id}`); }
