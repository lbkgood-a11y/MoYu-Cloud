<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { api } from '../../api';
import { fetchRoles, updateRole, deleteRole, setRoleEnabled } from '../../api/system';
import RoleTable from '../../components/RoleTable.vue';
import RoleForm from '../../components/RoleForm.vue';
import RoleEditForm from '../../components/RoleEditForm.vue';
import RolePermissionDialog from '../../components/RolePermissionDialog.vue';
import CustomerPagination from '../../components/CustomerPagination.vue';
import { useAuthStore } from '../../stores/auth';
import CrudToolbar from '../../components/CrudToolbar.vue';
import { fetchFieldPermissions, saveFieldPermissions, type FieldPermission } from '../../api/fieldPermission';
const auth = useAuthStore();
const roles = ref<any[]>([]);
const menus = ref<any[]>([]);
const page = ref(1);
const size = ref(10);
const total = ref(0);
const form = ref(false);
const editForm = ref(false);
const permission = ref(false);
const role = ref<any>(null);
const selected = ref<string[]>([]);
const fieldPermission = ref(false);
const fields = ref<FieldPermission[]>([]);
async function load() {
  try {
    const r = (await fetchRoles(page.value, size.value)).data.data;
    roles.value = r.items;
    total.value = r.total;
  } catch {
    ElMessage.error('角色数据加载失败');
  }
}
async function create(payload: any) {
  try {
    await api.post('/system/roles', payload);
    form.value = false;
    ElMessage.success('角色创建成功');
    await load();
  } catch {
    ElMessage.error('角色创建失败');
  }
}
async function open(r: any) {
  role.value = r;
  menus.value = (await api.get('/system/menus')).data.data;
  selected.value = (await api.get(`/system/roles/${r.id}/menus`)).data.data;
  permission.value = true;
}
async function openFieldPermissions(r: any) {
  role.value = r;
  fields.value = (await fetchFieldPermissions(r.id)).data.data;
  if (!fields.value.length)
    fields.value = ['name', 'contact', 'phone', 'status', 'department'].map((fieldCode) => ({
      fieldCode,
      readable: true,
      writable: false,
      maskStrategy: fieldCode === 'phone' ? 'PHONE' : 'NONE',
    }));
  fieldPermission.value = true;
}
async function saveFields() {
  if (!role.value) return;
  await saveFieldPermissions(role.value.id, fields.value);
  fieldPermission.value = false;
  ElMessage.success('列权限保存成功');
}
async function save() {
  if (!role.value) return;
  try {
    await api.put(`/system/roles/${role.value.id}/menus`, { menuIds: selected.value });
    permission.value = false;
    ElMessage.success('权限保存成功');
  } catch {
    ElMessage.error('权限保存失败');
  }
}
/** 打开角色编辑窗口。 */
function openEdit(r: any) {
  role.value = r;
  editForm.value = true;
}
/** 保存角色名称。 */
async function saveEdit(payload: { roleName: string }) {
  if (!role.value) return;
  try {
    await updateRole(role.value.id, payload.roleName);
    editForm.value = false;
    ElMessage.success('角色修改成功');
    await load();
  } catch {
    ElMessage.error('角色修改失败');
  }
}
/** 切换角色状态。 */
async function toggle(r: any) {
  try {
    await setRoleEnabled(r.id, !r.enabled);
    ElMessage.success('状态更新成功');
    await load();
  } catch {
    ElMessage.error('状态更新失败');
  }
}
/** 删除角色。 */
async function remove(r: any) {
  try {
    await ElMessageBox.confirm(`确定删除角色“${r.roleName}”吗？`, '删除确认', { type: 'warning' });
    await deleteRole(r.id);
    ElMessage.success('角色删除成功');
    await load();
  } catch (error: any) {
    if (error !== 'cancel' && error !== 'close') ElMessage.error('角色删除失败');
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
  <el-card
    ><template #header
      ><CrudToolbar title="角色管理"><el-button v-permission="'system:role:write'" type="primary" @click="form = true">新增角色</el-button></CrudToolbar></template
    ><RoleTable
      :roles="roles"
      :can-write="auth.hasPermission('system:role:write')"
      @permission="open"
      @field-permission="openFieldPermissions"
      @edit="openEdit"
      @toggle="toggle"
      @remove="remove" /><CustomerPagination
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
      " /></el-card
  ><RoleForm v-model="form" @save="create" /><RoleEditForm
    v-model="editForm"
    :role="role"
    @save="saveEdit"
  /><RolePermissionDialog
    v-model="permission"
    :role="role"
    :menus="menus"
    v-model:selected-ids="selected"
    @save="save"
  />
  <el-dialog v-model="fieldPermission" :title="`客户列权限 - ${role?.roleName ?? ''}`" width="720px"
    ><el-table :data="fields"
      ><el-table-column prop="fieldCode" label="字段" /><el-table-column label="可读"
        ><template #default="{ row }"><el-switch v-model="row.readable" /></template></el-table-column
      ><el-table-column label="可写"
        ><template #default="{ row }"
          ><el-switch v-model="row.writable" :disabled="!row.readable" /></template></el-table-column
      ><el-table-column label="脱敏策略"
        ><template #default="{ row }"
          ><el-select v-model="row.maskStrategy" :disabled="!row.readable"
            ><el-option
              v-for="m in ['NONE', 'PHONE', 'NAME', 'EMAIL', 'ID_CARD', 'BANK_CARD', 'ADDRESS', 'FULL']"
              :key="m"
              :label="m"
              :value="m" /></el-select></template></el-table-column></el-table
    ><template #footer
      ><el-button @click="fieldPermission = false">取消</el-button
      ><el-button type="primary" @click="saveFields">保存</el-button></template
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
