<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  fetchDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  type Department,
} from '../../api/department';
const rows = ref<Department[]>([]);
const loading = ref(false);
const dialog = ref(false);
const editing = ref<Department | null>(null);
const form = ref({ name: '', parentId: null as string | null, sortOrder: 0 });
async function load() {
  loading.value = true;
  try {
    rows.value = (await fetchDepartments()).data.data;
  } catch {
    ElMessage.error('部门加载失败');
  } finally {
    loading.value = false;
  }
}
function open(d?: Department) {
  editing.value = d ?? null;
  form.value = d
    ? { name: d.name, parentId: d.parentId, sortOrder: d.sortOrder }
    : { name: '', parentId: null, sortOrder: 0 };
  dialog.value = true;
}
async function save() {
  try {
    if (editing.value) {
      await updateDepartment(editing.value.id, form.value);
    } else {
      await createDepartment(form.value);
    }
    dialog.value = false;
    ElMessage.success('保存成功');
    load();
  } catch {
    ElMessage.error('保存失败');
  }
}
async function remove(d: Department) {
  try {
    await ElMessageBox.confirm(`确定删除部门“${d.name}”吗？`, '删除确认', { type: 'warning' });
    await deleteDepartment(d.id);
    ElMessage.success('删除成功');
    load();
  } catch (e) {
    if (e !== 'cancel' && e !== 'close') ElMessage.error('删除失败');
  }
}
onMounted(load);
</script>
<template>
  <el-card
    ><template #header
      ><div class="header">
        <span>组织部门</span><el-button type="primary" @click="open()">新增部门</el-button>
      </div></template
    ><el-table :data="rows" row-key="id" v-loading="loading"
      ><el-table-column prop="name" label="部门名称" /><el-table-column
        prop="parentId"
        label="上级部门"
      /><el-table-column prop="sortOrder" label="排序" width="80" /><el-table-column label="状态" width="90"
        ><template #default="{ row }"
          ><el-tag :type="row.enabled ? 'success' : 'info'">{{ row.enabled ? '启用' : '停用' }}</el-tag></template
        ></el-table-column
      ><el-table-column label="操作" width="160"
        ><template #default="{ row }"
          ><el-button link type="primary" @click="open(row)">编辑</el-button
          ><el-button link type="danger" @click="remove(row)">删除</el-button></template
        ></el-table-column
      ></el-table
    ></el-card
  ><el-dialog v-model="dialog" :title="editing ? '编辑部门' : '新增部门'" width="420px"
    ><el-form label-width="90px"
      ><el-form-item label="部门名称"><el-input v-model="form.name" /></el-form-item
      ><el-form-item label="上级部门"
        ><el-select v-model="form.parentId" clearable placeholder="顶级部门"
          ><el-option
            v-for="d in rows.filter((x) => x.id !== editing?.id)"
            :key="d.id"
            :label="d.name"
            :value="d.id" /></el-select></el-form-item
      ><el-form-item label="排序"><el-input-number v-model="form.sortOrder" :min="0" /></el-form-item></el-form
    ><template #footer
      ><el-button @click="dialog = false">取消</el-button
      ><el-button type="primary" @click="save">保存</el-button></template
    ></el-dialog
  >
</template>
<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
