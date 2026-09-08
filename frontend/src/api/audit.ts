import { api } from '../api';

export function fetchOperationLogs(page: number, size: number) {
  return api.get('/audit/logs/page', { params: { page, size } });
}
