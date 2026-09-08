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
    var __VLS_4 = {};
    __VLS_3.slots.default;
    const __VLS_5 = {}.ElHeader;
    /** @type {[typeof __VLS_components.ElHeader, typeof __VLS_components.elHeader, typeof __VLS_components.ElHeader, typeof __VLS_components.elHeader, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({}));
    const __VLS_7 = __VLS_6({}, ...__VLS_functionalComponentArgsRest(__VLS_6));
    __VLS_8.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "brand" },
    });
    const __VLS_9 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
        ...{ 'onClick': {} },
        link: true,
    }));
    const __VLS_11 = __VLS_10({
        ...{ 'onClick': {} },
        link: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_10));
    let __VLS_13;
    let __VLS_14;
    let __VLS_15;
    const __VLS_16 = {
        onClick: (__VLS_ctx.logout)
    };
    __VLS_12.slots.default;
    var __VLS_12;
    var __VLS_8;
    const __VLS_17 = {}.ElMain;
    /** @type {[typeof __VLS_components.ElMain, typeof __VLS_components.elMain, typeof __VLS_components.ElMain, typeof __VLS_components.elMain, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({}));
    const __VLS_19 = __VLS_18({}, ...__VLS_functionalComponentArgsRest(__VLS_18));
    __VLS_20.slots.default;
    const __VLS_21 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({}));
    const __VLS_23 = __VLS_22({}, ...__VLS_functionalComponentArgsRest(__VLS_22));
    __VLS_24.slots.default;
    {
        const { header: __VLS_thisSlot } = __VLS_24.slots;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "card-header" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({});
        const __VLS_25 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
            ...{ 'onClick': {} },
            type: (__VLS_ctx.activeView === 'customers' && !__VLS_ctx.menuView ? 'primary' : 'default'),
        }));
        const __VLS_27 = __VLS_26({
            ...{ 'onClick': {} },
            type: (__VLS_ctx.activeView === 'customers' && !__VLS_ctx.menuView ? 'primary' : 'default'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_26));
        let __VLS_29;
        let __VLS_30;
        let __VLS_31;
        const __VLS_32 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.loggedIn))
                    return;
                __VLS_ctx.menuView = false;
                __VLS_ctx.activeView = 'customers';
            }
        };
        __VLS_28.slots.default;
        var __VLS_28;
        if (__VLS_ctx.hasPermission('system:user:read')) {
            const __VLS_33 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
                ...{ 'onClick': {} },
                type: (__VLS_ctx.activeView === 'users' ? 'primary' : 'default'),
            }));
            const __VLS_35 = __VLS_34({
                ...{ 'onClick': {} },
                type: (__VLS_ctx.activeView === 'users' ? 'primary' : 'default'),
            }, ...__VLS_functionalComponentArgsRest(__VLS_34));
            let __VLS_37;
            let __VLS_38;
            let __VLS_39;
            const __VLS_40 = {
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
            __VLS_36.slots.default;
            var __VLS_36;
        }
        if (__VLS_ctx.hasPermission('system:user:read')) {
            const __VLS_41 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
                ...{ 'onClick': {} },
                type: (__VLS_ctx.activeView === 'roles' ? 'primary' : 'default'),
            }));
            const __VLS_43 = __VLS_42({
                ...{ 'onClick': {} },
                type: (__VLS_ctx.activeView === 'roles' ? 'primary' : 'default'),
            }, ...__VLS_functionalComponentArgsRest(__VLS_42));
            let __VLS_45;
            let __VLS_46;
            let __VLS_47;
            const __VLS_48 = {
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
            __VLS_44.slots.default;
            var __VLS_44;
        }
        if (__VLS_ctx.hasPermission('system:user:read')) {
            const __VLS_49 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_50 = __VLS_asFunctionalComponent(__VLS_49, new __VLS_49({
                ...{ 'onClick': {} },
                type: (__VLS_ctx.activeView === 'logs' ? 'primary' : 'default'),
            }));
            const __VLS_51 = __VLS_50({
                ...{ 'onClick': {} },
                type: (__VLS_ctx.activeView === 'logs' ? 'primary' : 'default'),
            }, ...__VLS_functionalComponentArgsRest(__VLS_50));
            let __VLS_53;
            let __VLS_54;
            let __VLS_55;
            const __VLS_56 = {
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
            __VLS_52.slots.default;
            var __VLS_52;
        }
        if (__VLS_ctx.hasPermission('system:user:read')) {
            const __VLS_57 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
                ...{ 'onClick': {} },
                type: (__VLS_ctx.menuView ? 'primary' : 'default'),
            }));
            const __VLS_59 = __VLS_58({
                ...{ 'onClick': {} },
                type: (__VLS_ctx.menuView ? 'primary' : 'default'),
            }, ...__VLS_functionalComponentArgsRest(__VLS_58));
            let __VLS_61;
            let __VLS_62;
            let __VLS_63;
            const __VLS_64 = {
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
            __VLS_60.slots.default;
            var __VLS_60;
        }
        if (!__VLS_ctx.menuView && __VLS_ctx.activeView === 'customers' && __VLS_ctx.hasPermission('customer:write')) {
            const __VLS_65 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_66 = __VLS_asFunctionalComponent(__VLS_65, new __VLS_65({
                ...{ 'onClick': {} },
                type: "primary",
            }));
            const __VLS_67 = __VLS_66({
                ...{ 'onClick': {} },
                type: "primary",
            }, ...__VLS_functionalComponentArgsRest(__VLS_66));
            let __VLS_69;
            let __VLS_70;
            let __VLS_71;
            const __VLS_72 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.loggedIn))
                        return;
                    if (!(!__VLS_ctx.menuView && __VLS_ctx.activeView === 'customers' && __VLS_ctx.hasPermission('customer:write')))
                        return;
                    __VLS_ctx.openCustomerForm();
                }
            };
            __VLS_68.slots.default;
            var __VLS_68;
        }
        if (!__VLS_ctx.menuView && __VLS_ctx.activeView === 'users' && __VLS_ctx.hasPermission('system:user:write')) {
            const __VLS_73 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_74 = __VLS_asFunctionalComponent(__VLS_73, new __VLS_73({
                ...{ 'onClick': {} },
                type: "primary",
            }));
            const __VLS_75 = __VLS_74({
                ...{ 'onClick': {} },
                type: "primary",
            }, ...__VLS_functionalComponentArgsRest(__VLS_74));
            let __VLS_77;
            let __VLS_78;
            let __VLS_79;
            const __VLS_80 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.loggedIn))
                        return;
                    if (!(!__VLS_ctx.menuView && __VLS_ctx.activeView === 'users' && __VLS_ctx.hasPermission('system:user:write')))
                        return;
                    __VLS_ctx.userDialogVisible = true;
                }
            };
            __VLS_76.slots.default;
            var __VLS_76;
        }
        if (!__VLS_ctx.menuView && __VLS_ctx.activeView === 'roles' && __VLS_ctx.hasPermission('system:user:write')) {
            const __VLS_81 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
                ...{ 'onClick': {} },
                type: "primary",
            }));
            const __VLS_83 = __VLS_82({
                ...{ 'onClick': {} },
                type: "primary",
            }, ...__VLS_functionalComponentArgsRest(__VLS_82));
            let __VLS_85;
            let __VLS_86;
            let __VLS_87;
            const __VLS_88 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.loggedIn))
                        return;
                    if (!(!__VLS_ctx.menuView && __VLS_ctx.activeView === 'roles' && __VLS_ctx.hasPermission('system:user:write')))
                        return;
                    __VLS_ctx.roleDialogVisible = true;
                }
            };
            __VLS_84.slots.default;
            var __VLS_84;
        }
        if (__VLS_ctx.menuView && __VLS_ctx.hasPermission('system:user:write')) {
            const __VLS_89 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
                ...{ 'onClick': {} },
                type: "primary",
            }));
            const __VLS_91 = __VLS_90({
                ...{ 'onClick': {} },
                type: "primary",
            }, ...__VLS_functionalComponentArgsRest(__VLS_90));
            let __VLS_93;
            let __VLS_94;
            let __VLS_95;
            const __VLS_96 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.loggedIn))
                        return;
                    if (!(__VLS_ctx.menuView && __VLS_ctx.hasPermission('system:user:write')))
                        return;
                    __VLS_ctx.menuDialogVisible = true;
                }
            };
            __VLS_92.slots.default;
            var __VLS_92;
        }
    }
    if (__VLS_ctx.menuView) {
        const __VLS_97 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
            data: (__VLS_ctx.menus),
            stripe: true,
        }));
        const __VLS_99 = __VLS_98({
            data: (__VLS_ctx.menus),
            stripe: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_98));
        __VLS_100.slots.default;
        const __VLS_101 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
            prop: "id",
            label: "编号",
            width: "90",
        }));
        const __VLS_103 = __VLS_102({
            prop: "id",
            label: "编号",
            width: "90",
        }, ...__VLS_functionalComponentArgsRest(__VLS_102));
        const __VLS_105 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
            prop: "menuName",
            label: "菜单名称",
        }));
        const __VLS_107 = __VLS_106({
            prop: "menuName",
            label: "菜单名称",
        }, ...__VLS_functionalComponentArgsRest(__VLS_106));
        const __VLS_109 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
            prop: "permission",
            label: "权限标识",
        }));
        const __VLS_111 = __VLS_110({
            prop: "permission",
            label: "权限标识",
        }, ...__VLS_functionalComponentArgsRest(__VLS_110));
        const __VLS_113 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_114 = __VLS_asFunctionalComponent(__VLS_113, new __VLS_113({
            prop: "menuType",
            label: "类型",
            width: "90",
        }));
        const __VLS_115 = __VLS_114({
            prop: "menuType",
            label: "类型",
            width: "90",
        }, ...__VLS_functionalComponentArgsRest(__VLS_114));
        const __VLS_117 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
            label: "状态",
        }));
        const __VLS_119 = __VLS_118({
            label: "状态",
        }, ...__VLS_functionalComponentArgsRest(__VLS_118));
        __VLS_120.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_120.slots;
            const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_121 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_122 = __VLS_asFunctionalComponent(__VLS_121, new __VLS_121({
                type: "success",
            }));
            const __VLS_123 = __VLS_122({
                type: "success",
            }, ...__VLS_functionalComponentArgsRest(__VLS_122));
            __VLS_124.slots.default;
            (scope.row.enabled ? '启用' : '禁用');
            var __VLS_124;
        }
        var __VLS_120;
        var __VLS_100;
    }
    else if (__VLS_ctx.activeView === 'customers') {
        const __VLS_125 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
            data: (__VLS_ctx.customers),
            stripe: true,
        }));
        const __VLS_127 = __VLS_126({
            data: (__VLS_ctx.customers),
            stripe: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_126));
        __VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
        __VLS_128.slots.default;
        const __VLS_129 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_130 = __VLS_asFunctionalComponent(__VLS_129, new __VLS_129({
            prop: "id",
            label: "编号",
            width: "90",
        }));
        const __VLS_131 = __VLS_130({
            prop: "id",
            label: "编号",
            width: "90",
        }, ...__VLS_functionalComponentArgsRest(__VLS_130));
        const __VLS_133 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_134 = __VLS_asFunctionalComponent(__VLS_133, new __VLS_133({
            prop: "name",
            label: "客户名称",
        }));
        const __VLS_135 = __VLS_134({
            prop: "name",
            label: "客户名称",
        }, ...__VLS_functionalComponentArgsRest(__VLS_134));
        const __VLS_137 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
            prop: "contact",
            label: "联系人",
        }));
        const __VLS_139 = __VLS_138({
            prop: "contact",
            label: "联系人",
        }, ...__VLS_functionalComponentArgsRest(__VLS_138));
        const __VLS_141 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
            prop: "phone",
            label: "联系电话",
        }));
        const __VLS_143 = __VLS_142({
            prop: "phone",
            label: "联系电话",
        }, ...__VLS_functionalComponentArgsRest(__VLS_142));
        const __VLS_145 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
            prop: "status",
            label: "状态",
        }));
        const __VLS_147 = __VLS_146({
            prop: "status",
            label: "状态",
        }, ...__VLS_functionalComponentArgsRest(__VLS_146));
        const __VLS_149 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
            label: "操作",
            width: "150",
        }));
        const __VLS_151 = __VLS_150({
            label: "操作",
            width: "150",
        }, ...__VLS_functionalComponentArgsRest(__VLS_150));
        __VLS_152.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_152.slots;
            const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
            if (__VLS_ctx.hasPermission('customer:write')) {
                const __VLS_153 = {}.ElButton;
                /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                // @ts-ignore
                const __VLS_154 = __VLS_asFunctionalComponent(__VLS_153, new __VLS_153({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "primary",
                }));
                const __VLS_155 = __VLS_154({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "primary",
                }, ...__VLS_functionalComponentArgsRest(__VLS_154));
                let __VLS_157;
                let __VLS_158;
                let __VLS_159;
                const __VLS_160 = {
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
                __VLS_156.slots.default;
                var __VLS_156;
            }
            if (__VLS_ctx.hasPermission('customer:write')) {
                const __VLS_161 = {}.ElButton;
                /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                // @ts-ignore
                const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "danger",
                }));
                const __VLS_163 = __VLS_162({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "danger",
                }, ...__VLS_functionalComponentArgsRest(__VLS_162));
                let __VLS_165;
                let __VLS_166;
                let __VLS_167;
                const __VLS_168 = {
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
                __VLS_164.slots.default;
                var __VLS_164;
            }
        }
        var __VLS_152;
        var __VLS_128;
    }
    else if (__VLS_ctx.activeView === 'users') {
        const __VLS_169 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({
            data: (__VLS_ctx.users),
            stripe: true,
        }));
        const __VLS_171 = __VLS_170({
            data: (__VLS_ctx.users),
            stripe: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_170));
        __VLS_172.slots.default;
        const __VLS_173 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({
            prop: "id",
            label: "编号",
            width: "90",
        }));
        const __VLS_175 = __VLS_174({
            prop: "id",
            label: "编号",
            width: "90",
        }, ...__VLS_functionalComponentArgsRest(__VLS_174));
        const __VLS_177 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_178 = __VLS_asFunctionalComponent(__VLS_177, new __VLS_177({
            prop: "username",
            label: "用户名",
        }));
        const __VLS_179 = __VLS_178({
            prop: "username",
            label: "用户名",
        }, ...__VLS_functionalComponentArgsRest(__VLS_178));
        const __VLS_181 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_182 = __VLS_asFunctionalComponent(__VLS_181, new __VLS_181({
            prop: "roleCode",
            label: "角色",
        }));
        const __VLS_183 = __VLS_182({
            prop: "roleCode",
            label: "角色",
        }, ...__VLS_functionalComponentArgsRest(__VLS_182));
        const __VLS_185 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({
            label: "状态",
        }));
        const __VLS_187 = __VLS_186({
            label: "状态",
        }, ...__VLS_functionalComponentArgsRest(__VLS_186));
        __VLS_188.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_188.slots;
            const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_189 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_190 = __VLS_asFunctionalComponent(__VLS_189, new __VLS_189({
                type: (scope.row.enabled ? 'success' : 'info'),
            }));
            const __VLS_191 = __VLS_190({
                type: (scope.row.enabled ? 'success' : 'info'),
            }, ...__VLS_functionalComponentArgsRest(__VLS_190));
            __VLS_192.slots.default;
            (scope.row.enabled ? '启用' : '禁用');
            var __VLS_192;
        }
        var __VLS_188;
        const __VLS_193 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_194 = __VLS_asFunctionalComponent(__VLS_193, new __VLS_193({
            label: "操作",
            width: "110",
        }));
        const __VLS_195 = __VLS_194({
            label: "操作",
            width: "110",
        }, ...__VLS_functionalComponentArgsRest(__VLS_194));
        __VLS_196.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_196.slots;
            const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
            if (__VLS_ctx.hasPermission('system:user:write')) {
                const __VLS_197 = {}.ElButton;
                /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                // @ts-ignore
                const __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "primary",
                }));
                const __VLS_199 = __VLS_198({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "primary",
                }, ...__VLS_functionalComponentArgsRest(__VLS_198));
                let __VLS_201;
                let __VLS_202;
                let __VLS_203;
                const __VLS_204 = {
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
                __VLS_200.slots.default;
                (scope.row.enabled ? '禁用' : '启用');
                var __VLS_200;
            }
        }
        var __VLS_196;
        var __VLS_172;
    }
    else if (__VLS_ctx.activeView === 'roles') {
        const __VLS_205 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_206 = __VLS_asFunctionalComponent(__VLS_205, new __VLS_205({
            data: (__VLS_ctx.roles),
            stripe: true,
        }));
        const __VLS_207 = __VLS_206({
            data: (__VLS_ctx.roles),
            stripe: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_206));
        __VLS_208.slots.default;
        const __VLS_209 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_210 = __VLS_asFunctionalComponent(__VLS_209, new __VLS_209({
            prop: "id",
            label: "编号",
            width: "90",
        }));
        const __VLS_211 = __VLS_210({
            prop: "id",
            label: "编号",
            width: "90",
        }, ...__VLS_functionalComponentArgsRest(__VLS_210));
        const __VLS_213 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_214 = __VLS_asFunctionalComponent(__VLS_213, new __VLS_213({
            prop: "roleCode",
            label: "角色编码",
        }));
        const __VLS_215 = __VLS_214({
            prop: "roleCode",
            label: "角色编码",
        }, ...__VLS_functionalComponentArgsRest(__VLS_214));
        const __VLS_217 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_218 = __VLS_asFunctionalComponent(__VLS_217, new __VLS_217({
            prop: "roleName",
            label: "角色名称",
        }));
        const __VLS_219 = __VLS_218({
            prop: "roleName",
            label: "角色名称",
        }, ...__VLS_functionalComponentArgsRest(__VLS_218));
        const __VLS_221 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({
            label: "状态",
        }));
        const __VLS_223 = __VLS_222({
            label: "状态",
        }, ...__VLS_functionalComponentArgsRest(__VLS_222));
        __VLS_224.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_224.slots;
            const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_225 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_226 = __VLS_asFunctionalComponent(__VLS_225, new __VLS_225({
                type: (scope.row.enabled ? 'success' : 'info'),
            }));
            const __VLS_227 = __VLS_226({
                type: (scope.row.enabled ? 'success' : 'info'),
            }, ...__VLS_functionalComponentArgsRest(__VLS_226));
            __VLS_228.slots.default;
            (scope.row.enabled ? '启用' : '禁用');
            var __VLS_228;
        }
        var __VLS_224;
        const __VLS_229 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_230 = __VLS_asFunctionalComponent(__VLS_229, new __VLS_229({
            label: "操作",
            width: "120",
        }));
        const __VLS_231 = __VLS_230({
            label: "操作",
            width: "120",
        }, ...__VLS_functionalComponentArgsRest(__VLS_230));
        __VLS_232.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_232.slots;
            const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
            if (__VLS_ctx.hasPermission('system:user:write')) {
                const __VLS_233 = {}.ElButton;
                /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                // @ts-ignore
                const __VLS_234 = __VLS_asFunctionalComponent(__VLS_233, new __VLS_233({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "primary",
                }));
                const __VLS_235 = __VLS_234({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "primary",
                }, ...__VLS_functionalComponentArgsRest(__VLS_234));
                let __VLS_237;
                let __VLS_238;
                let __VLS_239;
                const __VLS_240 = {
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
                __VLS_236.slots.default;
                var __VLS_236;
            }
        }
        var __VLS_232;
        var __VLS_208;
    }
    else {
        const __VLS_241 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_242 = __VLS_asFunctionalComponent(__VLS_241, new __VLS_241({
            data: (__VLS_ctx.logs),
            stripe: true,
        }));
        const __VLS_243 = __VLS_242({
            data: (__VLS_ctx.logs),
            stripe: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_242));
        __VLS_244.slots.default;
        const __VLS_245 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_246 = __VLS_asFunctionalComponent(__VLS_245, new __VLS_245({
            prop: "createdAt",
            label: "时间",
            width: "190",
        }));
        const __VLS_247 = __VLS_246({
            prop: "createdAt",
            label: "时间",
            width: "190",
        }, ...__VLS_functionalComponentArgsRest(__VLS_246));
        const __VLS_249 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_250 = __VLS_asFunctionalComponent(__VLS_249, new __VLS_249({
            prop: "username",
            label: "用户",
            width: "100",
        }));
        const __VLS_251 = __VLS_250({
            prop: "username",
            label: "用户",
            width: "100",
        }, ...__VLS_functionalComponentArgsRest(__VLS_250));
        const __VLS_253 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_254 = __VLS_asFunctionalComponent(__VLS_253, new __VLS_253({
            prop: "action",
            label: "动作",
            width: "100",
        }));
        const __VLS_255 = __VLS_254({
            prop: "action",
            label: "动作",
            width: "100",
        }, ...__VLS_functionalComponentArgsRest(__VLS_254));
        const __VLS_257 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_258 = __VLS_asFunctionalComponent(__VLS_257, new __VLS_257({
            prop: "resource",
            label: "资源",
            width: "120",
        }));
        const __VLS_259 = __VLS_258({
            prop: "resource",
            label: "资源",
            width: "120",
        }, ...__VLS_functionalComponentArgsRest(__VLS_258));
        const __VLS_261 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_262 = __VLS_asFunctionalComponent(__VLS_261, new __VLS_261({
            prop: "detail",
            label: "详情",
        }));
        const __VLS_263 = __VLS_262({
            prop: "detail",
            label: "详情",
        }, ...__VLS_functionalComponentArgsRest(__VLS_262));
        var __VLS_244;
    }
    var __VLS_24;
    var __VLS_20;
    const __VLS_265 = {}.ElDialog;
    /** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
    // @ts-ignore
    const __VLS_266 = __VLS_asFunctionalComponent(__VLS_265, new __VLS_265({
        modelValue: (__VLS_ctx.dialogVisible),
        title: (__VLS_ctx.editingId ? '编辑客户' : '新增客户'),
        width: "460px",
    }));
    const __VLS_267 = __VLS_266({
        modelValue: (__VLS_ctx.dialogVisible),
        title: (__VLS_ctx.editingId ? '编辑客户' : '新增客户'),
        width: "460px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_266));
    __VLS_268.slots.default;
    const __VLS_269 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_270 = __VLS_asFunctionalComponent(__VLS_269, new __VLS_269({
        labelWidth: "80px",
    }));
    const __VLS_271 = __VLS_270({
        labelWidth: "80px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_270));
    __VLS_272.slots.default;
    const __VLS_273 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_274 = __VLS_asFunctionalComponent(__VLS_273, new __VLS_273({
        label: "客户名称",
    }));
    const __VLS_275 = __VLS_274({
        label: "客户名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_274));
    __VLS_276.slots.default;
    const __VLS_277 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_278 = __VLS_asFunctionalComponent(__VLS_277, new __VLS_277({
        modelValue: (__VLS_ctx.form.name),
    }));
    const __VLS_279 = __VLS_278({
        modelValue: (__VLS_ctx.form.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_278));
    var __VLS_276;
    const __VLS_281 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_282 = __VLS_asFunctionalComponent(__VLS_281, new __VLS_281({
        label: "联系人",
    }));
    const __VLS_283 = __VLS_282({
        label: "联系人",
    }, ...__VLS_functionalComponentArgsRest(__VLS_282));
    __VLS_284.slots.default;
    const __VLS_285 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_286 = __VLS_asFunctionalComponent(__VLS_285, new __VLS_285({
        modelValue: (__VLS_ctx.form.contact),
    }));
    const __VLS_287 = __VLS_286({
        modelValue: (__VLS_ctx.form.contact),
    }, ...__VLS_functionalComponentArgsRest(__VLS_286));
    var __VLS_284;
    const __VLS_289 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_290 = __VLS_asFunctionalComponent(__VLS_289, new __VLS_289({
        label: "手机号",
    }));
    const __VLS_291 = __VLS_290({
        label: "手机号",
    }, ...__VLS_functionalComponentArgsRest(__VLS_290));
    __VLS_292.slots.default;
    const __VLS_293 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_294 = __VLS_asFunctionalComponent(__VLS_293, new __VLS_293({
        modelValue: (__VLS_ctx.form.phone),
    }));
    const __VLS_295 = __VLS_294({
        modelValue: (__VLS_ctx.form.phone),
    }, ...__VLS_functionalComponentArgsRest(__VLS_294));
    var __VLS_292;
    const __VLS_297 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_298 = __VLS_asFunctionalComponent(__VLS_297, new __VLS_297({
        label: "状态",
    }));
    const __VLS_299 = __VLS_298({
        label: "状态",
    }, ...__VLS_functionalComponentArgsRest(__VLS_298));
    __VLS_300.slots.default;
    const __VLS_301 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_302 = __VLS_asFunctionalComponent(__VLS_301, new __VLS_301({
        modelValue: (__VLS_ctx.form.status),
        ...{ style: {} },
    }));
    const __VLS_303 = __VLS_302({
        modelValue: (__VLS_ctx.form.status),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_302));
    __VLS_304.slots.default;
    const __VLS_305 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_306 = __VLS_asFunctionalComponent(__VLS_305, new __VLS_305({
        label: "有效",
        value: "ACTIVE",
    }));
    const __VLS_307 = __VLS_306({
        label: "有效",
        value: "ACTIVE",
    }, ...__VLS_functionalComponentArgsRest(__VLS_306));
    const __VLS_309 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_310 = __VLS_asFunctionalComponent(__VLS_309, new __VLS_309({
        label: "停用",
        value: "INACTIVE",
    }));
    const __VLS_311 = __VLS_310({
        label: "停用",
        value: "INACTIVE",
    }, ...__VLS_functionalComponentArgsRest(__VLS_310));
    var __VLS_304;
    var __VLS_300;
    var __VLS_272;
    {
        const { footer: __VLS_thisSlot } = __VLS_268.slots;
        const __VLS_313 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_314 = __VLS_asFunctionalComponent(__VLS_313, new __VLS_313({
            ...{ 'onClick': {} },
        }));
        const __VLS_315 = __VLS_314({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_314));
        let __VLS_317;
        let __VLS_318;
        let __VLS_319;
        const __VLS_320 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.loggedIn))
                    return;
                __VLS_ctx.dialogVisible = false;
            }
        };
        __VLS_316.slots.default;
        var __VLS_316;
        const __VLS_321 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_322 = __VLS_asFunctionalComponent(__VLS_321, new __VLS_321({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_323 = __VLS_322({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_322));
        let __VLS_325;
        let __VLS_326;
        let __VLS_327;
        const __VLS_328 = {
            onClick: (__VLS_ctx.saveCustomer)
        };
        __VLS_324.slots.default;
        var __VLS_324;
    }
    var __VLS_268;
    const __VLS_329 = {}.ElDialog;
    /** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
    // @ts-ignore
    const __VLS_330 = __VLS_asFunctionalComponent(__VLS_329, new __VLS_329({
        modelValue: (__VLS_ctx.userDialogVisible),
        title: "新增用户",
        width: "400px",
    }));
    const __VLS_331 = __VLS_330({
        modelValue: (__VLS_ctx.userDialogVisible),
        title: "新增用户",
        width: "400px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_330));
    __VLS_332.slots.default;
    const __VLS_333 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_334 = __VLS_asFunctionalComponent(__VLS_333, new __VLS_333({
        labelWidth: "70px",
    }));
    const __VLS_335 = __VLS_334({
        labelWidth: "70px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_334));
    __VLS_336.slots.default;
    const __VLS_337 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_338 = __VLS_asFunctionalComponent(__VLS_337, new __VLS_337({
        label: "用户名",
    }));
    const __VLS_339 = __VLS_338({
        label: "用户名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_338));
    __VLS_340.slots.default;
    const __VLS_341 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_342 = __VLS_asFunctionalComponent(__VLS_341, new __VLS_341({
        modelValue: (__VLS_ctx.newUser.username),
    }));
    const __VLS_343 = __VLS_342({
        modelValue: (__VLS_ctx.newUser.username),
    }, ...__VLS_functionalComponentArgsRest(__VLS_342));
    var __VLS_340;
    const __VLS_345 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_346 = __VLS_asFunctionalComponent(__VLS_345, new __VLS_345({
        label: "密码",
    }));
    const __VLS_347 = __VLS_346({
        label: "密码",
    }, ...__VLS_functionalComponentArgsRest(__VLS_346));
    __VLS_348.slots.default;
    const __VLS_349 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_350 = __VLS_asFunctionalComponent(__VLS_349, new __VLS_349({
        modelValue: (__VLS_ctx.newUser.password),
        type: "password",
        showPassword: true,
    }));
    const __VLS_351 = __VLS_350({
        modelValue: (__VLS_ctx.newUser.password),
        type: "password",
        showPassword: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_350));
    var __VLS_348;
    var __VLS_336;
    {
        const { footer: __VLS_thisSlot } = __VLS_332.slots;
        const __VLS_353 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_354 = __VLS_asFunctionalComponent(__VLS_353, new __VLS_353({
            ...{ 'onClick': {} },
        }));
        const __VLS_355 = __VLS_354({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_354));
        let __VLS_357;
        let __VLS_358;
        let __VLS_359;
        const __VLS_360 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.loggedIn))
                    return;
                __VLS_ctx.userDialogVisible = false;
            }
        };
        __VLS_356.slots.default;
        var __VLS_356;
        const __VLS_361 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_362 = __VLS_asFunctionalComponent(__VLS_361, new __VLS_361({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_363 = __VLS_362({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_362));
        let __VLS_365;
        let __VLS_366;
        let __VLS_367;
        const __VLS_368 = {
            onClick: (__VLS_ctx.createUser)
        };
        __VLS_364.slots.default;
        var __VLS_364;
    }
    var __VLS_332;
    const __VLS_369 = {}.ElDialog;
    /** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
    // @ts-ignore
    const __VLS_370 = __VLS_asFunctionalComponent(__VLS_369, new __VLS_369({
        modelValue: (__VLS_ctx.roleDialogVisible),
        title: "新增角色",
        width: "400px",
    }));
    const __VLS_371 = __VLS_370({
        modelValue: (__VLS_ctx.roleDialogVisible),
        title: "新增角色",
        width: "400px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_370));
    __VLS_372.slots.default;
    const __VLS_373 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_374 = __VLS_asFunctionalComponent(__VLS_373, new __VLS_373({
        labelWidth: "80px",
    }));
    const __VLS_375 = __VLS_374({
        labelWidth: "80px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_374));
    __VLS_376.slots.default;
    const __VLS_377 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_378 = __VLS_asFunctionalComponent(__VLS_377, new __VLS_377({
        label: "角色编码",
    }));
    const __VLS_379 = __VLS_378({
        label: "角色编码",
    }, ...__VLS_functionalComponentArgsRest(__VLS_378));
    __VLS_380.slots.default;
    const __VLS_381 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_382 = __VLS_asFunctionalComponent(__VLS_381, new __VLS_381({
        modelValue: (__VLS_ctx.newRole.roleCode),
    }));
    const __VLS_383 = __VLS_382({
        modelValue: (__VLS_ctx.newRole.roleCode),
    }, ...__VLS_functionalComponentArgsRest(__VLS_382));
    var __VLS_380;
    const __VLS_385 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_386 = __VLS_asFunctionalComponent(__VLS_385, new __VLS_385({
        label: "角色名称",
    }));
    const __VLS_387 = __VLS_386({
        label: "角色名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_386));
    __VLS_388.slots.default;
    const __VLS_389 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_390 = __VLS_asFunctionalComponent(__VLS_389, new __VLS_389({
        modelValue: (__VLS_ctx.newRole.roleName),
    }));
    const __VLS_391 = __VLS_390({
        modelValue: (__VLS_ctx.newRole.roleName),
    }, ...__VLS_functionalComponentArgsRest(__VLS_390));
    var __VLS_388;
    var __VLS_376;
    {
        const { footer: __VLS_thisSlot } = __VLS_372.slots;
        const __VLS_393 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_394 = __VLS_asFunctionalComponent(__VLS_393, new __VLS_393({
            ...{ 'onClick': {} },
        }));
        const __VLS_395 = __VLS_394({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_394));
        let __VLS_397;
        let __VLS_398;
        let __VLS_399;
        const __VLS_400 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.loggedIn))
                    return;
                __VLS_ctx.roleDialogVisible = false;
            }
        };
        __VLS_396.slots.default;
        var __VLS_396;
        const __VLS_401 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_402 = __VLS_asFunctionalComponent(__VLS_401, new __VLS_401({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_403 = __VLS_402({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_402));
        let __VLS_405;
        let __VLS_406;
        let __VLS_407;
        const __VLS_408 = {
            onClick: (__VLS_ctx.createRole)
        };
        __VLS_404.slots.default;
        var __VLS_404;
    }
    var __VLS_372;
    const __VLS_409 = {}.ElDialog;
    /** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
    // @ts-ignore
    const __VLS_410 = __VLS_asFunctionalComponent(__VLS_409, new __VLS_409({
        modelValue: (__VLS_ctx.permissionDialogVisible),
        title: (`菜单授权 - ${__VLS_ctx.permissionRole?.roleName ?? ''}`),
        width: "460px",
    }));
    const __VLS_411 = __VLS_410({
        modelValue: (__VLS_ctx.permissionDialogVisible),
        title: (`菜单授权 - ${__VLS_ctx.permissionRole?.roleName ?? ''}`),
        width: "460px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_410));
    __VLS_412.slots.default;
    const __VLS_413 = {}.ElCheckboxGroup;
    /** @type {[typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, ]} */ ;
    // @ts-ignore
    const __VLS_414 = __VLS_asFunctionalComponent(__VLS_413, new __VLS_413({
        modelValue: (__VLS_ctx.selectedMenuIds),
    }));
    const __VLS_415 = __VLS_414({
        modelValue: (__VLS_ctx.selectedMenuIds),
    }, ...__VLS_functionalComponentArgsRest(__VLS_414));
    __VLS_416.slots.default;
    for (const [menu] of __VLS_getVForSourceType((__VLS_ctx.menus))) {
        const __VLS_417 = {}.ElCheckbox;
        /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
        // @ts-ignore
        const __VLS_418 = __VLS_asFunctionalComponent(__VLS_417, new __VLS_417({
            key: (menu.id),
            label: (menu.id),
        }));
        const __VLS_419 = __VLS_418({
            key: (menu.id),
            label: (menu.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_418));
        __VLS_420.slots.default;
        (menu.menuName);
        if (menu.permission) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "permission" },
            });
            (menu.permission);
        }
        var __VLS_420;
    }
    var __VLS_416;
    {
        const { footer: __VLS_thisSlot } = __VLS_412.slots;
        const __VLS_421 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_422 = __VLS_asFunctionalComponent(__VLS_421, new __VLS_421({
            ...{ 'onClick': {} },
        }));
        const __VLS_423 = __VLS_422({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_422));
        let __VLS_425;
        let __VLS_426;
        let __VLS_427;
        const __VLS_428 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.loggedIn))
                    return;
                __VLS_ctx.permissionDialogVisible = false;
            }
        };
        __VLS_424.slots.default;
        var __VLS_424;
        const __VLS_429 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_430 = __VLS_asFunctionalComponent(__VLS_429, new __VLS_429({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_431 = __VLS_430({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_430));
        let __VLS_433;
        let __VLS_434;
        let __VLS_435;
        const __VLS_436 = {
            onClick: (__VLS_ctx.savePermission)
        };
        __VLS_432.slots.default;
        var __VLS_432;
    }
    var __VLS_412;
    const __VLS_437 = {}.ElDialog;
    /** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
    // @ts-ignore
    const __VLS_438 = __VLS_asFunctionalComponent(__VLS_437, new __VLS_437({
        modelValue: (__VLS_ctx.menuDialogVisible),
        title: "新增菜单",
        width: "420px",
    }));
    const __VLS_439 = __VLS_438({
        modelValue: (__VLS_ctx.menuDialogVisible),
        title: "新增菜单",
        width: "420px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_438));
    __VLS_440.slots.default;
    const __VLS_441 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_442 = __VLS_asFunctionalComponent(__VLS_441, new __VLS_441({
        labelWidth: "90px",
    }));
    const __VLS_443 = __VLS_442({
        labelWidth: "90px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_442));
    __VLS_444.slots.default;
    const __VLS_445 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_446 = __VLS_asFunctionalComponent(__VLS_445, new __VLS_445({
        label: "菜单名称",
    }));
    const __VLS_447 = __VLS_446({
        label: "菜单名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_446));
    __VLS_448.slots.default;
    const __VLS_449 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_450 = __VLS_asFunctionalComponent(__VLS_449, new __VLS_449({
        modelValue: (__VLS_ctx.newMenu.menuName),
    }));
    const __VLS_451 = __VLS_450({
        modelValue: (__VLS_ctx.newMenu.menuName),
    }, ...__VLS_functionalComponentArgsRest(__VLS_450));
    var __VLS_448;
    const __VLS_453 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_454 = __VLS_asFunctionalComponent(__VLS_453, new __VLS_453({
        label: "权限标识",
    }));
    const __VLS_455 = __VLS_454({
        label: "权限标识",
    }, ...__VLS_functionalComponentArgsRest(__VLS_454));
    __VLS_456.slots.default;
    const __VLS_457 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_458 = __VLS_asFunctionalComponent(__VLS_457, new __VLS_457({
        modelValue: (__VLS_ctx.newMenu.permission),
        placeholder: "例如 customer:read",
    }));
    const __VLS_459 = __VLS_458({
        modelValue: (__VLS_ctx.newMenu.permission),
        placeholder: "例如 customer:read",
    }, ...__VLS_functionalComponentArgsRest(__VLS_458));
    var __VLS_456;
    const __VLS_461 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_462 = __VLS_asFunctionalComponent(__VLS_461, new __VLS_461({
        label: "菜单类型",
    }));
    const __VLS_463 = __VLS_462({
        label: "菜单类型",
    }, ...__VLS_functionalComponentArgsRest(__VLS_462));
    __VLS_464.slots.default;
    const __VLS_465 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_466 = __VLS_asFunctionalComponent(__VLS_465, new __VLS_465({
        modelValue: (__VLS_ctx.newMenu.menuType),
        ...{ style: {} },
    }));
    const __VLS_467 = __VLS_466({
        modelValue: (__VLS_ctx.newMenu.menuType),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_466));
    __VLS_468.slots.default;
    const __VLS_469 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_470 = __VLS_asFunctionalComponent(__VLS_469, new __VLS_469({
        label: "菜单",
        value: "M",
    }));
    const __VLS_471 = __VLS_470({
        label: "菜单",
        value: "M",
    }, ...__VLS_functionalComponentArgsRest(__VLS_470));
    const __VLS_473 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_474 = __VLS_asFunctionalComponent(__VLS_473, new __VLS_473({
        label: "按钮",
        value: "B",
    }));
    const __VLS_475 = __VLS_474({
        label: "按钮",
        value: "B",
    }, ...__VLS_functionalComponentArgsRest(__VLS_474));
    var __VLS_468;
    var __VLS_464;
    var __VLS_444;
    {
        const { footer: __VLS_thisSlot } = __VLS_440.slots;
        const __VLS_477 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_478 = __VLS_asFunctionalComponent(__VLS_477, new __VLS_477({
            ...{ 'onClick': {} },
        }));
        const __VLS_479 = __VLS_478({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_478));
        let __VLS_481;
        let __VLS_482;
        let __VLS_483;
        const __VLS_484 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.loggedIn))
                    return;
                __VLS_ctx.menuDialogVisible = false;
            }
        };
        __VLS_480.slots.default;
        var __VLS_480;
        const __VLS_485 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_486 = __VLS_asFunctionalComponent(__VLS_485, new __VLS_485({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_487 = __VLS_486({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_486));
        let __VLS_489;
        let __VLS_490;
        let __VLS_491;
        const __VLS_492 = {
            onClick: (__VLS_ctx.createMenu)
        };
        __VLS_488.slots.default;
        var __VLS_488;
    }
    var __VLS_440;
    var __VLS_3;
}
else {
    const __VLS_493 = {}.ElMain;
    /** @type {[typeof __VLS_components.ElMain, typeof __VLS_components.elMain, typeof __VLS_components.ElMain, typeof __VLS_components.elMain, ]} */ ;
    // @ts-ignore
    const __VLS_494 = __VLS_asFunctionalComponent(__VLS_493, new __VLS_493({
        ...{ class: "login-page" },
    }));
    const __VLS_495 = __VLS_494({
        ...{ class: "login-page" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_494));
    var __VLS_497 = {};
    __VLS_496.slots.default;
    const __VLS_498 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_499 = __VLS_asFunctionalComponent(__VLS_498, new __VLS_498({
        ...{ class: "login-card" },
    }));
    const __VLS_500 = __VLS_499({
        ...{ class: "login-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_499));
    __VLS_501.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    const __VLS_502 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_503 = __VLS_asFunctionalComponent(__VLS_502, new __VLS_502({
        ...{ 'onSubmit': {} },
    }));
    const __VLS_504 = __VLS_503({
        ...{ 'onSubmit': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_503));
    let __VLS_506;
    let __VLS_507;
    let __VLS_508;
    const __VLS_509 = {
        onSubmit: (__VLS_ctx.login)
    };
    __VLS_505.slots.default;
    const __VLS_510 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_511 = __VLS_asFunctionalComponent(__VLS_510, new __VLS_510({}));
    const __VLS_512 = __VLS_511({}, ...__VLS_functionalComponentArgsRest(__VLS_511));
    __VLS_513.slots.default;
    const __VLS_514 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_515 = __VLS_asFunctionalComponent(__VLS_514, new __VLS_514({
        modelValue: (__VLS_ctx.username),
        placeholder: "用户名",
    }));
    const __VLS_516 = __VLS_515({
        modelValue: (__VLS_ctx.username),
        placeholder: "用户名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_515));
    var __VLS_513;
    const __VLS_518 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_519 = __VLS_asFunctionalComponent(__VLS_518, new __VLS_518({}));
    const __VLS_520 = __VLS_519({}, ...__VLS_functionalComponentArgsRest(__VLS_519));
    __VLS_521.slots.default;
    const __VLS_522 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_523 = __VLS_asFunctionalComponent(__VLS_522, new __VLS_522({
        modelValue: (__VLS_ctx.password),
        type: "password",
        placeholder: "密码",
        showPassword: true,
    }));
    const __VLS_524 = __VLS_523({
        modelValue: (__VLS_ctx.password),
        type: "password",
        placeholder: "密码",
        showPassword: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_523));
    var __VLS_521;
    const __VLS_526 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_527 = __VLS_asFunctionalComponent(__VLS_526, new __VLS_526({
        type: "primary",
        nativeType: "submit",
        ...{ class: "full" },
    }));
    const __VLS_528 = __VLS_527({
        type: "primary",
        nativeType: "submit",
        ...{ class: "full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_527));
    __VLS_529.slots.default;
    var __VLS_529;
    var __VLS_505;
    var __VLS_501;
    var __VLS_496;
}
/** @type {__VLS_StyleScopedClasses['layout']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['permission']} */ ;
/** @type {__VLS_StyleScopedClasses['login-page']} */ ;
/** @type {__VLS_StyleScopedClasses['login-card']} */ ;
/** @type {__VLS_StyleScopedClasses['full']} */ ;
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
