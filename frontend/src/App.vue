<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { api } from './api';

interface Customer { id: number; name: string; contact: string; phone: string; status: string }
interface User { id: number; username: string; roleCode: string; enabled: boolean }
interface Role { id: number; roleCode: string; roleName: string; enabled: boolean }
interface OperationLog { id: number; username: string; action: string; resource: string; detail: string; createdAt: string }
interface Menu { id: number; parentId: number; menuName: string; permission: string; menuType: string; enabled: boolean }
const loggedIn = ref(Boolean(localStorage.getItem('moyu_token')));
const username = ref('admin');
const password = ref('admin123');
const customers = ref<Customer[]>([]);
const users = ref<User[]>([]);
const roles = ref<Role[]>([]);
const logs = ref<OperationLog[]>([]);
const activeView = ref<'customers' | 'users' | 'roles' | 'logs'>('customers');
const menuView = ref(false);
const newUser = ref({ username: '', password: '' });
const userDialogVisible = ref(false);
const roleDialogVisible = ref(false);
const newRole = ref({ roleCode: '', roleName: '' });
const selectedUserId = ref<number | null>(null);
const selectedRoleCode = ref('');
const newMenu = ref({ parentId: 0, menuName: '', permission: '', menuType: 'M' });
const menuDialogVisible = ref(false);
const menus = ref<Menu[]>([]);
const selectedMenuIds = ref<number[]>([]);
const permissionRole = ref<Role | null>(null);
const permissionDialogVisible = ref(false);
const loading = ref(false);
const permissions = ref<string[]>([]);
const dialogVisible = ref(false);
const editingId = ref<number | null>(null);
const form = ref({ name: '', contact: '', phone: '', status: 'ACTIVE' });

/** 登录并保存访问令牌。 */
async function login() {
  try {
    const response = await api.post('/auth/login', { username: username.value, password: password.value });
    localStorage.setItem('moyu_token', response.data.data.accessToken);
    loggedIn.value = true;
    await loadCurrentUser();
    await loadCustomers();
  } catch { ElMessage.error('登录失败，请检查账号和密码'); }
}

/** 加载当前用户权限。 */
async function loadCurrentUser() {
  try { permissions.value = (await api.get('/auth/me')).data.data.permissions; }
  catch { logout(); ElMessage.error('用户信息加载失败，请重新登录'); }
}

/** 判断当前用户是否拥有指定权限。 */
function hasPermission(permission: string) { return permissions.value.includes(permission); }

/** 查询客户列表。 */
async function loadCustomers() {
  loading.value = true;
  try { customers.value = (await api.get('/customers')).data.data; }
  catch { ElMessage.error('客户数据加载失败'); }
  finally { loading.value = false; }
}

/** 查询用户列表。 */
async function loadUsers() {
  try { users.value = (await api.get('/system/users')).data.data; await loadRoles(); }
  catch { ElMessage.error('用户数据加载失败'); }
}

/** 查询角色列表。 */
async function loadRoles() {
  try { roles.value = (await api.get('/system/roles')).data.data; }
  catch { ElMessage.error('角色数据加载失败'); }
}

/** 查询操作日志。 */
async function loadLogs() {
  try { logs.value = (await api.get('/audit/logs')).data.data; }
  catch { ElMessage.error('操作日志加载失败'); }
}

/** 创建菜单权限。 */
async function createMenu() {
  try { await api.post('/system/menus', newMenu.value); menuDialogVisible.value = false; newMenu.value = { parentId: 0, menuName: '', permission: '', menuType: 'M' }; ElMessage.success('菜单创建成功'); await loadMenus(); }
  catch { ElMessage.error('菜单创建失败'); }
}

/** 查询菜单列表。 */
async function loadMenus() {
  try { menus.value = (await api.get('/system/menus')).data.data; }
  catch { ElMessage.error('菜单加载失败'); }
}

/** 创建角色。 */
async function createRole() {
  try {
    await api.post('/system/roles', newRole.value);
    roleDialogVisible.value = false;
    newRole.value = { roleCode: '', roleName: '' };
    ElMessage.success('角色创建成功');
    await loadRoles();
  } catch { ElMessage.error('角色创建失败'); }
}

/** 打开角色菜单授权弹窗。 */
async function openPermissionDialog(role: Role) {
  try {
    menus.value = (await api.get('/system/menus')).data.data;
    permissionRole.value = role;
    selectedMenuIds.value = [];
    permissionDialogVisible.value = true;
  } catch { ElMessage.error('菜单加载失败'); }
}

/** 保存角色菜单授权。 */
async function savePermission() {
  if (!permissionRole.value) return;
  try {
    await api.put(`/system/roles/${permissionRole.value.id}/menus`, { menuIds: selectedMenuIds.value });
    permissionDialogVisible.value = false;
    ElMessage.success('权限保存成功');
  } catch { ElMessage.error('权限保存失败'); }
}

/** 创建用户。 */
async function createUser() {
  try {
    await api.post('/system/users', newUser.value);
    userDialogVisible.value = false;
    newUser.value = { username: '', password: '' };
    ElMessage.success('用户创建成功');
    await loadUsers();
  } catch { ElMessage.error('用户创建失败'); }
}

/** 切换用户启用状态。 */
async function toggleUser(user: User) {
  try { await api.put(`/system/users/${user.id}/enabled`, null, { params: { enabled: !user.enabled } }); await loadUsers(); }
  catch { ElMessage.error('用户状态更新失败'); }
}

/** 为用户分配角色。 */
async function assignRole(user: User, roleCode: string) {
  try { await api.put(`/system/users/${user.id}/role`, { roleCode }); ElMessage.success('角色分配成功'); await loadUsers(); }
  catch { ElMessage.error('角色分配失败'); }
}

/** 保存用户角色分配面板中的选择。 */
async function saveSelectedUserRole() {
  const user = users.value.find(item => item.id === selectedUserId.value);
  if (user && selectedRoleCode.value) await assignRole(user, selectedRoleCode.value);
}

/** 打开客户新增或编辑弹窗。 */
function openCustomerForm(customer?: Customer) {
  editingId.value = customer?.id ?? null;
  form.value = customer ? { name: customer.name, contact: customer.contact, phone: customer.phone, status: customer.status } : { name: '', contact: '', phone: '', status: 'ACTIVE' };
  dialogVisible.value = true;
}

/** 保存客户信息。 */
async function saveCustomer() {
  try {
    if (editingId.value) await api.put(`/customers/${editingId.value}`, form.value);
    else await api.post('/customers', form.value);
    dialogVisible.value = false;
    ElMessage.success('保存成功');
    await loadCustomers();
  } catch { ElMessage.error('保存失败，请检查输入内容'); }
}

/** 删除客户。 */
async function removeCustomer(customer: Customer) {
  try {
    await ElMessageBox.confirm(`确定删除客户“${customer.name}”吗？`, '删除确认', { type: 'warning' });
    await api.delete(`/customers/${customer.id}`);
    ElMessage.success('删除成功');
    await loadCustomers();
  } catch (error: any) { if (error !== 'cancel' && error !== 'close') ElMessage.error('删除失败'); }
}

/** 退出当前登录。 */
function logout() { localStorage.removeItem('moyu_token'); permissions.value = []; loggedIn.value = false; }

/** 刷新页面后恢复当前登录状态。 */
onMounted(async () => {
  if (loggedIn.value) { await loadCurrentUser(); await loadCustomers(); }
});
</script>

<template>
  <el-container v-if="loggedIn" class="layout">
    <el-header><span class="brand">MoYu-Cloud</span><el-button link @click="logout">退出</el-button></el-header>
    <el-main><el-card><template #header><div class="card-header"><div><el-button :type="activeView === 'customers' && !menuView ? 'primary' : 'default'" @click="menuView = false; activeView = 'customers'">客户管理</el-button><el-button v-if="hasPermission('system:user:read')" :type="activeView === 'users' ? 'primary' : 'default'" @click="menuView = false; activeView = 'users'; loadUsers()">用户管理</el-button><el-button v-if="hasPermission('system:user:read')" :type="activeView === 'roles' ? 'primary' : 'default'" @click="menuView = false; activeView = 'roles'; loadRoles()">角色管理</el-button><el-button v-if="hasPermission('system:user:read')" :type="activeView === 'logs' ? 'primary' : 'default'" @click="menuView = false; activeView = 'logs'; loadLogs()">操作日志</el-button><el-button v-if="hasPermission('system:user:read')" :type="menuView ? 'primary' : 'default'" @click="menuView = true; activeView = 'customers'; loadMenus()">菜单管理</el-button></div><el-button v-if="!menuView && activeView === 'customers' && hasPermission('customer:write')" type="primary" @click="openCustomerForm()">新增客户</el-button><el-button v-if="!menuView && activeView === 'users' && hasPermission('system:user:write')" type="primary" @click="userDialogVisible = true">新增用户</el-button><el-button v-if="!menuView && activeView === 'roles' && hasPermission('system:user:write')" type="primary" @click="roleDialogVisible = true">新增角色</el-button><el-button v-if="menuView && hasPermission('system:user:write')" type="primary" @click="menuDialogVisible = true">新增菜单</el-button></div></template>
    <el-table v-if="menuView" :data="menus" stripe><el-table-column prop="id" label="编号" width="90"/><el-table-column prop="menuName" label="菜单名称"/><el-table-column prop="permission" label="权限标识"/><el-table-column prop="menuType" label="类型" width="90"/><el-table-column label="状态"><template #default="scope"><el-tag type="success">{{ scope.row.enabled ? '启用' : '禁用' }}</el-tag></template></el-table-column></el-table><el-table v-else-if="activeView === 'customers'" v-loading="loading" :data="customers" stripe>
      <el-table-column prop="id" label="编号" width="90"/><el-table-column prop="name" label="客户名称"/>
      <el-table-column prop="contact" label="联系人"/><el-table-column prop="phone" label="联系电话"/><el-table-column prop="status" label="状态"/>
      <el-table-column label="操作" width="150"><template #default="scope"><el-button v-if="hasPermission('customer:write')" link type="primary" @click="openCustomerForm(scope.row)">编辑</el-button><el-button v-if="hasPermission('customer:write')" link type="danger" @click="removeCustomer(scope.row)">删除</el-button></template></el-table-column>
    </el-table><el-table v-else-if="activeView === 'users'" :data="users" stripe><el-table-column prop="id" label="编号" width="90"/><el-table-column prop="username" label="用户名"/><el-table-column prop="roleCode" label="角色"/><el-table-column label="状态"><template #default="scope"><el-tag :type="scope.row.enabled ? 'success' : 'info'">{{ scope.row.enabled ? '启用' : '禁用' }}</el-tag></template></el-table-column><el-table-column label="操作" width="110"><template #default="scope"><el-button v-if="hasPermission('system:user:write')" link type="primary" @click="toggleUser(scope.row)">{{ scope.row.enabled ? '禁用' : '启用' }}</el-button></template></el-table-column></el-table><el-table v-else-if="activeView === 'roles'" :data="roles" stripe><el-table-column prop="id" label="编号" width="90"/><el-table-column prop="roleCode" label="角色编码"/><el-table-column prop="roleName" label="角色名称"/><el-table-column label="状态"><template #default="scope"><el-tag :type="scope.row.enabled ? 'success' : 'info'">{{ scope.row.enabled ? '启用' : '禁用' }}</el-tag></template></el-table-column><el-table-column label="操作" width="120"><template #default="scope"><el-button v-if="hasPermission('system:user:write')" link type="primary" @click="openPermissionDialog(scope.row)">菜单授权</el-button></template></el-table-column></el-table><el-table v-else :data="logs" stripe><el-table-column prop="createdAt" label="时间" width="190"/><el-table-column prop="username" label="用户" width="100"/><el-table-column prop="action" label="动作" width="100"/><el-table-column prop="resource" label="资源" width="120"/><el-table-column prop="detail" label="详情"/></el-table></el-card></el-main>
    <el-dialog v-model="dialogVisible" :title="editingId ? '编辑客户' : '新增客户'" width="460px"><el-form label-width="80px"><el-form-item label="客户名称"><el-input v-model="form.name" /></el-form-item><el-form-item label="联系人"><el-input v-model="form.contact" /></el-form-item><el-form-item label="手机号"><el-input v-model="form.phone" /></el-form-item><el-form-item label="状态"><el-select v-model="form.status" style="width: 100%"><el-option label="有效" value="ACTIVE"/><el-option label="停用" value="INACTIVE"/></el-select></el-form-item></el-form><template #footer><el-button @click="dialogVisible = false">取消</el-button><el-button type="primary" @click="saveCustomer">保存</el-button></template></el-dialog>
    <el-dialog v-model="userDialogVisible" title="新增用户" width="400px"><el-form label-width="70px"><el-form-item label="用户名"><el-input v-model="newUser.username" /></el-form-item><el-form-item label="密码"><el-input v-model="newUser.password" type="password" show-password /></el-form-item></el-form><template #footer><el-button @click="userDialogVisible = false">取消</el-button><el-button type="primary" @click="createUser">保存</el-button></template></el-dialog>
    <el-dialog v-model="roleDialogVisible" title="新增角色" width="400px"><el-form label-width="80px"><el-form-item label="角色编码"><el-input v-model="newRole.roleCode" /></el-form-item><el-form-item label="角色名称"><el-input v-model="newRole.roleName" /></el-form-item></el-form><template #footer><el-button @click="roleDialogVisible = false">取消</el-button><el-button type="primary" @click="createRole">保存</el-button></template></el-dialog>
    <el-dialog v-model="permissionDialogVisible" :title="`菜单授权 - ${permissionRole?.roleName ?? ''}`" width="460px"><el-checkbox-group v-model="selectedMenuIds"><el-checkbox v-for="menu in menus" :key="menu.id" :label="menu.id">{{ menu.menuName }}<span v-if="menu.permission" class="permission">（{{ menu.permission }}）</span></el-checkbox></el-checkbox-group><template #footer><el-button @click="permissionDialogVisible = false">取消</el-button><el-button type="primary" @click="savePermission">保存</el-button></template></el-dialog>
    <el-dialog v-model="menuDialogVisible" title="新增菜单" width="420px"><el-form label-width="90px"><el-form-item label="菜单名称"><el-input v-model="newMenu.menuName" /></el-form-item><el-form-item label="权限标识"><el-input v-model="newMenu.permission" placeholder="例如 customer:read" /></el-form-item><el-form-item label="菜单类型"><el-select v-model="newMenu.menuType" style="width: 100%"><el-option label="菜单" value="M"/><el-option label="按钮" value="B"/></el-select></el-form-item></el-form><template #footer><el-button @click="menuDialogVisible = false">取消</el-button><el-button type="primary" @click="createMenu">保存</el-button></template></el-dialog>
  </el-container>
  <el-main v-else class="login-page"><el-card class="login-card"><h2>MoYu-Cloud 控制台</h2><p>让开发少走弯路，让系统快速落座</p>
    <el-form @submit.prevent="login"><el-form-item><el-input v-model="username" placeholder="用户名"/></el-form-item><el-form-item><el-input v-model="password" type="password" placeholder="密码" show-password/></el-form-item><el-button type="primary" native-type="submit" class="full">登录</el-button></el-form>
  </el-card></el-main>
  <el-card v-if="loggedIn && !menuView && activeView === 'users' && hasPermission('system:user:write')" class="role-assignment-card">
    <template #header>用户角色分配</template>
    <el-form inline>
      <el-form-item label="用户"><el-select v-model="selectedUserId" placeholder="请选择用户" style="width: 180px"><el-option v-for="user in users" :key="user.id" :label="user.username" :value="user.id" /></el-select></el-form-item>
      <el-form-item label="角色"><el-select v-model="selectedRoleCode" placeholder="请选择角色" style="width: 180px"><el-option v-for="role in roles" :key="role.roleCode" :label="role.roleName" :value="role.roleCode" /></el-select></el-form-item>
      <el-button type="primary" :disabled="selectedUserId === null || !selectedRoleCode" @click="saveSelectedUserRole">保存角色</el-button>
    </el-form>
  </el-card>
</template>

<style scoped>
.layout { min-height: 100vh; background: #f5f7fa; }.el-header { display: flex; align-items: center; justify-content: space-between; background: #1f2937; color: white; }.brand { font-size: 20px; font-weight: 600; }.card-header { display: flex; justify-content: space-between; align-items: center; }.login-page { min-height: 100vh; display: grid; place-items: center; background: #f5f7fa; }.login-card { width: 360px; }.login-card h2 { margin-bottom: 8px; }.login-card p { color: #909399; }.full { width: 100%; }
</style>
