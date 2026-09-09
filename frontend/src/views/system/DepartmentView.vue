<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
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
const selectedId = ref<string | null>(null);
const selectedLabel = ref('全部部门');
const treeData = computed(() => {
  const map = new Map<string | null, any[]>();
  rows.value.forEach((d) => {
    const list = map.get(d.parentId) ?? [];
    list.push({ ...d, children: [] });
    map.set(d.parentId, list);
  });
  const build = (parentId: string | null): any[] =>
    (map.get(parentId) ?? [])
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((node) => ({ ...node, children: build(node.id) }));
  return build(null);
});
const parentNames = computed(() => new Map(rows.value.map((d) => [d.id, rows.value.find((p) => p.id === d.parentId)?.name ?? '—'])));
const visibleRows = computed(() => {
  if (!selectedId.value) return rows.value;
  const ids = new Set<string>();
  const collect = (id: string) => {
    ids.add(id);
    rows.value.filter((d) => d.parentId === id).forEach((d) => collect(d.id));
  };
  collect(selectedId.value);
  return rows.value.filter((d) => ids.has(d.id));
});
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
function selectDepartment(data: Department | { id: string; name: string }) {
  selectedId.value = data.id;
  selectedLabel.value = data.name;
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
  <div class="department-layout">
    <el-card class="tree-card" shadow="never">
      <template #header><div class="panel-title"><span>组织架构</span><el-button link type="primary" @click="selectedId = null; selectedLabel = '全部部门'">查看全部</el-button></div></template>
      <el-scrollbar class="tree-scroll"><el-tree :data="treeData" node-key="id" default-expand-all highlight-current @node-click="selectDepartment"><template #default="{ data }"><span class="tree-node"><span>{{ data.name }}</span><el-tag v-if="!data.enabled" size="small" type="info">停用</el-tag></span></template></el-tree></el-scrollbar>
    </el-card>
    <el-card class="list-card" shadow="never">
      <template #header><div class="header"><div><div class="list-title">{{ selectedLabel }}</div><div class="list-subtitle">共 {{ visibleRows.length }} 个部门</div></div><el-button type="primary" @click="open()">新增部门</el-button></div></template>
    <el-table :data="visibleRows" row-key="id" v-loading="loading"
      ><el-table-column prop="name" label="部门名称" /><el-table-column
        prop="parentId"
        label="上级部门"><template #default="{ row }">{{ parentNames.get(row.id) }}</template></el-table-column><el-table-column prop="sortOrder" label="排序" width="80" /><el-table-column label="状态" width="90"
        ><template #default="{ row }"
          ><el-tag :type="row.enabled ? 'success' : 'info'">{{ row.enabled ? '启用' : '停用' }}</el-tag></template
        ></el-table-column
      ><el-table-column label="操作" width="160"
        ><template #default="{ row }"
          ><el-button link type="primary" @click="open(row)">编辑</el-button
          ><el-button link type="danger" @click="remove(row)">删除</el-button></template
        ></el-table-column
      ></el-table>
    </el-card>
  </div>
  <el-dialog v-model="dialog" :title="editing ? '编辑部门' : '新增部门'" width="420px"
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
.department-layout { display: flex; gap: 16px; align-items: stretch; }
.tree-card { width: 260px; flex: 0 0 260px; }
.list-card { min-width: 0; flex: 1; }
.tree-scroll { max-height: calc(100vh - 220px); }
.panel-title, .tree-node { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.list-title { font-size: 16px; font-weight: 600; }
.list-subtitle { color: var(--el-text-color-secondary); font-size: 12px; margin-top: 4px; }
@media (max-width: 768px) { .department-layout { flex-direction: column; } .tree-card { width: auto; flex-basis: auto; } .tree-scroll { max-height: 260px; } }
</style>
