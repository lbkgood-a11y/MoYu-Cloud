<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { api } from '../../api';
import MenuForm from '../../components/MenuForm.vue';
import { useAuthStore } from '../../stores/auth';
import CrudToolbar from '../../components/CrudToolbar.vue';
import { DataAnalysis, Document, Files, Key, Menu as MenuIcon, Monitor, Setting, User, UserFilled } from '@element-plus/icons-vue';
const auth = useAuthStore();
const menus = ref<any[]>([]);
const dialog = ref(false);
const editing = ref<any | null>(null);
const selectedId = ref<string | null>(null);
const selectedLabel = ref('全部菜单');
const iconMap: Record<string, any> = { DataAnalysis, Document, Files, Key, Menu: MenuIcon, Monitor, Setting, User, UserFilled };
/** 将菜单平面数据组装为树形数据。 */
const menuTree = computed(() => {
  const nodes = menus.value.map((menu) => ({ ...menu, children: [] as any[] }));
  const roots: any[] = [];
  nodes.forEach((node) => {
    const parent = nodes.find((item) => item.id === node.parentId);
    if (parent) parent.children.push(node);
    else roots.push(node);
  });
  return roots;
});
const visibleMenus = computed(() => {
  if (!selectedId.value) return menus.value;
  const ids = new Set<string>();
  const collect = (id: string) => { ids.add(id); menus.value.filter((m) => m.parentId === id).forEach((m) => collect(m.id)); };
  collect(selectedId.value);
  return menus.value.filter((m) => ids.has(m.id));
});
async function load() {
  try {
    menus.value = (await api.get('/system/menus')).data.data;
  } catch {
    ElMessage.error('菜单加载失败');
  }
}
function openCreate() {
  editing.value = null;
  dialog.value = true;
}
function openEdit(row: any) {
  editing.value = row;
  dialog.value = true;
}
async function save(payload: any) {
  try {
    if (editing.value) await api.put(`/system/menus/${editing.value.id}`, payload);
    else await api.post('/system/menus', payload);
    dialog.value = false;
    ElMessage.success('保存成功');
    await load();
  } catch {
    ElMessage.error('保存失败');
  }
}
async function remove(row: any) {
  try {
    await api.delete(`/system/menus/${row.id}`);
    ElMessage.success('删除成功');
    await load();
  } catch {
    ElMessage.error('删除失败');
  }
}
async function toggle(row: any) {
  try {
    await api.put(`/system/menus/${row.id}/enabled`, null, { params: { enabled: !row.enabled } });
    await load();
  } catch {
    ElMessage.error('状态更新失败');
  }
}
onMounted(async () => {
  try {
    auth.setPermissions((await api.get('/auth/me')).data.data.permissions);
  } catch {}
  await load();
});
</script>
<template>
  <div class="menu-layout"><el-card class="tree-card" shadow="never"><template #header><div class="tree-header"><span>菜单结构</span><el-button link type="primary" @click="selectedId = null; selectedLabel = '全部菜单'">查看全部</el-button></div></template><el-scrollbar class="tree-scroll"><el-tree node-key="id" default-expand-all highlight-current :data="menuTree" :props="{ label: 'menuName', children: 'children' }" @node-click="(data) => { selectedId = data.id; selectedLabel = data.menuName; }" /></el-scrollbar></el-card><el-card class="list-card" shadow="never"><template #header><div class="header"><div><div class="list-title">{{ selectedLabel }}</div><div class="list-subtitle">共 {{ visibleMenus.length }} 个菜单</div></div><el-button v-permission="'system:user:write'" type="primary" @click="openCreate">新增菜单</el-button></div></template><el-table :data="visibleMenus" stripe
      ><el-table-column label="菜单" min-width="180"><template #default="s"><div class="menu-name"><el-icon><component :is="iconMap[s.row.icon] || MenuIcon" /></el-icon><span>{{ s.row.menuName }}</span></div></template></el-table-column><el-table-column
        prop="menuName"
        label="菜单名称"
      /><el-table-column prop="permission" label="权限标识" /><el-table-column
        prop="menuType"
        label="类型"
        width="90"
      /><el-table-column label="状态"
        ><template #default="s"
          ><el-tag :type="s.row.enabled ? 'success' : 'info'">{{ s.row.enabled ? '启用' : '禁用' }}</el-tag></template
        ></el-table-column
      ><el-table-column v-if="auth.hasPermission('system:user:write')" label="操作" width="220"
        ><template #default="s"
          ><el-button link type="primary" @click="openEdit(s.row)">编辑</el-button
          ><el-button link @click="toggle(s.row)">{{ s.row.enabled ? '禁用' : '启用' }}</el-button
          ><el-button link type="danger" @click="remove(s.row)">删除</el-button></template
        ></el-table-column
      ></el-table></el-card></div><MenuForm v-model="dialog" :menu="editing" :menus="menus" @save="save" />
</template>
<style scoped>
.menu-name{display:flex;align-items:center;gap:8px}.menu-name .el-icon{color:#2563eb}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.menu-layout{display:flex;gap:16px}.tree-card{width:250px;flex:0 0 250px}.list-card{min-width:0;flex:1}.tree-scroll{max-height:calc(100vh - 260px)}.tree-header{display:flex;justify-content:space-between;align-items:center}.list-title{font-size:16px;font-weight:600}.list-subtitle{color:var(--el-text-color-secondary);font-size:12px;margin-top:4px}@media (max-width:768px){.menu-layout{flex-direction:column}.tree-card{width:auto;flex-basis:auto}.tree-scroll{max-height:240px}}
</style>
