import { api } from '../api';
export interface DataField {
  fieldCode: string;
  fieldType: string;
  required: boolean;
  sortOrder: number;
}
export interface DataTable {
  id: string;
  tableCode: string;
  tableName: string;
  fields: DataField[];
}
export const fetchDataTables = () => api.get<{ data: DataTable[] }>('/modeling/tables');
export const createDataTable = (d: any) => api.post('/modeling/tables', d);
