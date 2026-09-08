<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAuthStore } from '../../stores/auth';
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer, type Customer } from '../../api/customer';
import CustomerTable from '../../components/CustomerTable.vue';
import CustomerPagination from '../../components/CustomerPagination.vue';
import CustomerForm from '../../components/CustomerForm.vue';

const auth = useAuthStore();
const customers = ref<Customer[]>([]); const keyword = ref(''); const page = ref(1); const size = ref(10); const total = ref(0); const loading = ref(false); const dialog = ref(false); const editing = ref<Customer | null>(null);
async function load() { loading.value = true; try { const result = (await fetchCustomers(keyword.value, page.value, size.value)).data.data; customers.value = result.items; total.value = result.total; } catch { ElMessage.error('客户数据加载失败'); } finally { loading.value = false; } }
function openForm(customer?: Customer) { editing.value = customer ?? null; dialog.value = true; }
async function save(payload: Omit<Customer, 'id'>) { try { if (editing.value) await updateCustomer(editing.value.id, payload); else await createCustomer(payload); dialog.value = false; ElMessage.success('保存成功'); await load(); } catch { ElMessage.error('保存失败'); } }
async function remove(customer: Customer) { try { await ElMessageBox.confirm(`确定删除客户“${customer.name}”吗？`, '删除确认', { type: 'warning' }); await deleteCustomer(customer.id); ElMessage.success('删除成功'); await load(); } catch (error) { if (error !== 'cancel' && error !== 'close') ElMessage.error('删除失败'); } }
onMounted(load);
</script>
<template>
  <el-card><template #header><div class="header"><span>客户管理</span><el-button v-if="auth.hasPermission('customer:write')" type="primary" @click="openForm()">新增客户</el-button></div></template>
    <el-form inline @submit.prevent="load"><el-form-item label="关键词"><el-input v-model="keyword" clearable placeholder="客户名称/联系人/电话" @keyup.enter="load" /></el-form-item><el-button type="primary" @click="page = 1; load()">查询</el-button></el-form>
    <CustomerTable :customers="customers" :loading="loading" :can-write="auth.hasPermission('customer:write')" @edit="openForm" @delete="remove" />
    <CustomerPagination :page="page" :size="size" :total="total" @update:page="page = $event; load()" @update:size="size = $event; page = 1; load()" />
  </el-card>
  <CustomerForm v-model="dialog" :customer="editing" @save="save" />
</template>
<style scoped>.header { display: flex; justify-content: space-between; align-items: center; }</style>
