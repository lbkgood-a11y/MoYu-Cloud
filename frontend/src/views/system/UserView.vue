<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { api } from '../../api';
import { fetchUsers, fetchRoles, assignUserRole, updateUser, deleteUser, resetUserPassword } from '../../api/system';
import UserTable from '../../components/UserTable.vue';
import UserForm from '../../components/UserForm.vue';
import UserEditForm from '../../components/UserEditForm.vue';
import ResetPasswordForm from '../../components/ResetPasswordForm.vue';
import CustomerPagination from '../../components/CustomerPagination.vue';
import { useAuthStore } from '../../stores/auth';
import CrudToolbar from '../../components/CrudToolbar.vue';
import CrudForm from '../../components/crud/CrudForm.vue';
import { fetchDepartments } from '../../api/department';
const auth = useAuthStore();
const users = ref<any[]>([]);
const roles = ref<any[]>([]);
const page = ref(1);
const size = ref(10);
const total = ref(0);
const dialog = ref(false);
const editDialog = ref(false);
const resetDialog = ref(false);
const selectedUser = ref<any | null>(null);
const departments = ref<any[]>([]);
async function load() {
  try {
    const [u, r, d] = await Promise.all([fetchUsers(page.value, size.value), fetchRoles(1, 100), fetchDepartments()]);
    users.value = u.data.data.items;
    total.value = u.data.data.total;
    roles.value = r.data.data.items;
    departments.value = d.data.data;
  } catch {
    ElMessage.error('用户数据加载失败');
  }
}
async function create(payload: any) {
  try {
    await api.post('/system/users', payload);
    dialog.value = false;
    await load();
  } catch {
    ElMessage.error('用户创建失败');
  }
}
async function toggle(u: any) {
  try {
    await api.put(`/system/users/${u.id}/enabled`, null, { params: { enabled: !u.enabled } });
    await load();
  } catch {
    ElMessage.error('状态更新失败');
  }
}
async function assignRole(u: any, c: string) {
  try {
    await assignUserRole(u.id, c);
    await load();
  } catch {
    ElMessage.error('角色分配失败');
  }
}
onMounted(load);
/** 打开编辑用户弹窗。 */
function openEdit(user: any) {
  selectedUser.value = user;
  editDialog.value = true;
}
/** 保存用户资料。 */
async function saveEdit(payload: { username: string }) {
  if (!selectedUser.value) return;
  try {
    await updateUser(selectedUser.value.id, payload);
    editDialog.value = false;
    ElMessage.success('用户修改成功');
    await load();
  } catch {
    ElMessage.error('用户修改失败');
  }
}
/** 删除用户并执行二次确认。 */
async function remove(user: any) {
  try {
    await ElMessageBox.confirm(`确定删除用户“${user.username}”吗？`, '删除确认', { type: 'warning' });
    await deleteUser(user.id);
    ElMessage.success('用户删除成功');
    await load();
  } catch (error: any) {
    if (error !== 'cancel' && error !== 'close') ElMessage.error('用户删除失败');
  }
}
/** 打开重置密码弹窗。 */
function openReset(user: any) {
  selectedUser.value = user;
  resetDialog.value = true;
}
/** 保存重置后的密码。 */
async function saveReset(payload: { password: string }) {
  if (!selectedUser.value) return;
  try {
    await resetUserPassword(selectedUser.value.id, payload.password);
    resetDialog.value = false;
    ElMessage.success('密码重置成功');
  } catch {
    ElMessage.error('密码重置失败');
  }
}
</script>
<template>
  <el-card
    ><template #header
      ><CrudToolbar title="用户管理"><el-button v-permission="'system:user:write'" type="primary" @click="dialog = true">新增用户</el-button></CrudToolbar></template
    ><UserTable
      :users="users"
      :roles="roles"
      :can-write="auth.hasPermission('system:user:write')"
      @toggle="toggle"
      @assign-role="assignRole"
      @edit="openEdit"
      @remove="remove"
      @reset-password="openReset" /><CustomerPagination
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
  ><UserForm v-model="dialog" :departments="departments" @save="create" /><UserEditForm
    v-model="editDialog"
    :user="selectedUser"
    :departments="departments"
    @save="saveEdit"
  /><ResetPasswordForm v-model="resetDialog" :username="selectedUser?.username ?? ''" @save="saveReset" />
</template>
<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
