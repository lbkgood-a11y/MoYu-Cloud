<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAuthStore } from '../../stores/auth';
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer, batchDeleteCustomers, exportCustomers, fetchCustomerDetail, type Customer } from '../../api/customer';
import CustomerPagination from '../../components/CustomerPagination.vue';
import CrudToolbar from '../../components/CrudToolbar.vue';
import CrudQuery from '../../components/crud/CrudQuery.vue';
import CrudTable from '../../components/crud/CrudTable.vue';
import CrudForm from '../../components/crud/CrudForm.vue';
import { useCrudMetadata } from '../../crud/useCrudMetadata';

const auth = useAuthStore();
const { metadata, tableFields, searchableFields } = useCrudMetadata('customer');
const query = ref<Record<string, any>>({});
const formModel = ref<Record<string, any>>({ name: '', contact: '', phone: '', status: 'ACTIVE' });
const customers = ref<Customer[]>([]);
const keyword = ref('');
const page = ref(1);
const size = ref(10);
const total = ref(0);
const loading = ref(false);
const error = ref(false);
const dialog = ref(false);
const detailDialog = ref(false); const detail = ref<Record<string, any>>({}); const detailLoading = ref(false);
const selectedRows = ref<Customer[]>([]);
const editing = ref<Customer | null>(null);
async function load() {
  loading.value = true;
  try {
    error.value = false;
    const result = (await fetchCustomers(keyword.value, page.value, size.value)).data.data;
    customers.value = result.items;
    total.value = result.total;
  } catch {
    error.value = true;
    ElMessage.error('客户数据加载失败');
  } finally {
    loading.value = false;
  }
}
function openForm(customer?: Customer) {
  editing.value = customer ?? null;
  dialog.value = true;
  formModel.value = customer ? { ...customer } : { name: '', contact: '', phone: '', status: 'ACTIVE' };
}
async function save(payload: Omit<Customer, 'id'>) {
  try {
    if (editing.value) await updateCustomer(editing.value.id, payload);
    else await createCustomer(payload);
    dialog.value = false;
    ElMessage.success('保存成功');
    await load();
  } catch {
    ElMessage.error('保存失败');
  }
}
async function remove(customer: Customer) {
  try {
    await ElMessageBox.confirm(`确定删除客户“${customer.name}”吗？`, '删除确认', { type: 'warning' });
    await deleteCustomer(customer.id);
    ElMessage.success('删除成功');
    await load();
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') ElMessage.error('删除失败');
  }
}
async function exportData(){try{const r=await exportCustomers();const browser=globalThis as any;const url=browser.URL.createObjectURL(r.data);const a=browser.document.createElement('a');a.href=url;a.download='customers.csv';a.click();browser.URL.revokeObjectURL(url);ElMessage.success('导出成功')}catch{ElMessage.error('导出失败')}}
async function openDetail(row:Customer){detailDialog.value=true;detailLoading.value=true;try{detail.value=(await fetchCustomerDetail(row.id)).data.data}catch{ElMessage.error('详情加载失败');detailDialog.value=false}finally{detailLoading.value=false}}
async function batchRemove(){if(!selectedRows.value.length)return;try{await ElMessageBox.confirm(`确定删除选中的 ${selectedRows.value.length} 条客户吗？`,'批量删除确认',{type:'warning'});await batchDeleteCustomers(selectedRows.value.map(x=>x.id));selectedRows.value=[];await load();ElMessage.success('批量删除成功')}catch(e:any){if(e!=='cancel'&&e!=='close')ElMessage.error(e.message||'批量删除失败')}}
onMounted(load);
</script>
<template>
  <el-card
    ><template #header
    ><CrudToolbar title="客户管理"><el-button v-permission="'customer:read'" plain @click="exportData">导出</el-button><el-button v-permission="'customer:write'" plain :disabled="!selectedRows.length" @click="batchRemove">批量删除</el-button><el-button v-permission="'customer:write'" type="primary" @click="openForm()">新增客户</el-button></CrudToolbar></template
    >
    <el-alert v-if="error" title="客户数据加载失败" type="error" show-icon /><CrudQuery :fields="searchableFields" v-model="query" @search="page=1; keyword=query.name || ''; load()" /><CrudTable :fields="tableFields" :rows="customers" :loading="loading" :can-write="auth.hasPermission('customer:write')" selectable @selection-change="selectedRows=$event as unknown as Customer[]"><template #actions="{row}"><el-button link @click="openDetail(row)">详情</el-button><el-button link type="primary" @click="openForm(row)">编辑</el-button><el-button link type="danger" @click="remove(row)">删除</el-button></template></CrudTable>
    <CustomerPagination
      :page="page"
      :size="size"
      :total="total"
      @update:page="
        page = $event;
        load();
      "
      @update:size="
        size = $event;
        page = 1;
        load();
      "
    />
  </el-card>
  <CrudForm v-model="dialog" title="客户信息" :fields="metadata?.fields || []" :model="formModel" @update:model="formModel=$event" @submit="save(formModel as any)" />
  <el-dialog v-model="detailDialog" title="客户详情" width="560px"><el-skeleton v-if="detailLoading" :rows="5" animated/><el-descriptions v-else :column="1" border><el-descriptions-item v-for="f in (metadata?.fields||[]).filter(f=>detail[f.code]!==undefined)" :key="f.code" :label="f.label">{{detail[f.code]}}</el-descriptions-item></el-descriptions></el-dialog>
</template>
<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
