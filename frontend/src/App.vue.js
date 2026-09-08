import { onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { api } from './api';
const loggedIn = ref(Boolean(localStorage.getItem('moyu_token')));
const username = ref('admin');
const password = ref('admin123');
const customers = ref([]);
const users = ref([]);
const roles = ref([]);
const logs = ref([]);
const activeView = ref('customers');
const menuView = ref(false);
const newUser = ref({ username: '', password: '' });
const userDialogVisible = ref(false);
const roleDialogVisible = ref(false);
const newRole = ref({ roleCode: '', roleName: '' });
const selectedUserId = ref(null);
const selectedRoleCode = ref('');
const newMenu = ref({ parentId: 0, menuName: '', permission: '', menuType: 'M' });
const menuDialogVisible = ref(false);
const menus = ref([]);
const selectedMenuIds = ref([]);
const permissionRole = ref(null);
const permissionDialogVisible = ref(false);
const loading = ref(false);
const permissions = ref([]);
const dialogVisible = ref(false);
const editingId = ref(null);
const form = ref({ name: '', contact: '', phone: '', status: 'ACTIVE' });
/** 登录并保存访问令牌。 */
async function login() {
    try {
        const response = await api.post('/auth/login', { username: username.value, password: password.value });
        localStorage.setItem('moyu_token', response.data.data.accessToken);
        loggedIn.value = true;
        await loadCurrentUser();
        await loadCustomers();
    }
    catch {
        ElMessage.error('登录失败，请检查账号和密码');
    }
}
/** 加载当前用户权限。 */
async function loadCurrentUser() {
    try {
        permissions.value = (await api.get('/auth/me')).data.data.permissions;
    }
    catch {
        logout();
        ElMessage.error('用户信息加载失败，请重新登录');
    }
}
/** 判断当前用户是否拥有指定权限。 */
function hasPermission(permission) { return permissions.value.includes(permission); }
/** 查询客户列表。 */
async function loadCustomers() {
    loading.value = true;
    try {
        customers.value = (await api.get('/customers')).data.data;
    }
    catch {
        ElMessage.error('客户数据加载失败');
    }
    finally {
        loading.value = false;
    }
}
/** 查询用户列表。 */
async function loadUsers() {
    try {
        users.value = (await api.get('/system/users')).data.data;
        await loadRoles();
    }
    catch {
        ElMessage.error('用户数据加载失败');
    }
}
/** 查询角色列表。 */
async function loadRoles() {
    try {
        roles.value = (await api.get('/system/roles')).data.data;
    }
    catch {
        ElMessage.error('角色数据加载失败');
    }
}
/** 查询操作日志。 */
async function loadLogs() {
    try {
        logs.value = (await api.get('/audit/logs')).data.data;
    }
    catch {
        ElMessage.error('操作日志加载失败');
    }
}
/** 创建菜单权限。 */
async function createMenu() {
    try {
        await api.post('/system/menus', newMenu.value);
        menuDialogVisible.value = false;
        newMenu.value = { parentId: 0, menuName: '', permission: '', menuType: 'M' };
        ElMessage.success('菜单创建成功');
        await loadMenus();
    }
    catch {
        ElMessage.error('菜单创建失败');
    }
}
/** 查询菜单列表。 */
async function loadMenus() {
    try {
        menus.value = (await api.get('/system/menus')).data.data;
    }
    catch {
        ElMessage.error('菜单加载失败');
    }
}
/** 创建角色。 */
async function createRole() {
    try {
        await api.post('/system/roles', newRole.value);
        roleDialogVisible.value = false;
        newRole.value = { roleCode: '', roleName: '' };
        ElMessage.success('角色创建成功');
        await loadRoles();
    }
    catch {
        ElMessage.error('角色创建失败');
    }
}
/** 打开角色菜单授权弹窗。 */
async function openPermissionDialog(role) {
    try {
        menus.value = (await api.get('/system/menus')).data.data;
        permissionRole.value = role;
        selectedMenuIds.value = [];
        permissionDialogVisible.value = true;
    }
    catch {
        ElMessage.error('菜单加载失败');
    }
}
/** 保存角色菜单授权。 */
async function savePermission() {
    if (!permissionRole.value)
        return;
    try {
        await api.put(`/system/roles/${permissionRole.value.id}/menus`, { menuIds: selectedMenuIds.value });
        permissionDialogVisible.value = false;
        ElMessage.success('权限保存成功');
    }
    catch {
        ElMessage.error('权限保存失败');
    }
}
/** 创建用户。 */
async function createUser() {
    try {
        await api.post('/system/users', newUser.value);
        userDialogVisible.value = false;
        newUser.value = { username: '', password: '' };
        ElMessage.success('用户创建成功');
        await loadUsers();
    }
    catch {
        ElMessage.error('用户创建失败');
    }
}
/** 切换用户启用状态。 */
async function toggleUser(user) {
    try {
        await api.put(`/system/users/${user.id}/enabled`, null, { params: { enabled: !user.enabled } });
        await loadUsers();
    }
    catch {
        ElMessage.error('用户状态更新失败');
    }
}
/** 为用户分配角色。 */
async function assignRole(user, roleCode) {
    try {
        await api.put(`/system/users/${user.id}/role`, { roleCode });
        ElMessage.success('角色分配成功');
        await loadUsers();
    }
    catch {
        ElMessage.error('角色分配失败');
    }
}
/** 保存用户角色分配面板中的选择。 */
async function saveSelectedUserRole() {
    const user = users.value.find(item => item.id === selectedUserId.value);
    if (user && selectedRoleCode.value)
        await assignRole(user, selectedRoleCode.value);
}
/** 打开客户新增或编辑弹窗。 */
function openCustomerForm(customer) {
    editingId.value = customer?.id ?? null;
    form.value = customer ? { name: customer.name, contact: customer.contact, phone: customer.phone, status: customer.status } : { name: '', contact: '', phone: '', status: 'ACTIVE' };
    dialogVisible.value = true;
}
/** 保存客户信息。 */
async function saveCustomer() {
    try {
        if (editingId.value)
            await api.put(`/customers/${editingId.value}`, form.value);
        else
            await api.post('/customers', form.value);
        dialogVisible.value = false;
        ElMessage.success('保存成功');
        await loadCustomers();
    }
    catch {
        ElMessage.error('保存失败，请检查输入内容');
    }
}
/** 删除客户。 */
async function removeCustomer(customer) {
    try {
        await ElMessageBox.confirm(`确定删除客户“${customer.name}”吗？`, '删除确认', { type: 'warning' });
        await api.delete(`/customers/${customer.id}`);
        ElMessage.success('删除成功');
        await loadCustomers();
    }
    catch (error) {
        if (error !== 'cancel' && error !== 'close')
            ElMessage.error('删除失败');
    }
}
/** 退出当前登录。 */
function logout() { localStorage.removeItem('moyu_token'); permissions.value = []; loggedIn.value = false; }
/** 刷新页面后恢复当前登录状态。 */
onMounted(async () => {
    if (loggedIn.value) {
        await loadCurrentUser();
        await loadCustomers();
    }
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['login-card']} */ ;
/** @type {__VLS_StyleScopedClasses['login-card']} */ ;
// CSS variable injection 
// CSS variable injection end 
if (__VLS_ctx.loggedIn) {
    const __VLS_0 = {}.ElContainer;
    /** @type {[typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, typeof __VLS_components.ElContainer, typeof __VLS_components.elContainer, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ class: "layout" },
    }));
    const __VLS_2 = __VLS_1({
        ...{ class: "layout" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    __VLS_3.slots.default;
    const __VLS_4 = {}.ElHeader;
    /** @type {[typeof __VLS_components.ElHeader, typeof __VLS_components.elHeader, typeof __VLS_components.ElHeader, typeof __VLS_components.elHeader, ]} */ ;
    // @ts-ignore
    const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({}));
    const __VLS_6 = __VLS_5({}, ...__VLS_functionalComponentArgsRest(__VLS_5));
    __VLS_7.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "brand" },
    });
    const __VLS_8 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        ...{ 'onClick': {} },
        link: true,
    }));
    const __VLS_10 = __VLS_9({
        ...{ 'onClick': {} },
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    let __VLS_12;
    let __VLS_13;
    let __VLS_14;
    const __VLS_15 = {
        onClick: (__VLS_ctx.logout)
    };
    __VLS_11.slots.default;
    var __VLS_11;
    var __VLS_7;
    const __VLS_16 = {}.ElMain;
    /** @type {[typeof __VLS_components.ElMain, typeof __VLS_components.elMain, typeof __VLS_components.ElMain, typeof __VLS_components.elMain, ]} */ ;
    // @ts-ignore
    const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({}));
    const __VLS_18 = __VLS_17({}, ...__VLS_functionalComponentArgsRest(__VLS_17));
    __VLS_19.slots.default;
    const __VLS_20 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({}));
    const __VLS_22 = __VLS_21({}, ...__VLS_functionalComponentArgsRest(__VLS_21));
    __VLS_23.slots.default;
    {
        const { header: __VLS_thisSlot } = __VLS_23.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "card-header" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        const __VLS_24 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
            ...{ 'onClick': {} },
            type: (__VLS_ctx.activeView === 'customers' && !__VLS_ctx.menuView ? 'primary' : 'default'),
        }));
        const __VLS_26 = __VLS_25({
            ...{ 'onClick': {} },
            type: (__VLS_ctx.activeView === 'customers' && !__VLS_ctx.menuView ? 'primary' : 'default'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_25));
        let __VLS_28;
        let __VLS_29;
        let __VLS_30;
        const __VLS_31 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.loggedIn))
                    return;
                __VLS_ctx.menuView = false;
                __VLS_ctx.activeView = 'customers';
            }
        };
        __VLS_27.slots.default;
        var __VLS_27;
        if (__VLS_ctx.hasPermission('system:user:read')) {
            const __VLS_32 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
                ...{ 'onClick': {} },
                type: (__VLS_ctx.activeView === 'users' ? 'primary' : 'default'),
            }));
            const __VLS_34 = __VLS_33({
                ...{ 'onClick': {} },
                type: (__VLS_ctx.activeView === 'users' ? 'primary' : 'default'),
            }, ...__VLS_functionalComponentArgsRest(__VLS_33));
            let __VLS_36;
            let __VLS_37;
            let __VLS_38;
            const __VLS_39 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.loggedIn))
                        return;
                    if (!(__VLS_ctx.hasPermission('system:user:read')))
                        return;
                    __VLS_ctx.menuView = false;
                    __VLS_ctx.activeView = 'users';
                    __VLS_ctx.loadUsers();
                }
            };
            __VLS_35.slots.default;
            var __VLS_35;
        }
        if (__VLS_ctx.hasPermission('system:user:read')) {
            const __VLS_40 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
                ...{ 'onClick': {} },
                type: (__VLS_ctx.activeView === 'roles' ? 'primary' : 'default'),
            }));
            const __VLS_42 = __VLS_41({
                ...{ 'onClick': {} },
                type: (__VLS_ctx.activeView === 'roles' ? 'primary' : 'default'),
            }, ...__VLS_functionalComponentArgsRest(__VLS_41));
            let __VLS_44;
            let __VLS_45;
            let __VLS_46;
            const __VLS_47 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.loggedIn))
                        return;
                    if (!(__VLS_ctx.hasPermission('system:user:read')))
                        return;
                    __VLS_ctx.menuView = false;
                    __VLS_ctx.activeView = 'roles';
                    __VLS_ctx.loadRoles();
                }
            };
            __VLS_43.slots.default;
            var __VLS_43;
        }
        if (__VLS_ctx.hasPermission('system:user:read')) {
            const __VLS_48 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
                ...{ 'onClick': {} },
                type: (__VLS_ctx.activeView === 'logs' ? 'primary' : 'default'),
            }));
            const __VLS_50 = __VLS_49({
                ...{ 'onClick': {} },
                type: (__VLS_ctx.activeView === 'logs' ? 'primary' : 'default'),
            }, ...__VLS_functionalComponentArgsRest(__VLS_49));
            let __VLS_52;
            let __VLS_53;
            let __VLS_54;
            const __VLS_55 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.loggedIn))
                        return;
                    if (!(__VLS_ctx.hasPermission('system:user:read')))
                        return;
                    __VLS_ctx.menuView = false;
                    __VLS_ctx.activeView = 'logs';
                    __VLS_ctx.loadLogs();
                }
            };
            __VLS_51.slots.default;
            var __VLS_51;
        }
        if (__VLS_ctx.hasPermission('system:user:read')) {
            const __VLS_56 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
                ...{ 'onClick': {} },
                type: (__VLS_ctx.menuView ? 'primary' : 'default'),
            }));
            const __VLS_58 = __VLS_57({
                ...{ 'onClick': {} },
                type: (__VLS_ctx.menuView ? 'primary' : 'default'),
            }, ...__VLS_functionalComponentArgsRest(__VLS_57));
            let __VLS_60;
            let __VLS_61;
            let __VLS_62;
            const __VLS_63 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.loggedIn))
                        return;
                    if (!(__VLS_ctx.hasPermission('system:user:read')))
                        return;
                    __VLS_ctx.menuView = true;
                    __VLS_ctx.activeView = 'customers';
                    __VLS_ctx.loadMenus();
                }
            };
            __VLS_59.slots.default;
            var __VLS_59;
        }
        if (!__VLS_ctx.menuView && __VLS_ctx.activeView === 'customers' && __VLS_ctx.hasPermission('customer:write')) {
            const __VLS_64 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
                ...{ 'onClick': {} },
                type: "primary",
            }));
            const __VLS_66 = __VLS_65({
                ...{ 'onClick': {} },
                type: "primary",
            }, ...__VLS_functionalComponentArgsRest(__VLS_65));
            let __VLS_68;
            let __VLS_69;
            let __VLS_70;
            const __VLS_71 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.loggedIn))
                        return;
                    if (!(!__VLS_ctx.menuView && __VLS_ctx.activeView === 'customers' && __VLS_ctx.hasPermission('customer:write')))
                        return;
                    __VLS_ctx.openCustomerForm();
                }
            };
            __VLS_67.slots.default;
            var __VLS_67;
        }
        if (!__VLS_ctx.menuView && __VLS_ctx.activeView === 'users' && __VLS_ctx.hasPermission('system:user:write')) {
            const __VLS_72 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
                ...{ 'onClick': {} },
                type: "primary",
            }));
            const __VLS_74 = __VLS_73({
                ...{ 'onClick': {} },
                type: "primary",
            }, ...__VLS_functionalComponentArgsRest(__VLS_73));
            let __VLS_76;
            let __VLS_77;
            let __VLS_78;
            const __VLS_79 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.loggedIn))
                        return;
                    if (!(!__VLS_ctx.menuView && __VLS_ctx.activeView === 'users' && __VLS_ctx.hasPermission('system:user:write')))
                        return;
                    __VLS_ctx.userDialogVisible = true;
                }
            };
            __VLS_75.slots.default;
            var __VLS_75;
        }
        if (!__VLS_ctx.menuView && __VLS_ctx.activeView === 'roles' && __VLS_ctx.hasPermission('system:user:write')) {
            const __VLS_80 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
                ...{ 'onClick': {} },
                type: "primary",
            }));
            const __VLS_82 = __VLS_81({
                ...{ 'onClick': {} },
                type: "primary",
            }, ...__VLS_functionalComponentArgsRest(__VLS_81));
            let __VLS_84;
            let __VLS_85;
            let __VLS_86;
            const __VLS_87 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.loggedIn))
                        return;
                    if (!(!__VLS_ctx.menuView && __VLS_ctx.activeView === 'roles' && __VLS_ctx.hasPermission('system:user:write')))
                        return;
                    __VLS_ctx.roleDialogVisible = true;
                }
            };
            __VLS_83.slots.default;
            var __VLS_83;
        }
        if (__VLS_ctx.menuView && __VLS_ctx.hasPermission('system:user:write')) {
            const __VLS_88 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
                ...{ 'onClick': {} },
                type: "primary",
            }));
            const __VLS_90 = __VLS_89({
                ...{ 'onClick': {} },
                type: "primary",
            }, ...__VLS_functionalComponentArgsRest(__VLS_89));
            let __VLS_92;
            let __VLS_93;
            let __VLS_94;
            const __VLS_95 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.loggedIn))
                        return;
                    if (!(__VLS_ctx.menuView && __VLS_ctx.hasPermission('system:user:write')))
                        return;
                    __VLS_ctx.menuDialogVisible = true;
                }
            };
            __VLS_91.slots.default;
            var __VLS_91;
        }
    }
    if (__VLS_ctx.menuView) {
        const __VLS_96 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_97 = __VLS_asFunctionalComponent(__VLS_96, new __VLS_96({
            data: (__VLS_ctx.menus),
            stripe: true,
        }));
        const __VLS_98 = __VLS_97({
            data: (__VLS_ctx.menus),
            stripe: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_97));
        __VLS_99.slots.default;
        const __VLS_100 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
            prop: "id",
            label: "编号",
            width: "90",
        }));
        const __VLS_102 = __VLS_101({
            prop: "id",
            label: "编号",
            width: "90",
        }, ...__VLS_functionalComponentArgsRest(__VLS_101));
        const __VLS_104 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_105 = __VLS_asFunctionalComponent(__VLS_104, new __VLS_104({
            prop: "menuName",
            label: "菜单名称",
        }));
        const __VLS_106 = __VLS_105({
            prop: "menuName",
            label: "菜单名称",
        }, ...__VLS_functionalComponentArgsRest(__VLS_105));
        const __VLS_108 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_109 = __VLS_asFunctionalComponent(__VLS_108, new __VLS_108({
            prop: "permission",
            label: "权限标识",
        }));
        const __VLS_110 = __VLS_109({
            prop: "permission",
            label: "权限标识",
        }, ...__VLS_functionalComponentArgsRest(__VLS_109));
        const __VLS_112 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_113 = __VLS_asFunctionalComponent(__VLS_112, new __VLS_112({
            prop: "menuType",
            label: "类型",
            width: "90",
        }));
        const __VLS_114 = __VLS_113({
            prop: "menuType",
            label: "类型",
            width: "90",
        }, ...__VLS_functionalComponentArgsRest(__VLS_113));
        const __VLS_116 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_117 = __VLS_asFunctionalComponent(__VLS_116, new __VLS_116({
            label: "状态",
        }));
        const __VLS_118 = __VLS_117({
            label: "状态",
        }, ...__VLS_functionalComponentArgsRest(__VLS_117));
        __VLS_119.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_119.slots;
            const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_120 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_121 = __VLS_asFunctionalComponent(__VLS_120, new __VLS_120({
                type: "success",
            }));
            const __VLS_122 = __VLS_121({
                type: "success",
            }, ...__VLS_functionalComponentArgsRest(__VLS_121));
            __VLS_123.slots.default;
            (scope.row.enabled ? '启用' : '禁用');
            var __VLS_123;
        }
        var __VLS_119;
        var __VLS_99;
    }
    else if (__VLS_ctx.activeView === 'customers') {
        const __VLS_124 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_125 = __VLS_asFunctionalComponent(__VLS_124, new __VLS_124({
            data: (__VLS_ctx.customers),
            stripe: true,
        }));
        const __VLS_126 = __VLS_125({
            data: (__VLS_ctx.customers),
            stripe: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_125));
        __VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
        __VLS_127.slots.default;
        const __VLS_128 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_129 = __VLS_asFunctionalComponent(__VLS_128, new __VLS_128({
            prop: "id",
            label: "编号",
            width: "90",
        }));
        const __VLS_130 = __VLS_129({
            prop: "id",
            label: "编号",
            width: "90",
        }, ...__VLS_functionalComponentArgsRest(__VLS_129));
        const __VLS_132 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_133 = __VLS_asFunctionalComponent(__VLS_132, new __VLS_132({
            prop: "name",
            label: "客户名称",
        }));
        const __VLS_134 = __VLS_133({
            prop: "name",
            label: "客户名称",
        }, ...__VLS_functionalComponentArgsRest(__VLS_133));
        const __VLS_136 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_137 = __VLS_asFunctionalComponent(__VLS_136, new __VLS_136({
            prop: "contact",
            label: "联系人",
        }));
        const __VLS_138 = __VLS_137({
            prop: "contact",
            label: "联系人",
        }, ...__VLS_functionalComponentArgsRest(__VLS_137));
        const __VLS_140 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_141 = __VLS_asFunctionalComponent(__VLS_140, new __VLS_140({
            prop: "phone",
            label: "联系电话",
        }));
        const __VLS_142 = __VLS_141({
            prop: "phone",
            label: "联系电话",
        }, ...__VLS_functionalComponentArgsRest(__VLS_141));
        const __VLS_144 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_145 = __VLS_asFunctionalComponent(__VLS_144, new __VLS_144({
            prop: "status",
            label: "状态",
        }));
        const __VLS_146 = __VLS_145({
            prop: "status",
            label: "状态",
        }, ...__VLS_functionalComponentArgsRest(__VLS_145));
        const __VLS_148 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_149 = __VLS_asFunctionalComponent(__VLS_148, new __VLS_148({
            label: "操作",
            width: "150",
        }));
        const __VLS_150 = __VLS_149({
            label: "操作",
            width: "150",
        }, ...__VLS_functionalComponentArgsRest(__VLS_149));
        __VLS_151.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_151.slots;
            const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
            if (__VLS_ctx.hasPermission('customer:write')) {
                const __VLS_152 = {}.ElButton;
                /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                // @ts-ignore
                const __VLS_153 = __VLS_asFunctionalComponent(__VLS_152, new __VLS_152({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "primary",
                }));
                const __VLS_154 = __VLS_153({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "primary",
                }, ...__VLS_functionalComponentArgsRest(__VLS_153));
                let __VLS_156;
                let __VLS_157;
                let __VLS_158;
                const __VLS_159 = {
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.loggedIn))
                            return;
                        if (!!(__VLS_ctx.menuView))
                            return;
                        if (!(__VLS_ctx.activeView === 'customers'))
                            return;
                        if (!(__VLS_ctx.hasPermission('customer:write')))
                            return;
                        __VLS_ctx.openCustomerForm(scope.row);
                    }
                };
                __VLS_155.slots.default;
                var __VLS_155;
            }
            if (__VLS_ctx.hasPermission('customer:write')) {
                const __VLS_160 = {}.ElButton;
                /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                // @ts-ignore
                const __VLS_161 = __VLS_asFunctionalComponent(__VLS_160, new __VLS_160({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "danger",
                }));
                const __VLS_162 = __VLS_161({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "danger",
                }, ...__VLS_functionalComponentArgsRest(__VLS_161));
                let __VLS_164;
                let __VLS_165;
                let __VLS_166;
                const __VLS_167 = {
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.loggedIn))
                            return;
                        if (!!(__VLS_ctx.menuView))
                            return;
                        if (!(__VLS_ctx.activeView === 'customers'))
                            return;
                        if (!(__VLS_ctx.hasPermission('customer:write')))
                            return;
                        __VLS_ctx.removeCustomer(scope.row);
                    }
                };
                __VLS_163.slots.default;
                var __VLS_163;
            }
        }
        var __VLS_151;
        var __VLS_127;
    }
    else if (__VLS_ctx.activeView === 'users') {
        const __VLS_168 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_169 = __VLS_asFunctionalComponent(__VLS_168, new __VLS_168({
            data: (__VLS_ctx.users),
            stripe: true,
        }));
        const __VLS_170 = __VLS_169({
            data: (__VLS_ctx.users),
            stripe: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_169));
        __VLS_171.slots.default;
        const __VLS_172 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_173 = __VLS_asFunctionalComponent(__VLS_172, new __VLS_172({
            prop: "id",
            label: "编号",
            width: "90",
        }));
        const __VLS_174 = __VLS_173({
            prop: "id",
            label: "编号",
            width: "90",
        }, ...__VLS_functionalComponentArgsRest(__VLS_173));
        const __VLS_176 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_177 = __VLS_asFunctionalComponent(__VLS_176, new __VLS_176({
            prop: "username",
            label: "用户名",
        }));
        const __VLS_178 = __VLS_177({
            prop: "username",
            label: "用户名",
        }, ...__VLS_functionalComponentArgsRest(__VLS_177));
        const __VLS_180 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_181 = __VLS_asFunctionalComponent(__VLS_180, new __VLS_180({
            prop: "roleCode",
            label: "角色",
        }));
        const __VLS_182 = __VLS_181({
            prop: "roleCode",
            label: "角色",
        }, ...__VLS_functionalComponentArgsRest(__VLS_181));
        const __VLS_184 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
            label: "状态",
        }));
        const __VLS_186 = __VLS_185({
            label: "状态",
        }, ...__VLS_functionalComponentArgsRest(__VLS_185));
        __VLS_187.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_187.slots;
            const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_188 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
                type: (scope.row.enabled ? 'success' : 'info'),
            }));
            const __VLS_190 = __VLS_189({
                type: (scope.row.enabled ? 'success' : 'info'),
            }, ...__VLS_functionalComponentArgsRest(__VLS_189));
            __VLS_191.slots.default;
            (scope.row.enabled ? '启用' : '禁用');
            var __VLS_191;
        }
        var __VLS_187;
        const __VLS_192 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
            label: "操作",
            width: "110",
        }));
        const __VLS_194 = __VLS_193({
            label: "操作",
            width: "110",
        }, ...__VLS_functionalComponentArgsRest(__VLS_193));
        __VLS_195.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_195.slots;
            const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
            if (__VLS_ctx.hasPermission('system:user:write')) {
                const __VLS_196 = {}.ElButton;
                /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                // @ts-ignore
                const __VLS_197 = __VLS_asFunctionalComponent(__VLS_196, new __VLS_196({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "primary",
                }));
                const __VLS_198 = __VLS_197({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "primary",
                }, ...__VLS_functionalComponentArgsRest(__VLS_197));
                let __VLS_200;
                let __VLS_201;
                let __VLS_202;
                const __VLS_203 = {
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.loggedIn))
                            return;
                        if (!!(__VLS_ctx.menuView))
                            return;
                        if (!!(__VLS_ctx.activeView === 'customers'))
                            return;
                        if (!(__VLS_ctx.activeView === 'users'))
                            return;
                        if (!(__VLS_ctx.hasPermission('system:user:write')))
                            return;
                        __VLS_ctx.toggleUser(scope.row);
                    }
                };
                __VLS_199.slots.default;
                (scope.row.enabled ? '禁用' : '启用');
                var __VLS_199;
            }
        }
        var __VLS_195;
        var __VLS_171;
    }
    else if (__VLS_ctx.activeView === 'roles') {
        const __VLS_204 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
            data: (__VLS_ctx.roles),
            stripe: true,
        }));
        const __VLS_206 = __VLS_205({
            data: (__VLS_ctx.roles),
            stripe: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_205));
        __VLS_207.slots.default;
        const __VLS_208 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({
            prop: "id",
            label: "编号",
            width: "90",
        }));
        const __VLS_210 = __VLS_209({
            prop: "id",
            label: "编号",
            width: "90",
        }, ...__VLS_functionalComponentArgsRest(__VLS_209));
        const __VLS_212 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
            prop: "roleCode",
            label: "角色编码",
        }));
        const __VLS_214 = __VLS_213({
            prop: "roleCode",
            label: "角色编码",
        }, ...__VLS_functionalComponentArgsRest(__VLS_213));
        const __VLS_216 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
            prop: "roleName",
            label: "角色名称",
        }));
        const __VLS_218 = __VLS_217({
            prop: "roleName",
            label: "角色名称",
        }, ...__VLS_functionalComponentArgsRest(__VLS_217));
        const __VLS_220 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
            label: "状态",
        }));
        const __VLS_222 = __VLS_221({
            label: "状态",
        }, ...__VLS_functionalComponentArgsRest(__VLS_221));
        __VLS_223.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_223.slots;
            const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_224 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
                type: (scope.row.enabled ? 'success' : 'info'),
            }));
            const __VLS_226 = __VLS_225({
                type: (scope.row.enabled ? 'success' : 'info'),
            }, ...__VLS_functionalComponentArgsRest(__VLS_225));
            __VLS_227.slots.default;
            (scope.row.enabled ? '启用' : '禁用');
            var __VLS_227;
        }
        var __VLS_223;
        const __VLS_228 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
            label: "操作",
            width: "120",
        }));
        const __VLS_230 = __VLS_229({
            label: "操作",
            width: "120",
        }, ...__VLS_functionalComponentArgsRest(__VLS_229));
        __VLS_231.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_231.slots;
            const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
            if (__VLS_ctx.hasPermission('system:user:write')) {
                const __VLS_232 = {}.ElButton;
                /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                // @ts-ignore
                const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "primary",
                }));
                const __VLS_234 = __VLS_233({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "primary",
                }, ...__VLS_functionalComponentArgsRest(__VLS_233));
                let __VLS_236;
                let __VLS_237;
                let __VLS_238;
                const __VLS_239 = {
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.loggedIn))
                            return;
                        if (!!(__VLS_ctx.menuView))
                            return;
                        if (!!(__VLS_ctx.activeView === 'customers'))
                            return;
                        if (!!(__VLS_ctx.activeView === 'users'))
                            return;
                        if (!(__VLS_ctx.activeView === 'roles'))
                            return;
                        if (!(__VLS_ctx.hasPermission('system:user:write')))
                            return;
                        __VLS_ctx.openPermissionDialog(scope.row);
                    }
                };
                __VLS_235.slots.default;
                var __VLS_235;
            }
        }
        var __VLS_231;
        var __VLS_207;
    }
    else {
        const __VLS_240 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
            data: (__VLS_ctx.logs),
            stripe: true,
        }));
        const __VLS_242 = __VLS_241({
            data: (__VLS_ctx.logs),
            stripe: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_241));
        __VLS_243.slots.default;
        const __VLS_244 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
            prop: "createdAt",
            label: "时间",
            width: "190",
        }));
        const __VLS_246 = __VLS_245({
            prop: "createdAt",
            label: "时间",
            width: "190",
        }, ...__VLS_functionalComponentArgsRest(__VLS_245));
        const __VLS_248 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
            prop: "username",
            label: "用户",
            width: "100",
        }));
        const __VLS_250 = __VLS_249({
            prop: "username",
            label: "用户",
            width: "100",
        }, ...__VLS_functionalComponentArgsRest(__VLS_249));
        const __VLS_252 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
            prop: "action",
            label: "动作",
            width: "100",
        }));
        const __VLS_254 = __VLS_253({
            prop: "action",
            label: "动作",
            width: "100",
        }, ...__VLS_functionalComponentArgsRest(__VLS_253));
        const __VLS_256 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_257 = __VLS_asFunctionalComponent(__VLS_256, new __VLS_256({
            prop: "resource",
            label: "资源",
            width: "120",
        }));
        const __VLS_258 = __VLS_257({
            prop: "resource",
            label: "资源",
            width: "120",
        }, ...__VLS_functionalComponentArgsRest(__VLS_257));
        const __VLS_260 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_261 = __VLS_asFunctionalComponent(__VLS_260, new __VLS_260({
            prop: "detail",
            label: "详情",
        }));
        const __VLS_262 = __VLS_261({
            prop: "detail",
            label: "详情",
        }, ...__VLS_functionalComponentArgsRest(__VLS_261));
        var __VLS_243;
    }
    var __VLS_23;
    var __VLS_19;
    const __VLS_264 = {}.ElDialog;
    /** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
    // @ts-ignore
    const __VLS_265 = __VLS_asFunctionalComponent(__VLS_264, new __VLS_264({
        modelValue: (__VLS_ctx.dialogVisible),
        title: (__VLS_ctx.editingId ? '编辑客户' : '新增客户'),
        width: "460px",
    }));
    const __VLS_266 = __VLS_265({
        modelValue: (__VLS_ctx.dialogVisible),
        title: (__VLS_ctx.editingId ? '编辑客户' : '新增客户'),
        width: "460px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_265));
    __VLS_267.slots.default;
    const __VLS_268 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
        labelWidth: "80px",
    }));
    const __VLS_270 = __VLS_269({
        labelWidth: "80px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_269));
    __VLS_271.slots.default;
    const __VLS_272 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_273 = __VLS_asFunctionalComponent(__VLS_272, new __VLS_272({
        label: "客户名称",
    }));
    const __VLS_274 = __VLS_273({
        label: "客户名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_273));
    __VLS_275.slots.default;
    const __VLS_276 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_277 = __VLS_asFunctionalComponent(__VLS_276, new __VLS_276({
        modelValue: (__VLS_ctx.form.name),
    }));
    const __VLS_278 = __VLS_277({
        modelValue: (__VLS_ctx.form.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_277));
    var __VLS_275;
    const __VLS_280 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_281 = __VLS_asFunctionalComponent(__VLS_280, new __VLS_280({
        label: "联系人",
    }));
    const __VLS_282 = __VLS_281({
        label: "联系人",
    }, ...__VLS_functionalComponentArgsRest(__VLS_281));
    __VLS_283.slots.default;
    const __VLS_284 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_285 = __VLS_asFunctionalComponent(__VLS_284, new __VLS_284({
        modelValue: (__VLS_ctx.form.contact),
    }));
    const __VLS_286 = __VLS_285({
        modelValue: (__VLS_ctx.form.contact),
    }, ...__VLS_functionalComponentArgsRest(__VLS_285));
    var __VLS_283;
    const __VLS_288 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_289 = __VLS_asFunctionalComponent(__VLS_288, new __VLS_288({
        label: "手机号",
    }));
    const __VLS_290 = __VLS_289({
        label: "手机号",
    }, ...__VLS_functionalComponentArgsRest(__VLS_289));
    __VLS_291.slots.default;
    const __VLS_292 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_293 = __VLS_asFunctionalComponent(__VLS_292, new __VLS_292({
        modelValue: (__VLS_ctx.form.phone),
    }));
    const __VLS_294 = __VLS_293({
        modelValue: (__VLS_ctx.form.phone),
    }, ...__VLS_functionalComponentArgsRest(__VLS_293));
    var __VLS_291;
    const __VLS_296 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_297 = __VLS_asFunctionalComponent(__VLS_296, new __VLS_296({
        label: "状态",
    }));
    const __VLS_298 = __VLS_297({
        label: "状态",
    }, ...__VLS_functionalComponentArgsRest(__VLS_297));
    __VLS_299.slots.default;
    const __VLS_300 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_301 = __VLS_asFunctionalComponent(__VLS_300, new __VLS_300({
        modelValue: (__VLS_ctx.form.status),
        ...{ style: {} },
    }));
    const __VLS_302 = __VLS_301({
        modelValue: (__VLS_ctx.form.status),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_301));
    __VLS_303.slots.default;
    const __VLS_304 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_305 = __VLS_asFunctionalComponent(__VLS_304, new __VLS_304({
        label: "有效",
        value: "ACTIVE",
    }));
    const __VLS_306 = __VLS_305({
        label: "有效",
        value: "ACTIVE",
    }, ...__VLS_functionalComponentArgsRest(__VLS_305));
    const __VLS_308 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_309 = __VLS_asFunctionalComponent(__VLS_308, new __VLS_308({
        label: "停用",
        value: "INACTIVE",
    }));
    const __VLS_310 = __VLS_309({
        label: "停用",
        value: "INACTIVE",
    }, ...__VLS_functionalComponentArgsRest(__VLS_309));
    var __VLS_303;
    var __VLS_299;
    var __VLS_271;
    {
        const { footer: __VLS_thisSlot } = __VLS_267.slots;
        const __VLS_312 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_313 = __VLS_asFunctionalComponent(__VLS_312, new __VLS_312({
            ...{ 'onClick': {} },
        }));
        const __VLS_314 = __VLS_313({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_313));
        let __VLS_316;
        let __VLS_317;
        let __VLS_318;
        const __VLS_319 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.loggedIn))
                    return;
                __VLS_ctx.dialogVisible = false;
            }
        };
        __VLS_315.slots.default;
        var __VLS_315;
        const __VLS_320 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_321 = __VLS_asFunctionalComponent(__VLS_320, new __VLS_320({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_322 = __VLS_321({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_321));
        let __VLS_324;
        let __VLS_325;
        let __VLS_326;
        const __VLS_327 = {
            onClick: (__VLS_ctx.saveCustomer)
        };
        __VLS_323.slots.default;
        var __VLS_323;
    }
    var __VLS_267;
    const __VLS_328 = {}.ElDialog;
    /** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
    // @ts-ignore
    const __VLS_329 = __VLS_asFunctionalComponent(__VLS_328, new __VLS_328({
        modelValue: (__VLS_ctx.userDialogVisible),
        title: "新增用户",
        width: "400px",
    }));
    const __VLS_330 = __VLS_329({
        modelValue: (__VLS_ctx.userDialogVisible),
        title: "新增用户",
        width: "400px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_329));
    __VLS_331.slots.default;
    const __VLS_332 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_333 = __VLS_asFunctionalComponent(__VLS_332, new __VLS_332({
        labelWidth: "70px",
    }));
    const __VLS_334 = __VLS_333({
        labelWidth: "70px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_333));
    __VLS_335.slots.default;
    const __VLS_336 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_337 = __VLS_asFunctionalComponent(__VLS_336, new __VLS_336({
        label: "用户名",
    }));
    const __VLS_338 = __VLS_337({
        label: "用户名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_337));
    __VLS_339.slots.default;
    const __VLS_340 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_341 = __VLS_asFunctionalComponent(__VLS_340, new __VLS_340({
        modelValue: (__VLS_ctx.newUser.username),
    }));
    const __VLS_342 = __VLS_341({
        modelValue: (__VLS_ctx.newUser.username),
    }, ...__VLS_functionalComponentArgsRest(__VLS_341));
    var __VLS_339;
    const __VLS_344 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_345 = __VLS_asFunctionalComponent(__VLS_344, new __VLS_344({
        label: "密码",
    }));
    const __VLS_346 = __VLS_345({
        label: "密码",
    }, ...__VLS_functionalComponentArgsRest(__VLS_345));
    __VLS_347.slots.default;
    const __VLS_348 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_349 = __VLS_asFunctionalComponent(__VLS_348, new __VLS_348({
        modelValue: (__VLS_ctx.newUser.password),
        type: "password",
        showPassword: true,
    }));
    const __VLS_350 = __VLS_349({
        modelValue: (__VLS_ctx.newUser.password),
        type: "password",
        showPassword: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_349));
    var __VLS_347;
    var __VLS_335;
    {
        const { footer: __VLS_thisSlot } = __VLS_331.slots;
        const __VLS_352 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_353 = __VLS_asFunctionalComponent(__VLS_352, new __VLS_352({
            ...{ 'onClick': {} },
        }));
        const __VLS_354 = __VLS_353({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_353));
        let __VLS_356;
        let __VLS_357;
        let __VLS_358;
        const __VLS_359 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.loggedIn))
                    return;
                __VLS_ctx.userDialogVisible = false;
            }
        };
        __VLS_355.slots.default;
        var __VLS_355;
        const __VLS_360 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_361 = __VLS_asFunctionalComponent(__VLS_360, new __VLS_360({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_362 = __VLS_361({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_361));
        let __VLS_364;
        let __VLS_365;
        let __VLS_366;
        const __VLS_367 = {
            onClick: (__VLS_ctx.createUser)
        };
        __VLS_363.slots.default;
        var __VLS_363;
    }
    var __VLS_331;
    const __VLS_368 = {}.ElDialog;
    /** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
    // @ts-ignore
    const __VLS_369 = __VLS_asFunctionalComponent(__VLS_368, new __VLS_368({
        modelValue: (__VLS_ctx.roleDialogVisible),
        title: "新增角色",
        width: "400px",
    }));
    const __VLS_370 = __VLS_369({
        modelValue: (__VLS_ctx.roleDialogVisible),
        title: "新增角色",
        width: "400px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_369));
    __VLS_371.slots.default;
    const __VLS_372 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_373 = __VLS_asFunctionalComponent(__VLS_372, new __VLS_372({
        labelWidth: "80px",
    }));
    const __VLS_374 = __VLS_373({
        labelWidth: "80px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_373));
    __VLS_375.slots.default;
    const __VLS_376 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_377 = __VLS_asFunctionalComponent(__VLS_376, new __VLS_376({
        label: "角色编码",
    }));
    const __VLS_378 = __VLS_377({
        label: "角色编码",
    }, ...__VLS_functionalComponentArgsRest(__VLS_377));
    __VLS_379.slots.default;
    const __VLS_380 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_381 = __VLS_asFunctionalComponent(__VLS_380, new __VLS_380({
        modelValue: (__VLS_ctx.newRole.roleCode),
    }));
    const __VLS_382 = __VLS_381({
        modelValue: (__VLS_ctx.newRole.roleCode),
    }, ...__VLS_functionalComponentArgsRest(__VLS_381));
    var __VLS_379;
    const __VLS_384 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_385 = __VLS_asFunctionalComponent(__VLS_384, new __VLS_384({
        label: "角色名称",
    }));
    const __VLS_386 = __VLS_385({
        label: "角色名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_385));
    __VLS_387.slots.default;
    const __VLS_388 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_389 = __VLS_asFunctionalComponent(__VLS_388, new __VLS_388({
        modelValue: (__VLS_ctx.newRole.roleName),
    }));
    const __VLS_390 = __VLS_389({
        modelValue: (__VLS_ctx.newRole.roleName),
    }, ...__VLS_functionalComponentArgsRest(__VLS_389));
    var __VLS_387;
    var __VLS_375;
    {
        const { footer: __VLS_thisSlot } = __VLS_371.slots;
        const __VLS_392 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_393 = __VLS_asFunctionalComponent(__VLS_392, new __VLS_392({
            ...{ 'onClick': {} },
        }));
        const __VLS_394 = __VLS_393({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_393));
        let __VLS_396;
        let __VLS_397;
        let __VLS_398;
        const __VLS_399 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.loggedIn))
                    return;
                __VLS_ctx.roleDialogVisible = false;
            }
        };
        __VLS_395.slots.default;
        var __VLS_395;
        const __VLS_400 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_401 = __VLS_asFunctionalComponent(__VLS_400, new __VLS_400({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_402 = __VLS_401({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_401));
        let __VLS_404;
        let __VLS_405;
        let __VLS_406;
        const __VLS_407 = {
            onClick: (__VLS_ctx.createRole)
        };
        __VLS_403.slots.default;
        var __VLS_403;
    }
    var __VLS_371;
    const __VLS_408 = {}.ElDialog;
    /** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
    // @ts-ignore
    const __VLS_409 = __VLS_asFunctionalComponent(__VLS_408, new __VLS_408({
        modelValue: (__VLS_ctx.permissionDialogVisible),
        title: (`菜单授权 - ${__VLS_ctx.permissionRole?.roleName ?? ''}`),
        width: "460px",
    }));
    const __VLS_410 = __VLS_409({
        modelValue: (__VLS_ctx.permissionDialogVisible),
        title: (`菜单授权 - ${__VLS_ctx.permissionRole?.roleName ?? ''}`),
        width: "460px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_409));
    __VLS_411.slots.default;
    const __VLS_412 = {}.ElCheckboxGroup;
    /** @type {[typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, ]} */ ;
    // @ts-ignore
    const __VLS_413 = __VLS_asFunctionalComponent(__VLS_412, new __VLS_412({
        modelValue: (__VLS_ctx.selectedMenuIds),
    }));
    const __VLS_414 = __VLS_413({
        modelValue: (__VLS_ctx.selectedMenuIds),
    }, ...__VLS_functionalComponentArgsRest(__VLS_413));
    __VLS_415.slots.default;
    for (const [menu] of __VLS_getVForSourceType((__VLS_ctx.menus))) {
        const __VLS_416 = {}.ElCheckbox;
        /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
        // @ts-ignore
        const __VLS_417 = __VLS_asFunctionalComponent(__VLS_416, new __VLS_416({
            key: (menu.id),
            label: (menu.id),
        }));
        const __VLS_418 = __VLS_417({
            key: (menu.id),
            label: (menu.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_417));
        __VLS_419.slots.default;
        (menu.menuName);
        if (menu.permission) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "permission" },
            });
            (menu.permission);
        }
        var __VLS_419;
    }
    var __VLS_415;
    {
        const { footer: __VLS_thisSlot } = __VLS_411.slots;
        const __VLS_420 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_421 = __VLS_asFunctionalComponent(__VLS_420, new __VLS_420({
            ...{ 'onClick': {} },
        }));
        const __VLS_422 = __VLS_421({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_421));
        let __VLS_424;
        let __VLS_425;
        let __VLS_426;
        const __VLS_427 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.loggedIn))
                    return;
                __VLS_ctx.permissionDialogVisible = false;
            }
        };
        __VLS_423.slots.default;
        var __VLS_423;
        const __VLS_428 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_429 = __VLS_asFunctionalComponent(__VLS_428, new __VLS_428({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_430 = __VLS_429({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_429));
        let __VLS_432;
        let __VLS_433;
        let __VLS_434;
        const __VLS_435 = {
            onClick: (__VLS_ctx.savePermission)
        };
        __VLS_431.slots.default;
        var __VLS_431;
    }
    var __VLS_411;
    const __VLS_436 = {}.ElDialog;
    /** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
    // @ts-ignore
    const __VLS_437 = __VLS_asFunctionalComponent(__VLS_436, new __VLS_436({
        modelValue: (__VLS_ctx.menuDialogVisible),
        title: "新增菜单",
        width: "420px",
    }));
    const __VLS_438 = __VLS_437({
        modelValue: (__VLS_ctx.menuDialogVisible),
        title: "新增菜单",
        width: "420px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_437));
    __VLS_439.slots.default;
    const __VLS_440 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_441 = __VLS_asFunctionalComponent(__VLS_440, new __VLS_440({
        labelWidth: "90px",
    }));
    const __VLS_442 = __VLS_441({
        labelWidth: "90px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_441));
    __VLS_443.slots.default;
    const __VLS_444 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_445 = __VLS_asFunctionalComponent(__VLS_444, new __VLS_444({
        label: "菜单名称",
    }));
    const __VLS_446 = __VLS_445({
        label: "菜单名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_445));
    __VLS_447.slots.default;
    const __VLS_448 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_449 = __VLS_asFunctionalComponent(__VLS_448, new __VLS_448({
        modelValue: (__VLS_ctx.newMenu.menuName),
    }));
    const __VLS_450 = __VLS_449({
        modelValue: (__VLS_ctx.newMenu.menuName),
    }, ...__VLS_functionalComponentArgsRest(__VLS_449));
    var __VLS_447;
    const __VLS_452 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_453 = __VLS_asFunctionalComponent(__VLS_452, new __VLS_452({
        label: "权限标识",
    }));
    const __VLS_454 = __VLS_453({
        label: "权限标识",
    }, ...__VLS_functionalComponentArgsRest(__VLS_453));
    __VLS_455.slots.default;
    const __VLS_456 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_457 = __VLS_asFunctionalComponent(__VLS_456, new __VLS_456({
        modelValue: (__VLS_ctx.newMenu.permission),
        placeholder: "例如 customer:read",
    }));
    const __VLS_458 = __VLS_457({
        modelValue: (__VLS_ctx.newMenu.permission),
        placeholder: "例如 customer:read",
    }, ...__VLS_functionalComponentArgsRest(__VLS_457));
    var __VLS_455;
    const __VLS_460 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_461 = __VLS_asFunctionalComponent(__VLS_460, new __VLS_460({
        label: "菜单类型",
    }));
    const __VLS_462 = __VLS_461({
        label: "菜单类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_461));
    __VLS_463.slots.default;
    const __VLS_464 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_465 = __VLS_asFunctionalComponent(__VLS_464, new __VLS_464({
        modelValue: (__VLS_ctx.newMenu.menuType),
        ...{ style: {} },
    }));
    const __VLS_466 = __VLS_465({
        modelValue: (__VLS_ctx.newMenu.menuType),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_465));
    __VLS_467.slots.default;
    const __VLS_468 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_469 = __VLS_asFunctionalComponent(__VLS_468, new __VLS_468({
        label: "菜单",
        value: "M",
    }));
    const __VLS_470 = __VLS_469({
        label: "菜单",
        value: "M",
    }, ...__VLS_functionalComponentArgsRest(__VLS_469));
    const __VLS_472 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_473 = __VLS_asFunctionalComponent(__VLS_472, new __VLS_472({
        label: "按钮",
        value: "B",
    }));
    const __VLS_474 = __VLS_473({
        label: "按钮",
        value: "B",
    }, ...__VLS_functionalComponentArgsRest(__VLS_473));
    var __VLS_467;
    var __VLS_463;
    var __VLS_443;
    {
        const { footer: __VLS_thisSlot } = __VLS_439.slots;
        const __VLS_476 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_477 = __VLS_asFunctionalComponent(__VLS_476, new __VLS_476({
            ...{ 'onClick': {} },
        }));
        const __VLS_478 = __VLS_477({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_477));
        let __VLS_480;
        let __VLS_481;
        let __VLS_482;
        const __VLS_483 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.loggedIn))
                    return;
                __VLS_ctx.menuDialogVisible = false;
            }
        };
        __VLS_479.slots.default;
        var __VLS_479;
        const __VLS_484 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_485 = __VLS_asFunctionalComponent(__VLS_484, new __VLS_484({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_486 = __VLS_485({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_485));
        let __VLS_488;
        let __VLS_489;
        let __VLS_490;
        const __VLS_491 = {
            onClick: (__VLS_ctx.createMenu)
        };
        __VLS_487.slots.default;
        var __VLS_487;
    }
    var __VLS_439;
    var __VLS_3;
}
else {
    const __VLS_492 = {}.ElMain;
    /** @type {[typeof __VLS_components.ElMain, typeof __VLS_components.elMain, typeof __VLS_components.ElMain, typeof __VLS_components.elMain, ]} */ ;
    // @ts-ignore
    const __VLS_493 = __VLS_asFunctionalComponent(__VLS_492, new __VLS_492({
        ...{ class: "login-page" },
    }));
    const __VLS_494 = __VLS_493({
        ...{ class: "login-page" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_493));
    __VLS_495.slots.default;
    const __VLS_496 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_497 = __VLS_asFunctionalComponent(__VLS_496, new __VLS_496({
        ...{ class: "login-card" },
    }));
    const __VLS_498 = __VLS_497({
        ...{ class: "login-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_497));
    __VLS_499.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    const __VLS_500 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_501 = __VLS_asFunctionalComponent(__VLS_500, new __VLS_500({
        ...{ 'onSubmit': {} },
    }));
    const __VLS_502 = __VLS_501({
        ...{ 'onSubmit': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_501));
    let __VLS_504;
    let __VLS_505;
    let __VLS_506;
    const __VLS_507 = {
        onSubmit: (__VLS_ctx.login)
    };
    __VLS_503.slots.default;
    const __VLS_508 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_509 = __VLS_asFunctionalComponent(__VLS_508, new __VLS_508({}));
    const __VLS_510 = __VLS_509({}, ...__VLS_functionalComponentArgsRest(__VLS_509));
    __VLS_511.slots.default;
    const __VLS_512 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_513 = __VLS_asFunctionalComponent(__VLS_512, new __VLS_512({
        modelValue: (__VLS_ctx.username),
        placeholder: "用户名",
    }));
    const __VLS_514 = __VLS_513({
        modelValue: (__VLS_ctx.username),
        placeholder: "用户名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_513));
    var __VLS_511;
    const __VLS_516 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_517 = __VLS_asFunctionalComponent(__VLS_516, new __VLS_516({}));
    const __VLS_518 = __VLS_517({}, ...__VLS_functionalComponentArgsRest(__VLS_517));
    __VLS_519.slots.default;
    const __VLS_520 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_521 = __VLS_asFunctionalComponent(__VLS_520, new __VLS_520({
        modelValue: (__VLS_ctx.password),
        type: "password",
        placeholder: "密码",
        showPassword: true,
    }));
    const __VLS_522 = __VLS_521({
        modelValue: (__VLS_ctx.password),
        type: "password",
        placeholder: "密码",
        showPassword: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_521));
    var __VLS_519;
    const __VLS_524 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_525 = __VLS_asFunctionalComponent(__VLS_524, new __VLS_524({
        type: "primary",
        nativeType: "submit",
        ...{ class: "full" },
    }));
    const __VLS_526 = __VLS_525({
        type: "primary",
        nativeType: "submit",
        ...{ class: "full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_525));
    __VLS_527.slots.default;
    var __VLS_527;
    var __VLS_503;
    var __VLS_499;
    var __VLS_495;
}
if (__VLS_ctx.loggedIn && !__VLS_ctx.menuView && __VLS_ctx.activeView === 'users' && __VLS_ctx.hasPermission('system:user:write')) {
    const __VLS_528 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_529 = __VLS_asFunctionalComponent(__VLS_528, new __VLS_528({
        ...{ class: "role-assignment-card" },
    }));
    const __VLS_530 = __VLS_529({
        ...{ class: "role-assignment-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_529));
    __VLS_531.slots.default;
    {
        const { header: __VLS_thisSlot } = __VLS_531.slots;
    }
    const __VLS_532 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_533 = __VLS_asFunctionalComponent(__VLS_532, new __VLS_532({
        inline: true,
    }));
    const __VLS_534 = __VLS_533({
        inline: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_533));
    __VLS_535.slots.default;
    const __VLS_536 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_537 = __VLS_asFunctionalComponent(__VLS_536, new __VLS_536({
        label: "用户",
    }));
    const __VLS_538 = __VLS_537({
        label: "用户",
    }, ...__VLS_functionalComponentArgsRest(__VLS_537));
    __VLS_539.slots.default;
    const __VLS_540 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_541 = __VLS_asFunctionalComponent(__VLS_540, new __VLS_540({
        modelValue: (__VLS_ctx.selectedUserId),
        placeholder: "请选择用户",
        ...{ style: {} },
    }));
    const __VLS_542 = __VLS_541({
        modelValue: (__VLS_ctx.selectedUserId),
        placeholder: "请选择用户",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_541));
    __VLS_543.slots.default;
    for (const [user] of __VLS_getVForSourceType((__VLS_ctx.users))) {
        const __VLS_544 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_545 = __VLS_asFunctionalComponent(__VLS_544, new __VLS_544({
            key: (user.id),
            label: (user.username),
            value: (user.id),
        }));
        const __VLS_546 = __VLS_545({
            key: (user.id),
            label: (user.username),
            value: (user.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_545));
    }
    var __VLS_543;
    var __VLS_539;
    const __VLS_548 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_549 = __VLS_asFunctionalComponent(__VLS_548, new __VLS_548({
        label: "角色",
    }));
    const __VLS_550 = __VLS_549({
        label: "角色",
    }, ...__VLS_functionalComponentArgsRest(__VLS_549));
    __VLS_551.slots.default;
    const __VLS_552 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_553 = __VLS_asFunctionalComponent(__VLS_552, new __VLS_552({
        modelValue: (__VLS_ctx.selectedRoleCode),
        placeholder: "请选择角色",
        ...{ style: {} },
    }));
    const __VLS_554 = __VLS_553({
        modelValue: (__VLS_ctx.selectedRoleCode),
        placeholder: "请选择角色",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_553));
    __VLS_555.slots.default;
    for (const [role] of __VLS_getVForSourceType((__VLS_ctx.roles))) {
        const __VLS_556 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_557 = __VLS_asFunctionalComponent(__VLS_556, new __VLS_556({
            key: (role.roleCode),
            label: (role.roleName),
            value: (role.roleCode),
        }));
        const __VLS_558 = __VLS_557({
            key: (role.roleCode),
            label: (role.roleName),
            value: (role.roleCode),
        }, ...__VLS_functionalComponentArgsRest(__VLS_557));
    }
    var __VLS_555;
    var __VLS_551;
    const __VLS_560 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_561 = __VLS_asFunctionalComponent(__VLS_560, new __VLS_560({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (__VLS_ctx.selectedUserId === null || !__VLS_ctx.selectedRoleCode),
    }));
    const __VLS_562 = __VLS_561({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (__VLS_ctx.selectedUserId === null || !__VLS_ctx.selectedRoleCode),
    }, ...__VLS_functionalComponentArgsRest(__VLS_561));
    let __VLS_564;
    let __VLS_565;
    let __VLS_566;
    const __VLS_567 = {
        onClick: (__VLS_ctx.saveSelectedUserRole)
    };
    __VLS_563.slots.default;
    var __VLS_563;
    var __VLS_535;
    var __VLS_531;
}
/** @type {__VLS_StyleScopedClasses['layout']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['permission']} */ ;
/** @type {__VLS_StyleScopedClasses['login-page']} */ ;
/** @type {__VLS_StyleScopedClasses['login-card']} */ ;
/** @type {__VLS_StyleScopedClasses['full']} */ ;
/** @type {__VLS_StyleScopedClasses['role-assignment-card']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            loggedIn: loggedIn,
            username: username,
            password: password,
            customers: customers,
            users: users,
            roles: roles,
            logs: logs,
            activeView: activeView,
            menuView: menuView,
            newUser: newUser,
            userDialogVisible: userDialogVisible,
            roleDialogVisible: roleDialogVisible,
            newRole: newRole,
            selectedUserId: selectedUserId,
            selectedRoleCode: selectedRoleCode,
            newMenu: newMenu,
            menuDialogVisible: menuDialogVisible,
            menus: menus,
            selectedMenuIds: selectedMenuIds,
            permissionRole: permissionRole,
            permissionDialogVisible: permissionDialogVisible,
            loading: loading,
            dialogVisible: dialogVisible,
            editingId: editingId,
            form: form,
            login: login,
            hasPermission: hasPermission,
            loadUsers: loadUsers,
            loadRoles: loadRoles,
            loadLogs: loadLogs,
            createMenu: createMenu,
            loadMenus: loadMenus,
            createRole: createRole,
            openPermissionDialog: openPermissionDialog,
            savePermission: savePermission,
            createUser: createUser,
            toggleUser: toggleUser,
            saveSelectedUserRole: saveSelectedUserRole,
            openCustomerForm: openCustomerForm,
            saveCustomer: saveCustomer,
            removeCustomer: removeCustomer,
            logout: logout,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
