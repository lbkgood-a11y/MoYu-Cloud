import { api } from '../api';
export function fetchOperationLogs(page, size) {
    return api.get('/audit/logs/page', { params: { page, size } });
}
