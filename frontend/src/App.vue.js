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
const newUser = ref({ username: '', password: '' });
const userDialogVisible = ref(false);
const roleDialogVisible = ref(false);
const newRole = ref({ roleCode: '', roleName: '' });
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
            type: (__VLS_ctx.activeView === 'customers' ? 'primary' : 'default'),
        }));
        const __VLS_27 = __VLS_26({
            ...{ 'onClick': {} },
            type: (__VLS_ctx.activeView === 'customers' ? 'primary' : 'default'),
        }, ...__VLS_functionalComponentArgsRest(__VLS_26));
        let __VLS_29;
        let __VLS_30;
        let __VLS_31;
        const __VLS_32 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.loggedIn))
                    return;
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
                    __VLS_ctx.activeView = 'logs';
                    __VLS_ctx.loadLogs();
                }
            };
            __VLS_52.slots.default;
            var __VLS_52;
        }
        if (__VLS_ctx.activeView === 'customers' && __VLS_ctx.hasPermission('customer:write')) {
            const __VLS_57 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_58 = __VLS_asFunctionalComponent(__VLS_57, new __VLS_57({
                ...{ 'onClick': {} },
                type: "primary",
            }));
            const __VLS_59 = __VLS_58({
                ...{ 'onClick': {} },
                type: "primary",
            }, ...__VLS_functionalComponentArgsRest(__VLS_58));
            let __VLS_61;
            let __VLS_62;
            let __VLS_63;
            const __VLS_64 = {
                onClick: (...[$event]) => {
                    if (!(__VLS_ctx.loggedIn))
                        return;
                    if (!(__VLS_ctx.activeView === 'customers' && __VLS_ctx.hasPermission('customer:write')))
                        return;
                    __VLS_ctx.openCustomerForm();
                }
            };
            __VLS_60.slots.default;
            var __VLS_60;
        }
        if (__VLS_ctx.activeView === 'users' && __VLS_ctx.hasPermission('system:user:write')) {
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
                    if (!(__VLS_ctx.activeView === 'users' && __VLS_ctx.hasPermission('system:user:write')))
                        return;
                    __VLS_ctx.userDialogVisible = true;
                }
            };
            __VLS_68.slots.default;
            var __VLS_68;
        }
        if (__VLS_ctx.activeView === 'roles' && __VLS_ctx.hasPermission('system:user:write')) {
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
                    if (!(__VLS_ctx.activeView === 'roles' && __VLS_ctx.hasPermission('system:user:write')))
                        return;
                    __VLS_ctx.roleDialogVisible = true;
                }
            };
            __VLS_76.slots.default;
            var __VLS_76;
        }
    }
    if (__VLS_ctx.activeView === 'customers') {
        const __VLS_81 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_82 = __VLS_asFunctionalComponent(__VLS_81, new __VLS_81({
            data: (__VLS_ctx.customers),
            stripe: true,
        }));
        const __VLS_83 = __VLS_82({
            data: (__VLS_ctx.customers),
            stripe: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_82));
        __VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
        __VLS_84.slots.default;
        const __VLS_85 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_86 = __VLS_asFunctionalComponent(__VLS_85, new __VLS_85({
            prop: "id",
            label: "编号",
            width: "90",
        }));
        const __VLS_87 = __VLS_86({
            prop: "id",
            label: "编号",
            width: "90",
        }, ...__VLS_functionalComponentArgsRest(__VLS_86));
        const __VLS_89 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_90 = __VLS_asFunctionalComponent(__VLS_89, new __VLS_89({
            prop: "name",
            label: "客户名称",
        }));
        const __VLS_91 = __VLS_90({
            prop: "name",
            label: "客户名称",
        }, ...__VLS_functionalComponentArgsRest(__VLS_90));
        const __VLS_93 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_94 = __VLS_asFunctionalComponent(__VLS_93, new __VLS_93({
            prop: "contact",
            label: "联系人",
        }));
        const __VLS_95 = __VLS_94({
            prop: "contact",
            label: "联系人",
        }, ...__VLS_functionalComponentArgsRest(__VLS_94));
        const __VLS_97 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_98 = __VLS_asFunctionalComponent(__VLS_97, new __VLS_97({
            prop: "phone",
            label: "联系电话",
        }));
        const __VLS_99 = __VLS_98({
            prop: "phone",
            label: "联系电话",
        }, ...__VLS_functionalComponentArgsRest(__VLS_98));
        const __VLS_101 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_102 = __VLS_asFunctionalComponent(__VLS_101, new __VLS_101({
            prop: "status",
            label: "状态",
        }));
        const __VLS_103 = __VLS_102({
            prop: "status",
            label: "状态",
        }, ...__VLS_functionalComponentArgsRest(__VLS_102));
        const __VLS_105 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_106 = __VLS_asFunctionalComponent(__VLS_105, new __VLS_105({
            label: "操作",
            width: "150",
        }));
        const __VLS_107 = __VLS_106({
            label: "操作",
            width: "150",
        }, ...__VLS_functionalComponentArgsRest(__VLS_106));
        __VLS_108.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_108.slots;
            const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
            if (__VLS_ctx.hasPermission('customer:write')) {
                const __VLS_109 = {}.ElButton;
                /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                // @ts-ignore
                const __VLS_110 = __VLS_asFunctionalComponent(__VLS_109, new __VLS_109({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "primary",
                }));
                const __VLS_111 = __VLS_110({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "primary",
                }, ...__VLS_functionalComponentArgsRest(__VLS_110));
                let __VLS_113;
                let __VLS_114;
                let __VLS_115;
                const __VLS_116 = {
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.loggedIn))
                            return;
                        if (!(__VLS_ctx.activeView === 'customers'))
                            return;
                        if (!(__VLS_ctx.hasPermission('customer:write')))
                            return;
                        __VLS_ctx.openCustomerForm(scope.row);
                    }
                };
                __VLS_112.slots.default;
                var __VLS_112;
            }
            if (__VLS_ctx.hasPermission('customer:write')) {
                const __VLS_117 = {}.ElButton;
                /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                // @ts-ignore
                const __VLS_118 = __VLS_asFunctionalComponent(__VLS_117, new __VLS_117({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "danger",
                }));
                const __VLS_119 = __VLS_118({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "danger",
                }, ...__VLS_functionalComponentArgsRest(__VLS_118));
                let __VLS_121;
                let __VLS_122;
                let __VLS_123;
                const __VLS_124 = {
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.loggedIn))
                            return;
                        if (!(__VLS_ctx.activeView === 'customers'))
                            return;
                        if (!(__VLS_ctx.hasPermission('customer:write')))
                            return;
                        __VLS_ctx.removeCustomer(scope.row);
                    }
                };
                __VLS_120.slots.default;
                var __VLS_120;
            }
        }
        var __VLS_108;
        var __VLS_84;
    }
    else if (__VLS_ctx.activeView === 'users') {
        const __VLS_125 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_126 = __VLS_asFunctionalComponent(__VLS_125, new __VLS_125({
            data: (__VLS_ctx.users),
            stripe: true,
        }));
        const __VLS_127 = __VLS_126({
            data: (__VLS_ctx.users),
            stripe: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_126));
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
            prop: "username",
            label: "用户名",
        }));
        const __VLS_135 = __VLS_134({
            prop: "username",
            label: "用户名",
        }, ...__VLS_functionalComponentArgsRest(__VLS_134));
        const __VLS_137 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_138 = __VLS_asFunctionalComponent(__VLS_137, new __VLS_137({
            prop: "roleCode",
            label: "角色",
        }));
        const __VLS_139 = __VLS_138({
            prop: "roleCode",
            label: "角色",
        }, ...__VLS_functionalComponentArgsRest(__VLS_138));
        const __VLS_141 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_142 = __VLS_asFunctionalComponent(__VLS_141, new __VLS_141({
            label: "状态",
        }));
        const __VLS_143 = __VLS_142({
            label: "状态",
        }, ...__VLS_functionalComponentArgsRest(__VLS_142));
        __VLS_144.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_144.slots;
            const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_145 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_146 = __VLS_asFunctionalComponent(__VLS_145, new __VLS_145({
                type: (scope.row.enabled ? 'success' : 'info'),
            }));
            const __VLS_147 = __VLS_146({
                type: (scope.row.enabled ? 'success' : 'info'),
            }, ...__VLS_functionalComponentArgsRest(__VLS_146));
            __VLS_148.slots.default;
            (scope.row.enabled ? '启用' : '禁用');
            var __VLS_148;
        }
        var __VLS_144;
        const __VLS_149 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_150 = __VLS_asFunctionalComponent(__VLS_149, new __VLS_149({
            label: "操作",
            width: "110",
        }));
        const __VLS_151 = __VLS_150({
            label: "操作",
            width: "110",
        }, ...__VLS_functionalComponentArgsRest(__VLS_150));
        __VLS_152.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_152.slots;
            const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
            if (__VLS_ctx.hasPermission('system:user:write')) {
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
                        if (!!(__VLS_ctx.activeView === 'customers'))
                            return;
                        if (!(__VLS_ctx.activeView === 'users'))
                            return;
                        if (!(__VLS_ctx.hasPermission('system:user:write')))
                            return;
                        __VLS_ctx.toggleUser(scope.row);
                    }
                };
                __VLS_156.slots.default;
                (scope.row.enabled ? '禁用' : '启用');
                var __VLS_156;
            }
        }
        var __VLS_152;
        var __VLS_128;
    }
    else if (__VLS_ctx.activeView === 'roles') {
        const __VLS_161 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_162 = __VLS_asFunctionalComponent(__VLS_161, new __VLS_161({
            data: (__VLS_ctx.roles),
            stripe: true,
        }));
        const __VLS_163 = __VLS_162({
            data: (__VLS_ctx.roles),
            stripe: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_162));
        __VLS_164.slots.default;
        const __VLS_165 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_166 = __VLS_asFunctionalComponent(__VLS_165, new __VLS_165({
            prop: "id",
            label: "编号",
            width: "90",
        }));
        const __VLS_167 = __VLS_166({
            prop: "id",
            label: "编号",
            width: "90",
        }, ...__VLS_functionalComponentArgsRest(__VLS_166));
        const __VLS_169 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_170 = __VLS_asFunctionalComponent(__VLS_169, new __VLS_169({
            prop: "roleCode",
            label: "角色编码",
        }));
        const __VLS_171 = __VLS_170({
            prop: "roleCode",
            label: "角色编码",
        }, ...__VLS_functionalComponentArgsRest(__VLS_170));
        const __VLS_173 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_174 = __VLS_asFunctionalComponent(__VLS_173, new __VLS_173({
            prop: "roleName",
            label: "角色名称",
        }));
        const __VLS_175 = __VLS_174({
            prop: "roleName",
            label: "角色名称",
        }, ...__VLS_functionalComponentArgsRest(__VLS_174));
        const __VLS_177 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_178 = __VLS_asFunctionalComponent(__VLS_177, new __VLS_177({
            label: "状态",
        }));
        const __VLS_179 = __VLS_178({
            label: "状态",
        }, ...__VLS_functionalComponentArgsRest(__VLS_178));
        __VLS_180.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_180.slots;
            const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
            const __VLS_181 = {}.ElTag;
            /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
            // @ts-ignore
            const __VLS_182 = __VLS_asFunctionalComponent(__VLS_181, new __VLS_181({
                type: (scope.row.enabled ? 'success' : 'info'),
            }));
            const __VLS_183 = __VLS_182({
                type: (scope.row.enabled ? 'success' : 'info'),
            }, ...__VLS_functionalComponentArgsRest(__VLS_182));
            __VLS_184.slots.default;
            (scope.row.enabled ? '启用' : '禁用');
            var __VLS_184;
        }
        var __VLS_180;
        const __VLS_185 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_186 = __VLS_asFunctionalComponent(__VLS_185, new __VLS_185({
            label: "操作",
            width: "120",
        }));
        const __VLS_187 = __VLS_186({
            label: "操作",
            width: "120",
        }, ...__VLS_functionalComponentArgsRest(__VLS_186));
        __VLS_188.slots.default;
        {
            const { default: __VLS_thisSlot } = __VLS_188.slots;
            const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
            if (__VLS_ctx.hasPermission('system:user:write')) {
                const __VLS_189 = {}.ElButton;
                /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
                // @ts-ignore
                const __VLS_190 = __VLS_asFunctionalComponent(__VLS_189, new __VLS_189({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "primary",
                }));
                const __VLS_191 = __VLS_190({
                    ...{ 'onClick': {} },
                    link: true,
                    type: "primary",
                }, ...__VLS_functionalComponentArgsRest(__VLS_190));
                let __VLS_193;
                let __VLS_194;
                let __VLS_195;
                const __VLS_196 = {
                    onClick: (...[$event]) => {
                        if (!(__VLS_ctx.loggedIn))
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
                __VLS_192.slots.default;
                var __VLS_192;
            }
        }
        var __VLS_188;
        var __VLS_164;
    }
    else {
        const __VLS_197 = {}.ElTable;
        /** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
        // @ts-ignore
        const __VLS_198 = __VLS_asFunctionalComponent(__VLS_197, new __VLS_197({
            data: (__VLS_ctx.logs),
            stripe: true,
        }));
        const __VLS_199 = __VLS_198({
            data: (__VLS_ctx.logs),
            stripe: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_198));
        __VLS_200.slots.default;
        const __VLS_201 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_202 = __VLS_asFunctionalComponent(__VLS_201, new __VLS_201({
            prop: "createdAt",
            label: "时间",
            width: "190",
        }));
        const __VLS_203 = __VLS_202({
            prop: "createdAt",
            label: "时间",
            width: "190",
        }, ...__VLS_functionalComponentArgsRest(__VLS_202));
        const __VLS_205 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_206 = __VLS_asFunctionalComponent(__VLS_205, new __VLS_205({
            prop: "username",
            label: "用户",
            width: "100",
        }));
        const __VLS_207 = __VLS_206({
            prop: "username",
            label: "用户",
            width: "100",
        }, ...__VLS_functionalComponentArgsRest(__VLS_206));
        const __VLS_209 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_210 = __VLS_asFunctionalComponent(__VLS_209, new __VLS_209({
            prop: "action",
            label: "动作",
            width: "100",
        }));
        const __VLS_211 = __VLS_210({
            prop: "action",
            label: "动作",
            width: "100",
        }, ...__VLS_functionalComponentArgsRest(__VLS_210));
        const __VLS_213 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_214 = __VLS_asFunctionalComponent(__VLS_213, new __VLS_213({
            prop: "resource",
            label: "资源",
            width: "120",
        }));
        const __VLS_215 = __VLS_214({
            prop: "resource",
            label: "资源",
            width: "120",
        }, ...__VLS_functionalComponentArgsRest(__VLS_214));
        const __VLS_217 = {}.ElTableColumn;
        /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
        // @ts-ignore
        const __VLS_218 = __VLS_asFunctionalComponent(__VLS_217, new __VLS_217({
            prop: "detail",
            label: "详情",
        }));
        const __VLS_219 = __VLS_218({
            prop: "detail",
            label: "详情",
        }, ...__VLS_functionalComponentArgsRest(__VLS_218));
        var __VLS_200;
    }
    var __VLS_24;
    var __VLS_20;
    const __VLS_221 = {}.ElDialog;
    /** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
    // @ts-ignore
    const __VLS_222 = __VLS_asFunctionalComponent(__VLS_221, new __VLS_221({
        modelValue: (__VLS_ctx.dialogVisible),
        title: (__VLS_ctx.editingId ? '编辑客户' : '新增客户'),
        width: "460px",
    }));
    const __VLS_223 = __VLS_222({
        modelValue: (__VLS_ctx.dialogVisible),
        title: (__VLS_ctx.editingId ? '编辑客户' : '新增客户'),
        width: "460px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_222));
    __VLS_224.slots.default;
    const __VLS_225 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_226 = __VLS_asFunctionalComponent(__VLS_225, new __VLS_225({
        labelWidth: "80px",
    }));
    const __VLS_227 = __VLS_226({
        labelWidth: "80px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_226));
    __VLS_228.slots.default;
    const __VLS_229 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_230 = __VLS_asFunctionalComponent(__VLS_229, new __VLS_229({
        label: "客户名称",
    }));
    const __VLS_231 = __VLS_230({
        label: "客户名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_230));
    __VLS_232.slots.default;
    const __VLS_233 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_234 = __VLS_asFunctionalComponent(__VLS_233, new __VLS_233({
        modelValue: (__VLS_ctx.form.name),
    }));
    const __VLS_235 = __VLS_234({
        modelValue: (__VLS_ctx.form.name),
    }, ...__VLS_functionalComponentArgsRest(__VLS_234));
    var __VLS_232;
    const __VLS_237 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_238 = __VLS_asFunctionalComponent(__VLS_237, new __VLS_237({
        label: "联系人",
    }));
    const __VLS_239 = __VLS_238({
        label: "联系人",
    }, ...__VLS_functionalComponentArgsRest(__VLS_238));
    __VLS_240.slots.default;
    const __VLS_241 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_242 = __VLS_asFunctionalComponent(__VLS_241, new __VLS_241({
        modelValue: (__VLS_ctx.form.contact),
    }));
    const __VLS_243 = __VLS_242({
        modelValue: (__VLS_ctx.form.contact),
    }, ...__VLS_functionalComponentArgsRest(__VLS_242));
    var __VLS_240;
    const __VLS_245 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_246 = __VLS_asFunctionalComponent(__VLS_245, new __VLS_245({
        label: "手机号",
    }));
    const __VLS_247 = __VLS_246({
        label: "手机号",
    }, ...__VLS_functionalComponentArgsRest(__VLS_246));
    __VLS_248.slots.default;
    const __VLS_249 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_250 = __VLS_asFunctionalComponent(__VLS_249, new __VLS_249({
        modelValue: (__VLS_ctx.form.phone),
    }));
    const __VLS_251 = __VLS_250({
        modelValue: (__VLS_ctx.form.phone),
    }, ...__VLS_functionalComponentArgsRest(__VLS_250));
    var __VLS_248;
    const __VLS_253 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_254 = __VLS_asFunctionalComponent(__VLS_253, new __VLS_253({
        label: "状态",
    }));
    const __VLS_255 = __VLS_254({
        label: "状态",
    }, ...__VLS_functionalComponentArgsRest(__VLS_254));
    __VLS_256.slots.default;
    const __VLS_257 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_258 = __VLS_asFunctionalComponent(__VLS_257, new __VLS_257({
        modelValue: (__VLS_ctx.form.status),
        ...{ style: {} },
    }));
    const __VLS_259 = __VLS_258({
        modelValue: (__VLS_ctx.form.status),
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_258));
    __VLS_260.slots.default;
    const __VLS_261 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_262 = __VLS_asFunctionalComponent(__VLS_261, new __VLS_261({
        label: "有效",
        value: "ACTIVE",
    }));
    const __VLS_263 = __VLS_262({
        label: "有效",
        value: "ACTIVE",
    }, ...__VLS_functionalComponentArgsRest(__VLS_262));
    const __VLS_265 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_266 = __VLS_asFunctionalComponent(__VLS_265, new __VLS_265({
        label: "停用",
        value: "INACTIVE",
    }));
    const __VLS_267 = __VLS_266({
        label: "停用",
        value: "INACTIVE",
    }, ...__VLS_functionalComponentArgsRest(__VLS_266));
    var __VLS_260;
    var __VLS_256;
    var __VLS_228;
    {
        const { footer: __VLS_thisSlot } = __VLS_224.slots;
        const __VLS_269 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_270 = __VLS_asFunctionalComponent(__VLS_269, new __VLS_269({
            ...{ 'onClick': {} },
        }));
        const __VLS_271 = __VLS_270({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_270));
        let __VLS_273;
        let __VLS_274;
        let __VLS_275;
        const __VLS_276 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.loggedIn))
                    return;
                __VLS_ctx.dialogVisible = false;
            }
        };
        __VLS_272.slots.default;
        var __VLS_272;
        const __VLS_277 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_278 = __VLS_asFunctionalComponent(__VLS_277, new __VLS_277({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_279 = __VLS_278({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_278));
        let __VLS_281;
        let __VLS_282;
        let __VLS_283;
        const __VLS_284 = {
            onClick: (__VLS_ctx.saveCustomer)
        };
        __VLS_280.slots.default;
        var __VLS_280;
    }
    var __VLS_224;
    const __VLS_285 = {}.ElDialog;
    /** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
    // @ts-ignore
    const __VLS_286 = __VLS_asFunctionalComponent(__VLS_285, new __VLS_285({
        modelValue: (__VLS_ctx.userDialogVisible),
        title: "新增用户",
        width: "400px",
    }));
    const __VLS_287 = __VLS_286({
        modelValue: (__VLS_ctx.userDialogVisible),
        title: "新增用户",
        width: "400px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_286));
    __VLS_288.slots.default;
    const __VLS_289 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_290 = __VLS_asFunctionalComponent(__VLS_289, new __VLS_289({
        labelWidth: "70px",
    }));
    const __VLS_291 = __VLS_290({
        labelWidth: "70px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_290));
    __VLS_292.slots.default;
    const __VLS_293 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_294 = __VLS_asFunctionalComponent(__VLS_293, new __VLS_293({
        label: "用户名",
    }));
    const __VLS_295 = __VLS_294({
        label: "用户名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_294));
    __VLS_296.slots.default;
    const __VLS_297 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_298 = __VLS_asFunctionalComponent(__VLS_297, new __VLS_297({
        modelValue: (__VLS_ctx.newUser.username),
    }));
    const __VLS_299 = __VLS_298({
        modelValue: (__VLS_ctx.newUser.username),
    }, ...__VLS_functionalComponentArgsRest(__VLS_298));
    var __VLS_296;
    const __VLS_301 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_302 = __VLS_asFunctionalComponent(__VLS_301, new __VLS_301({
        label: "密码",
    }));
    const __VLS_303 = __VLS_302({
        label: "密码",
    }, ...__VLS_functionalComponentArgsRest(__VLS_302));
    __VLS_304.slots.default;
    const __VLS_305 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_306 = __VLS_asFunctionalComponent(__VLS_305, new __VLS_305({
        modelValue: (__VLS_ctx.newUser.password),
        type: "password",
        showPassword: true,
    }));
    const __VLS_307 = __VLS_306({
        modelValue: (__VLS_ctx.newUser.password),
        type: "password",
        showPassword: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_306));
    var __VLS_304;
    var __VLS_292;
    {
        const { footer: __VLS_thisSlot } = __VLS_288.slots;
        const __VLS_309 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_310 = __VLS_asFunctionalComponent(__VLS_309, new __VLS_309({
            ...{ 'onClick': {} },
        }));
        const __VLS_311 = __VLS_310({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_310));
        let __VLS_313;
        let __VLS_314;
        let __VLS_315;
        const __VLS_316 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.loggedIn))
                    return;
                __VLS_ctx.userDialogVisible = false;
            }
        };
        __VLS_312.slots.default;
        var __VLS_312;
        const __VLS_317 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_318 = __VLS_asFunctionalComponent(__VLS_317, new __VLS_317({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_319 = __VLS_318({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_318));
        let __VLS_321;
        let __VLS_322;
        let __VLS_323;
        const __VLS_324 = {
            onClick: (__VLS_ctx.createUser)
        };
        __VLS_320.slots.default;
        var __VLS_320;
    }
    var __VLS_288;
    const __VLS_325 = {}.ElDialog;
    /** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
    // @ts-ignore
    const __VLS_326 = __VLS_asFunctionalComponent(__VLS_325, new __VLS_325({
        modelValue: (__VLS_ctx.roleDialogVisible),
        title: "新增角色",
        width: "400px",
    }));
    const __VLS_327 = __VLS_326({
        modelValue: (__VLS_ctx.roleDialogVisible),
        title: "新增角色",
        width: "400px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_326));
    __VLS_328.slots.default;
    const __VLS_329 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_330 = __VLS_asFunctionalComponent(__VLS_329, new __VLS_329({
        labelWidth: "80px",
    }));
    const __VLS_331 = __VLS_330({
        labelWidth: "80px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_330));
    __VLS_332.slots.default;
    const __VLS_333 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_334 = __VLS_asFunctionalComponent(__VLS_333, new __VLS_333({
        label: "角色编码",
    }));
    const __VLS_335 = __VLS_334({
        label: "角色编码",
    }, ...__VLS_functionalComponentArgsRest(__VLS_334));
    __VLS_336.slots.default;
    const __VLS_337 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_338 = __VLS_asFunctionalComponent(__VLS_337, new __VLS_337({
        modelValue: (__VLS_ctx.newRole.roleCode),
    }));
    const __VLS_339 = __VLS_338({
        modelValue: (__VLS_ctx.newRole.roleCode),
    }, ...__VLS_functionalComponentArgsRest(__VLS_338));
    var __VLS_336;
    const __VLS_341 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_342 = __VLS_asFunctionalComponent(__VLS_341, new __VLS_341({
        label: "角色名称",
    }));
    const __VLS_343 = __VLS_342({
        label: "角色名称",
    }, ...__VLS_functionalComponentArgsRest(__VLS_342));
    __VLS_344.slots.default;
    const __VLS_345 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_346 = __VLS_asFunctionalComponent(__VLS_345, new __VLS_345({
        modelValue: (__VLS_ctx.newRole.roleName),
    }));
    const __VLS_347 = __VLS_346({
        modelValue: (__VLS_ctx.newRole.roleName),
    }, ...__VLS_functionalComponentArgsRest(__VLS_346));
    var __VLS_344;
    var __VLS_332;
    {
        const { footer: __VLS_thisSlot } = __VLS_328.slots;
        const __VLS_349 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_350 = __VLS_asFunctionalComponent(__VLS_349, new __VLS_349({
            ...{ 'onClick': {} },
        }));
        const __VLS_351 = __VLS_350({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_350));
        let __VLS_353;
        let __VLS_354;
        let __VLS_355;
        const __VLS_356 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.loggedIn))
                    return;
                __VLS_ctx.roleDialogVisible = false;
            }
        };
        __VLS_352.slots.default;
        var __VLS_352;
        const __VLS_357 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_358 = __VLS_asFunctionalComponent(__VLS_357, new __VLS_357({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_359 = __VLS_358({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_358));
        let __VLS_361;
        let __VLS_362;
        let __VLS_363;
        const __VLS_364 = {
            onClick: (__VLS_ctx.createRole)
        };
        __VLS_360.slots.default;
        var __VLS_360;
    }
    var __VLS_328;
    const __VLS_365 = {}.ElDialog;
    /** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
    // @ts-ignore
    const __VLS_366 = __VLS_asFunctionalComponent(__VLS_365, new __VLS_365({
        modelValue: (__VLS_ctx.permissionDialogVisible),
        title: (`菜单授权 - ${__VLS_ctx.permissionRole?.roleName ?? ''}`),
        width: "460px",
    }));
    const __VLS_367 = __VLS_366({
        modelValue: (__VLS_ctx.permissionDialogVisible),
        title: (`菜单授权 - ${__VLS_ctx.permissionRole?.roleName ?? ''}`),
        width: "460px",
    }, ...__VLS_functionalComponentArgsRest(__VLS_366));
    __VLS_368.slots.default;
    const __VLS_369 = {}.ElCheckboxGroup;
    /** @type {[typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, typeof __VLS_components.ElCheckboxGroup, typeof __VLS_components.elCheckboxGroup, ]} */ ;
    // @ts-ignore
    const __VLS_370 = __VLS_asFunctionalComponent(__VLS_369, new __VLS_369({
        modelValue: (__VLS_ctx.selectedMenuIds),
    }));
    const __VLS_371 = __VLS_370({
        modelValue: (__VLS_ctx.selectedMenuIds),
    }, ...__VLS_functionalComponentArgsRest(__VLS_370));
    __VLS_372.slots.default;
    for (const [menu] of __VLS_getVForSourceType((__VLS_ctx.menus))) {
        const __VLS_373 = {}.ElCheckbox;
        /** @type {[typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, typeof __VLS_components.ElCheckbox, typeof __VLS_components.elCheckbox, ]} */ ;
        // @ts-ignore
        const __VLS_374 = __VLS_asFunctionalComponent(__VLS_373, new __VLS_373({
            key: (menu.id),
            label: (menu.id),
        }));
        const __VLS_375 = __VLS_374({
            key: (menu.id),
            label: (menu.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_374));
        __VLS_376.slots.default;
        (menu.menuName);
        if (menu.permission) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "permission" },
            });
            (menu.permission);
        }
        var __VLS_376;
    }
    var __VLS_372;
    {
        const { footer: __VLS_thisSlot } = __VLS_368.slots;
        const __VLS_377 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_378 = __VLS_asFunctionalComponent(__VLS_377, new __VLS_377({
            ...{ 'onClick': {} },
        }));
        const __VLS_379 = __VLS_378({
            ...{ 'onClick': {} },
        }, ...__VLS_functionalComponentArgsRest(__VLS_378));
        let __VLS_381;
        let __VLS_382;
        let __VLS_383;
        const __VLS_384 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.loggedIn))
                    return;
                __VLS_ctx.permissionDialogVisible = false;
            }
        };
        __VLS_380.slots.default;
        var __VLS_380;
        const __VLS_385 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_386 = __VLS_asFunctionalComponent(__VLS_385, new __VLS_385({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_387 = __VLS_386({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_386));
        let __VLS_389;
        let __VLS_390;
        let __VLS_391;
        const __VLS_392 = {
            onClick: (__VLS_ctx.savePermission)
        };
        __VLS_388.slots.default;
        var __VLS_388;
    }
    var __VLS_368;
    var __VLS_3;
}
else {
    const __VLS_393 = {}.ElMain;
    /** @type {[typeof __VLS_components.ElMain, typeof __VLS_components.elMain, typeof __VLS_components.ElMain, typeof __VLS_components.elMain, ]} */ ;
    // @ts-ignore
    const __VLS_394 = __VLS_asFunctionalComponent(__VLS_393, new __VLS_393({
        ...{ class: "login-page" },
    }));
    const __VLS_395 = __VLS_394({
        ...{ class: "login-page" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_394));
    var __VLS_397 = {};
    __VLS_396.slots.default;
    const __VLS_398 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_399 = __VLS_asFunctionalComponent(__VLS_398, new __VLS_398({
        ...{ class: "login-card" },
    }));
    const __VLS_400 = __VLS_399({
        ...{ class: "login-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_399));
    __VLS_401.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    const __VLS_402 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_403 = __VLS_asFunctionalComponent(__VLS_402, new __VLS_402({
        ...{ 'onSubmit': {} },
    }));
    const __VLS_404 = __VLS_403({
        ...{ 'onSubmit': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_403));
    let __VLS_406;
    let __VLS_407;
    let __VLS_408;
    const __VLS_409 = {
        onSubmit: (__VLS_ctx.login)
    };
    __VLS_405.slots.default;
    const __VLS_410 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_411 = __VLS_asFunctionalComponent(__VLS_410, new __VLS_410({}));
    const __VLS_412 = __VLS_411({}, ...__VLS_functionalComponentArgsRest(__VLS_411));
    __VLS_413.slots.default;
    const __VLS_414 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_415 = __VLS_asFunctionalComponent(__VLS_414, new __VLS_414({
        modelValue: (__VLS_ctx.username),
        placeholder: "用户名",
    }));
    const __VLS_416 = __VLS_415({
        modelValue: (__VLS_ctx.username),
        placeholder: "用户名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_415));
    var __VLS_413;
    const __VLS_418 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_419 = __VLS_asFunctionalComponent(__VLS_418, new __VLS_418({}));
    const __VLS_420 = __VLS_419({}, ...__VLS_functionalComponentArgsRest(__VLS_419));
    __VLS_421.slots.default;
    const __VLS_422 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_423 = __VLS_asFunctionalComponent(__VLS_422, new __VLS_422({
        modelValue: (__VLS_ctx.password),
        type: "password",
        placeholder: "密码",
        showPassword: true,
    }));
    const __VLS_424 = __VLS_423({
        modelValue: (__VLS_ctx.password),
        type: "password",
        placeholder: "密码",
        showPassword: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_423));
    var __VLS_421;
    const __VLS_426 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_427 = __VLS_asFunctionalComponent(__VLS_426, new __VLS_426({
        type: "primary",
        nativeType: "submit",
        ...{ class: "full" },
    }));
    const __VLS_428 = __VLS_427({
        type: "primary",
        nativeType: "submit",
        ...{ class: "full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_427));
    __VLS_429.slots.default;
    var __VLS_429;
    var __VLS_405;
    var __VLS_401;
    var __VLS_396;
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
            newUser: newUser,
            userDialogVisible: userDialogVisible,
            roleDialogVisible: roleDialogVisible,
            newRole: newRole,
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
