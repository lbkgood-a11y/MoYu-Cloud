import { computed } from 'vue';
import { crudMetadata, type CrudMetadata } from './metadata';
import { useAuthStore } from '../stores/auth';

export function useCrudMetadata(resource: string) {
  const auth = useAuthStore();
  const metadata = computed<CrudMetadata | undefined>(() => crudMetadata[resource]);
  const fields = computed(() => metadata.value?.fields ?? []);
  const tableFields = computed(() => fields.value.filter((field) => field.table));
  const searchableFields = computed(() => fields.value.filter((field) => field.searchable));
  const canRead = computed(() => Boolean(metadata.value && auth.hasPermission(metadata.value.readPermission)));
  const canWrite = computed(() => Boolean(metadata.value && auth.hasPermission(metadata.value.writePermission)));
  const canReadField = (field: string) => auth.hasPermission(`${resource}.${field}.read`) || canRead.value;
  const canWriteField = (field: string) => auth.hasPermission(`${resource}.${field}.write`) || canWrite.value;
  return { metadata, fields, tableFields, searchableFields, canRead, canWrite, canReadField, canWriteField };
}
