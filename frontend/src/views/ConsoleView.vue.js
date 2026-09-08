import { onMounted, onUnmounted, ref } from "vue";
import { useRoute } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { api } from "../api";
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer, } from "../api/customer";
import { fetchUsers, fetchRoles, } from "../api/system";
import { fetchOperationLogs } from "../api/audit";
import CustomerPagination from "../components/CustomerPagination.vue";
import CustomerTable from "../components/CustomerTable.vue";
import CustomerForm from "../components/CustomerForm.vue";
import UserTable from "../components/UserTable.vue";
import RoleTable from "../components/RoleTable.vue";
import OperationLogTable from "../components/OperationLogTable.vue";
import UserForm from "../components/UserForm.vue";
import RoleForm from "../components/RoleForm.vue";
import RolePermissionDialog from "../components/RolePermissionDialog.vue";
import MenuForm from "../components/MenuForm.vue";
const loggedIn = ref(Boolean(localStorage.getItem("moyu_token")));
const route = useRoute();
const username = ref("admin");
const password = ref("admin123");
const customers = ref([]);
const customerTotal = ref(0);
const customerPage = ref(1);
const customerPageSize = ref(10);
const customerKeyword = ref("");
const users = ref([]);
const roles = ref([]);
const logs = ref([]);
const userPage = ref(1);
const userPageSize = ref(10);
const userTotal = ref(0);
const rolePage = ref(1);
const rolePageSize = ref(10);
const roleTotal = ref(0);
const logPage = ref(1);
const logPageSize = ref(10);
const logTotal = ref(0);
const activeView = ref("customers");
const menuView = ref(false);
const newUser = ref({ username: "", password: "" });
const userDialogVisible = ref(false);
const roleDialogVisible = ref(false);
const newRole = ref({ roleCode: "", roleName: "" });
const selectedUserId = ref(null);
const selectedRoleCode = ref("");
const newMenu = ref({
    parentId: 0,
    menuName: "",
    permission: "",
    menuType: "M",
});
const menuDialogVisible = ref(false);
const menus = ref([]);
const selectedMenuIds = ref([]);
const permissionRole = ref(null);
const permissionDialogVisible = ref(false);
const loading = ref(false);
const permissions = ref([]);
const dialogVisible = ref(false);
const editingId = ref(null);
const form = ref({ name: "", contact: "", phone: "", status: "ACTIVE" });
/** 登录并保存访问令牌。 */
async function login() {
    try {
        const response = await api.post("/auth/login", {
            username: username.value,
            password: password.value,
        });
        localStorage.setItem("moyu_token", response.data.data.accessToken);
        loggedIn.value = true;
        await loadCurrentUser();
        await loadCustomers();
    }
    catch {
        ElMessage.error("登录失败，请检查账号和密码");
    }
}
/** 加载当前用户权限。 */
async function loadCurrentUser() {
    try {
        permissions.value = (await api.get("/auth/me")).data.data.permissions;
    }
    catch {
        logout();
        ElMessage.error("用户信息加载失败，请重新登录");
    }
}
/** 判断当前用户是否拥有指定权限。 */
function hasPermission(permission) {
    return permissions.value.includes(permission);
}
/** 查询客户列表。 */
async function loadCustomers() {
    loading.value = true;
    try {
        const result = (await fetchCustomers(customerKeyword.value, customerPage.value, customerPageSize.value)).data.data;
        customers.value = result.items;
        customerTotal.value = result.total;
    }
    catch {
        ElMessage.error("客户数据加载失败");
    }
    finally {
        loading.value = false;
    }
}
/** 查询用户列表。 */
async function loadUsers() {
    try {
        const result = (await fetchUsers(userPage.value, userPageSize.value)).data
            .data;
        users.value = result.items;
        userTotal.value = result.total;
        await loadRoles();
    }
    catch {
        ElMessage.error("用户数据加载失败");
    }
}
/** 查询角色列表。 */
async function loadRoles() {
    try {
        const result = (await fetchRoles(rolePage.value, rolePageSize.value)).data
            .data;
        roles.value = result.items;
        roleTotal.value = result.total;
    }
    catch {
        ElMessage.error("角色数据加载失败");
    }
}
/** 查询操作日志。 */
async function loadLogs() {
    try {
        const result = (await fetchOperationLogs(logPage.value, logPageSize.value))
            .data.data;
        logs.value = result.items;
        logTotal.value = result.total;
    }
    catch {
        ElMessage.error("操作日志加载失败");
    }
}
/** 创建菜单权限。 */
async function createMenu(payload = newMenu.value) {
    try {
        await api.post("/system/menus", payload);
        menuDialogVisible.value = false;
        newMenu.value = {
            parentId: 0,
            menuName: "",
            permission: "",
            menuType: "M",
        };
        ElMessage.success("菜单创建成功");
        await loadMenus();
    }
    catch {
        ElMessage.error("菜单创建失败");
    }
}
/** 查询菜单列表。 */
async function loadMenus() {
    try {
        menus.value = (await api.get("/system/menus")).data.data;
    }
    catch {
        ElMessage.error("菜单加载失败");
    }
}
/** 创建角色。 */
async function createRole(payload = newRole.value) {
    try {
        await api.post("/system/roles", payload);
        roleDialogVisible.value = false;
        newRole.value = { roleCode: "", roleName: "" };
        ElMessage.success("角色创建成功");
        await loadRoles();
    }
    catch {
        ElMessage.error("角色创建失败");
    }
}
/** 打开角色菜单授权弹窗。 */
async function openPermissionDialog(role) {
    try {
        menus.value = (await api.get("/system/menus")).data.data;
        permissionRole.value = role;
        selectedMenuIds.value = (await api.get(`/system/roles/${role.id}/menus`)).data.data;
        permissionDialogVisible.value = true;
    }
    catch {
        ElMessage.error("菜单加载失败");
    }
}
/** 保存角色菜单授权。 */
async function savePermission() {
    if (!permissionRole.value)
        return;
    try {
        await api.put(`/system/roles/${permissionRole.value.id}/menus`, {
            menuIds: selectedMenuIds.value,
        });
        permissionDialogVisible.value = false;
        ElMessage.success("权限保存成功");
    }
    catch {
        ElMessage.error("权限保存失败");
    }
}
/** 创建用户。 */
async function createUser(payload = newUser.value) {
    try {
        await api.post("/system/users", payload);
        userDialogVisible.value = false;
        newUser.value = { username: "", password: "" };
        ElMessage.success("用户创建成功");
        await loadUsers();
    }
    catch {
        ElMessage.error("用户创建失败");
    }
}
/** 切换用户启用状态。 */
async function toggleUser(user) {
    try {
        await api.put(`/system/users/${user.id}/enabled`, null, {
            params: { enabled: !user.enabled },
        });
        await loadUsers();
    }
    catch {
        ElMessage.error("用户状态更新失败");
    }
}
/** 为用户分配角色。 */
async function assignRole(user, roleCode) {
    try {
        await api.put(`/system/users/${user.id}/role`, { roleCode });
        ElMessage.success("角色分配成功");
        await loadUsers();
    }
    catch {
        ElMessage.error("角色分配失败");
    }
}
/** 保存用户角色分配面板中的选择。 */
async function saveSelectedUserRole() {
    const user = users.value.find((item) => item.id === selectedUserId.value);
    if (user && selectedRoleCode.value)
        await assignRole(user, selectedRoleCode.value);
}
/** 打开客户新增或编辑弹窗。 */
function openCustomerForm(customer) {
    editingId.value = customer?.id ?? null;
    form.value = customer
        ? {
            name: customer.name,
            contact: customer.contact,
            phone: customer.phone,
            status: customer.status,
        }
        : { name: "", contact: "", phone: "", status: "ACTIVE" };
    dialogVisible.value = true;
}
/** 保存客户信息。 */
async function saveCustomer(payload = form.value) {
    try {
        if (!payload.name.trim()) {
            ElMessage.warning("客户名称不能为空");
            return;
        }
        if (payload.phone && !/^1\d{10}$/.test(payload.phone)) {
            ElMessage.warning("请输入正确的手机号");
            return;
        }
        if (editingId.value)
            await updateCustomer(editingId.value, payload);
        else
            await createCustomer(payload);
        dialogVisible.value = false;
        ElMessage.success("保存成功");
        await loadCustomers();
    }
    catch {
        ElMessage.error("保存失败，请检查输入内容");
    }
}
/** 删除客户。 */
async function removeCustomer(customer) {
    try {
        await ElMessageBox.confirm(`确定删除客户“${customer.name}”吗？`, "删除确认", { type: "warning" });
        await deleteCustomer(customer.id);
        ElMessage.success("删除成功");
        await loadCustomers();
    }
    catch (error) {
        if (error !== "cancel" && error !== "close")
            ElMessage.error("删除失败");
    }
}
/** 退出当前登录。 */
function logout() {
    localStorage.removeItem("moyu_token");
    permissions.value = [];
    loggedIn.value = false;
}
/** 刷新页面后恢复当前登录状态。 */
onMounted(async () => {
    if (route.name === 'users' || route.name === 'roles' || route.name === 'logs')
        activeView.value = route.name;
    if (route.name === 'menus')
        menuView.value = true;
    window.addEventListener("moyu:unauthorized", logout);
    if (loggedIn.value) {
        await loadCurrentUser();
        await loadCustomers();
    }
});
onUnmounted(() => window.removeEventListener("moyu:unauthorized", logout));
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
            type: (__VLS_ctx.activeView === 'customers' && !__VLS_ctx.menuView
                ? 'primary'
                : 'default'),
        }));
        const __VLS_26 = __VLS_25({
            ...{ 'onClick': {} },
            type: (__VLS_ctx.activeView === 'customers' && !__VLS_ctx.menuView
                ? 'primary'
                : 'default'),
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
                ;
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
                    ;
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
                    ;
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
                    ;
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
                    ;
                }
            };
            __VLS_59.slots.default;
            var __VLS_59;
        }
        if (!__VLS_ctx.menuView &&
            __VLS_ctx.activeView === 'customers' &&
            __VLS_ctx.hasPermission('customer:write')) {
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
                    if (!(!__VLS_ctx.menuView &&
                        __VLS_ctx.activeView === 'customers' &&
                        __VLS_ctx.hasPermission('customer:write')))
                        return;
                    __VLS_ctx.openCustomerForm();
                }
            };
            __VLS_67.slots.default;
            var __VLS_67;
        }
        if (!__VLS_ctx.menuView &&
            __VLS_ctx.activeView === 'users' &&
            __VLS_ctx.hasPermission('system:user:write')) {
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
                    if (!(!__VLS_ctx.menuView &&
                        __VLS_ctx.activeView === 'users' &&
                        __VLS_ctx.hasPermission('system:user:write')))
                        return;
                    __VLS_ctx.userDialogVisible = true;
                }
            };
            __VLS_75.slots.default;
            var __VLS_75;
        }
        if (!__VLS_ctx.menuView &&
            __VLS_ctx.activeView === 'roles' &&
            __VLS_ctx.hasPermission('system:user:write')) {
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
                    if (!(!__VLS_ctx.menuView &&
                        __VLS_ctx.activeView === 'roles' &&
                        __VLS_ctx.hasPermission('system:user:write')))
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
            (scope.row.enabled ? "启用" : "禁用");
            var __VLS_123;
        }
        var __VLS_119;
        var __VLS_99;
    }
    else if (__VLS_ctx.activeView === 'customers') {
        /** @type {[typeof CustomerTable, ]} */ ;
        // @ts-ignore
        const __VLS_124 = __VLS_asFunctionalComponent(CustomerTable, new CustomerTable({
            ...{ 'onEdit': {} },
            ...{ 'onDelete': {} },
            customers: (__VLS_ctx.customers),
            loading: (__VLS_ctx.loading),
            canWrite: (__VLS_ctx.hasPermission('customer:write')),
        }));
        const __VLS_125 = __VLS_124({
            ...{ 'onEdit': {} },
            ...{ 'onDelete': {} },
            customers: (__VLS_ctx.customers),
            loading: (__VLS_ctx.loading),
            canWrite: (__VLS_ctx.hasPermission('customer:write')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_124));
        let __VLS_127;
        let __VLS_128;
        let __VLS_129;
        const __VLS_130 = {
            onEdit: (__VLS_ctx.openCustomerForm)
        };
        const __VLS_131 = {
            onDelete: (__VLS_ctx.removeCustomer)
        };
        var __VLS_126;
    }
    else if (__VLS_ctx.activeView === 'users') {
        /** @type {[typeof UserTable, ]} */ ;
        // @ts-ignore
        const __VLS_132 = __VLS_asFunctionalComponent(UserTable, new UserTable({
            ...{ 'onToggle': {} },
            users: (__VLS_ctx.users),
            canWrite: (__VLS_ctx.hasPermission('system:user:write')),
        }));
        const __VLS_133 = __VLS_132({
            ...{ 'onToggle': {} },
            users: (__VLS_ctx.users),
            canWrite: (__VLS_ctx.hasPermission('system:user:write')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_132));
        let __VLS_135;
        let __VLS_136;
        let __VLS_137;
        const __VLS_138 = {
            onToggle: (__VLS_ctx.toggleUser)
        };
        var __VLS_134;
    }
    else if (__VLS_ctx.activeView === 'roles') {
        /** @type {[typeof RoleTable, ]} */ ;
        // @ts-ignore
        const __VLS_139 = __VLS_asFunctionalComponent(RoleTable, new RoleTable({
            ...{ 'onPermission': {} },
            roles: (__VLS_ctx.roles),
            canWrite: (__VLS_ctx.hasPermission('system:user:write')),
        }));
        const __VLS_140 = __VLS_139({
            ...{ 'onPermission': {} },
            roles: (__VLS_ctx.roles),
            canWrite: (__VLS_ctx.hasPermission('system:user:write')),
        }, ...__VLS_functionalComponentArgsRest(__VLS_139));
        let __VLS_142;
        let __VLS_143;
        let __VLS_144;
        const __VLS_145 = {
            onPermission: (__VLS_ctx.openPermissionDialog)
        };
        var __VLS_141;
    }
    else {
        /** @type {[typeof OperationLogTable, ]} */ ;
        // @ts-ignore
        const __VLS_146 = __VLS_asFunctionalComponent(OperationLogTable, new OperationLogTable({
            logs: (__VLS_ctx.logs),
        }));
        const __VLS_147 = __VLS_146({
            logs: (__VLS_ctx.logs),
        }, ...__VLS_functionalComponentArgsRest(__VLS_146));
    }
    var __VLS_23;
    var __VLS_19;
    /** @type {[typeof CustomerForm, ]} */ ;
    // @ts-ignore
    const __VLS_149 = __VLS_asFunctionalComponent(CustomerForm, new CustomerForm({
        ...{ 'onSave': {} },
        modelValue: (__VLS_ctx.dialogVisible),
        customer: (__VLS_ctx.editingId ? __VLS_ctx.customers.find((item) => item.id === __VLS_ctx.editingId) : null),
    }));
    const __VLS_150 = __VLS_149({
        ...{ 'onSave': {} },
        modelValue: (__VLS_ctx.dialogVisible),
        customer: (__VLS_ctx.editingId ? __VLS_ctx.customers.find((item) => item.id === __VLS_ctx.editingId) : null),
    }, ...__VLS_functionalComponentArgsRest(__VLS_149));
    let __VLS_152;
    let __VLS_153;
    let __VLS_154;
    const __VLS_155 = {
        onSave: (__VLS_ctx.saveCustomer)
    };
    var __VLS_151;
    /** @type {[typeof UserForm, ]} */ ;
    // @ts-ignore
    const __VLS_156 = __VLS_asFunctionalComponent(UserForm, new UserForm({
        ...{ 'onSave': {} },
        modelValue: (__VLS_ctx.userDialogVisible),
    }));
    const __VLS_157 = __VLS_156({
        ...{ 'onSave': {} },
        modelValue: (__VLS_ctx.userDialogVisible),
    }, ...__VLS_functionalComponentArgsRest(__VLS_156));
    let __VLS_159;
    let __VLS_160;
    let __VLS_161;
    const __VLS_162 = {
        onSave: (__VLS_ctx.createUser)
    };
    var __VLS_158;
    /** @type {[typeof RoleForm, ]} */ ;
    // @ts-ignore
    const __VLS_163 = __VLS_asFunctionalComponent(RoleForm, new RoleForm({
        ...{ 'onSave': {} },
        modelValue: (__VLS_ctx.roleDialogVisible),
    }));
    const __VLS_164 = __VLS_163({
        ...{ 'onSave': {} },
        modelValue: (__VLS_ctx.roleDialogVisible),
    }, ...__VLS_functionalComponentArgsRest(__VLS_163));
    let __VLS_166;
    let __VLS_167;
    let __VLS_168;
    const __VLS_169 = {
        onSave: (__VLS_ctx.createRole)
    };
    var __VLS_165;
    /** @type {[typeof RolePermissionDialog, ]} */ ;
    // @ts-ignore
    const __VLS_170 = __VLS_asFunctionalComponent(RolePermissionDialog, new RolePermissionDialog({
        ...{ 'onSave': {} },
        modelValue: (__VLS_ctx.permissionDialogVisible),
        role: (__VLS_ctx.permissionRole),
        menus: (__VLS_ctx.menus),
        selectedIds: (__VLS_ctx.selectedMenuIds),
    }));
    const __VLS_171 = __VLS_170({
        ...{ 'onSave': {} },
        modelValue: (__VLS_ctx.permissionDialogVisible),
        role: (__VLS_ctx.permissionRole),
        menus: (__VLS_ctx.menus),
        selectedIds: (__VLS_ctx.selectedMenuIds),
    }, ...__VLS_functionalComponentArgsRest(__VLS_170));
    let __VLS_173;
    let __VLS_174;
    let __VLS_175;
    const __VLS_176 = {
        onSave: (__VLS_ctx.savePermission)
    };
    var __VLS_172;
    /** @type {[typeof MenuForm, ]} */ ;
    // @ts-ignore
    const __VLS_177 = __VLS_asFunctionalComponent(MenuForm, new MenuForm({
        ...{ 'onSave': {} },
        modelValue: (__VLS_ctx.menuDialogVisible),
    }));
    const __VLS_178 = __VLS_177({
        ...{ 'onSave': {} },
        modelValue: (__VLS_ctx.menuDialogVisible),
    }, ...__VLS_functionalComponentArgsRest(__VLS_177));
    let __VLS_180;
    let __VLS_181;
    let __VLS_182;
    const __VLS_183 = {
        onSave: (__VLS_ctx.createMenu)
    };
    var __VLS_179;
    var __VLS_3;
}
else {
    const __VLS_184 = {}.ElMain;
    /** @type {[typeof __VLS_components.ElMain, typeof __VLS_components.elMain, typeof __VLS_components.ElMain, typeof __VLS_components.elMain, ]} */ ;
    // @ts-ignore
    const __VLS_185 = __VLS_asFunctionalComponent(__VLS_184, new __VLS_184({
        ...{ class: "login-page" },
    }));
    const __VLS_186 = __VLS_185({
        ...{ class: "login-page" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_185));
    __VLS_187.slots.default;
    const __VLS_188 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_189 = __VLS_asFunctionalComponent(__VLS_188, new __VLS_188({
        ...{ class: "login-card" },
    }));
    const __VLS_190 = __VLS_189({
        ...{ class: "login-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_189));
    __VLS_191.slots.default;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    const __VLS_192 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_193 = __VLS_asFunctionalComponent(__VLS_192, new __VLS_192({
        ...{ 'onSubmit': {} },
    }));
    const __VLS_194 = __VLS_193({
        ...{ 'onSubmit': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_193));
    let __VLS_196;
    let __VLS_197;
    let __VLS_198;
    const __VLS_199 = {
        onSubmit: (__VLS_ctx.login)
    };
    __VLS_195.slots.default;
    const __VLS_200 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_201 = __VLS_asFunctionalComponent(__VLS_200, new __VLS_200({}));
    const __VLS_202 = __VLS_201({}, ...__VLS_functionalComponentArgsRest(__VLS_201));
    __VLS_203.slots.default;
    const __VLS_204 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_205 = __VLS_asFunctionalComponent(__VLS_204, new __VLS_204({
        modelValue: (__VLS_ctx.username),
        placeholder: "用户名",
    }));
    const __VLS_206 = __VLS_205({
        modelValue: (__VLS_ctx.username),
        placeholder: "用户名",
    }, ...__VLS_functionalComponentArgsRest(__VLS_205));
    var __VLS_203;
    const __VLS_208 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_209 = __VLS_asFunctionalComponent(__VLS_208, new __VLS_208({}));
    const __VLS_210 = __VLS_209({}, ...__VLS_functionalComponentArgsRest(__VLS_209));
    __VLS_211.slots.default;
    const __VLS_212 = {}.ElInput;
    /** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
    // @ts-ignore
    const __VLS_213 = __VLS_asFunctionalComponent(__VLS_212, new __VLS_212({
        modelValue: (__VLS_ctx.password),
        type: "password",
        placeholder: "密码",
        showPassword: true,
    }));
    const __VLS_214 = __VLS_213({
        modelValue: (__VLS_ctx.password),
        type: "password",
        placeholder: "密码",
        showPassword: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_213));
    var __VLS_211;
    const __VLS_216 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_217 = __VLS_asFunctionalComponent(__VLS_216, new __VLS_216({
        type: "primary",
        nativeType: "submit",
        ...{ class: "full" },
    }));
    const __VLS_218 = __VLS_217({
        type: "primary",
        nativeType: "submit",
        ...{ class: "full" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_217));
    __VLS_219.slots.default;
    var __VLS_219;
    var __VLS_195;
    var __VLS_191;
    var __VLS_187;
}
if (__VLS_ctx.loggedIn &&
    !__VLS_ctx.menuView &&
    __VLS_ctx.activeView === 'users' &&
    __VLS_ctx.hasPermission('system:user:write')) {
    const __VLS_220 = {}.ElCard;
    /** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
    // @ts-ignore
    const __VLS_221 = __VLS_asFunctionalComponent(__VLS_220, new __VLS_220({
        ...{ class: "role-assignment-card" },
    }));
    const __VLS_222 = __VLS_221({
        ...{ class: "role-assignment-card" },
    }, ...__VLS_functionalComponentArgsRest(__VLS_221));
    __VLS_223.slots.default;
    {
        const { header: __VLS_thisSlot } = __VLS_223.slots;
    }
    const __VLS_224 = {}.ElForm;
    /** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
    // @ts-ignore
    const __VLS_225 = __VLS_asFunctionalComponent(__VLS_224, new __VLS_224({
        inline: true,
    }));
    const __VLS_226 = __VLS_225({
        inline: true,
    }, ...__VLS_functionalComponentArgsRest(__VLS_225));
    __VLS_227.slots.default;
    const __VLS_228 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_229 = __VLS_asFunctionalComponent(__VLS_228, new __VLS_228({
        label: "用户",
    }));
    const __VLS_230 = __VLS_229({
        label: "用户",
    }, ...__VLS_functionalComponentArgsRest(__VLS_229));
    __VLS_231.slots.default;
    const __VLS_232 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_233 = __VLS_asFunctionalComponent(__VLS_232, new __VLS_232({
        modelValue: (__VLS_ctx.selectedUserId),
        placeholder: "请选择用户",
        ...{ style: {} },
    }));
    const __VLS_234 = __VLS_233({
        modelValue: (__VLS_ctx.selectedUserId),
        placeholder: "请选择用户",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_233));
    __VLS_235.slots.default;
    for (const [user] of __VLS_getVForSourceType((__VLS_ctx.users))) {
        const __VLS_236 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_237 = __VLS_asFunctionalComponent(__VLS_236, new __VLS_236({
            key: (user.id),
            label: (user.username),
            value: (user.id),
        }));
        const __VLS_238 = __VLS_237({
            key: (user.id),
            label: (user.username),
            value: (user.id),
        }, ...__VLS_functionalComponentArgsRest(__VLS_237));
    }
    var __VLS_235;
    var __VLS_231;
    const __VLS_240 = {}.ElFormItem;
    /** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
    // @ts-ignore
    const __VLS_241 = __VLS_asFunctionalComponent(__VLS_240, new __VLS_240({
        label: "角色",
    }));
    const __VLS_242 = __VLS_241({
        label: "角色",
    }, ...__VLS_functionalComponentArgsRest(__VLS_241));
    __VLS_243.slots.default;
    const __VLS_244 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_245 = __VLS_asFunctionalComponent(__VLS_244, new __VLS_244({
        modelValue: (__VLS_ctx.selectedRoleCode),
        placeholder: "请选择角色",
        ...{ style: {} },
    }));
    const __VLS_246 = __VLS_245({
        modelValue: (__VLS_ctx.selectedRoleCode),
        placeholder: "请选择角色",
        ...{ style: {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_245));
    __VLS_247.slots.default;
    for (const [role] of __VLS_getVForSourceType((__VLS_ctx.roles))) {
        const __VLS_248 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_249 = __VLS_asFunctionalComponent(__VLS_248, new __VLS_248({
            key: (role.roleCode),
            label: (role.roleName),
            value: (role.roleCode),
        }));
        const __VLS_250 = __VLS_249({
            key: (role.roleCode),
            label: (role.roleName),
            value: (role.roleCode),
        }, ...__VLS_functionalComponentArgsRest(__VLS_249));
    }
    var __VLS_247;
    var __VLS_243;
    const __VLS_252 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_253 = __VLS_asFunctionalComponent(__VLS_252, new __VLS_252({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (__VLS_ctx.selectedUserId === null || !__VLS_ctx.selectedRoleCode),
    }));
    const __VLS_254 = __VLS_253({
        ...{ 'onClick': {} },
        type: "primary",
        disabled: (__VLS_ctx.selectedUserId === null || !__VLS_ctx.selectedRoleCode),
    }, ...__VLS_functionalComponentArgsRest(__VLS_253));
    let __VLS_256;
    let __VLS_257;
    let __VLS_258;
    const __VLS_259 = {
        onClick: (__VLS_ctx.saveSelectedUserRole)
    };
    __VLS_255.slots.default;
    var __VLS_255;
    var __VLS_227;
    var __VLS_223;
}
if (__VLS_ctx.loggedIn && !__VLS_ctx.menuView && __VLS_ctx.activeView === 'customers') {
    /** @type {[typeof CustomerPagination, ]} */ ;
    // @ts-ignore
    const __VLS_260 = __VLS_asFunctionalComponent(CustomerPagination, new CustomerPagination({
        ...{ 'onUpdate:page': {} },
        ...{ 'onUpdate:size': {} },
        page: (__VLS_ctx.customerPage),
        size: (__VLS_ctx.customerPageSize),
        total: (__VLS_ctx.customerTotal),
    }));
    const __VLS_261 = __VLS_260({
        ...{ 'onUpdate:page': {} },
        ...{ 'onUpdate:size': {} },
        page: (__VLS_ctx.customerPage),
        size: (__VLS_ctx.customerPageSize),
        total: (__VLS_ctx.customerTotal),
    }, ...__VLS_functionalComponentArgsRest(__VLS_260));
    let __VLS_263;
    let __VLS_264;
    let __VLS_265;
    const __VLS_266 = {
        'onUpdate:page': (...[$event]) => {
            if (!(__VLS_ctx.loggedIn && !__VLS_ctx.menuView && __VLS_ctx.activeView === 'customers'))
                return;
            __VLS_ctx.customerPage = $event;
            __VLS_ctx.loadCustomers();
            ;
        }
    };
    const __VLS_267 = {
        'onUpdate:size': (...[$event]) => {
            if (!(__VLS_ctx.loggedIn && !__VLS_ctx.menuView && __VLS_ctx.activeView === 'customers'))
                return;
            __VLS_ctx.customerPageSize = $event;
            __VLS_ctx.customerPage = 1;
            __VLS_ctx.loadCustomers();
            ;
        }
    };
    var __VLS_262;
}
if (__VLS_ctx.loggedIn && !__VLS_ctx.menuView && __VLS_ctx.activeView === 'users') {
    const __VLS_268 = {}.ElPagination;
    /** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
    // @ts-ignore
    const __VLS_269 = __VLS_asFunctionalComponent(__VLS_268, new __VLS_268({
        ...{ 'onCurrentChange': {} },
        ...{ 'onSizeChange': {} },
        currentPage: (__VLS_ctx.userPage),
        pageSize: (__VLS_ctx.userPageSize),
        layout: "total, sizes, prev, pager, next",
        pageSizes: ([10, 20, 50]),
        total: (__VLS_ctx.userTotal),
    }));
    const __VLS_270 = __VLS_269({
        ...{ 'onCurrentChange': {} },
        ...{ 'onSizeChange': {} },
        currentPage: (__VLS_ctx.userPage),
        pageSize: (__VLS_ctx.userPageSize),
        layout: "total, sizes, prev, pager, next",
        pageSizes: ([10, 20, 50]),
        total: (__VLS_ctx.userTotal),
    }, ...__VLS_functionalComponentArgsRest(__VLS_269));
    let __VLS_272;
    let __VLS_273;
    let __VLS_274;
    const __VLS_275 = {
        onCurrentChange: (__VLS_ctx.loadUsers)
    };
    const __VLS_276 = {
        onSizeChange: (__VLS_ctx.loadUsers)
    };
    var __VLS_271;
}
if (__VLS_ctx.loggedIn && !__VLS_ctx.menuView && __VLS_ctx.activeView === 'roles') {
    const __VLS_277 = {}.ElPagination;
    /** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
    // @ts-ignore
    const __VLS_278 = __VLS_asFunctionalComponent(__VLS_277, new __VLS_277({
        ...{ 'onCurrentChange': {} },
        ...{ 'onSizeChange': {} },
        currentPage: (__VLS_ctx.rolePage),
        pageSize: (__VLS_ctx.rolePageSize),
        layout: "total, sizes, prev, pager, next",
        pageSizes: ([10, 20, 50]),
        total: (__VLS_ctx.roleTotal),
    }));
    const __VLS_279 = __VLS_278({
        ...{ 'onCurrentChange': {} },
        ...{ 'onSizeChange': {} },
        currentPage: (__VLS_ctx.rolePage),
        pageSize: (__VLS_ctx.rolePageSize),
        layout: "total, sizes, prev, pager, next",
        pageSizes: ([10, 20, 50]),
        total: (__VLS_ctx.roleTotal),
    }, ...__VLS_functionalComponentArgsRest(__VLS_278));
    let __VLS_281;
    let __VLS_282;
    let __VLS_283;
    const __VLS_284 = {
        onCurrentChange: (__VLS_ctx.loadRoles)
    };
    const __VLS_285 = {
        onSizeChange: (__VLS_ctx.loadRoles)
    };
    var __VLS_280;
}
if (__VLS_ctx.loggedIn && !__VLS_ctx.menuView && __VLS_ctx.activeView === 'logs') {
    const __VLS_286 = {}.ElPagination;
    /** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
    // @ts-ignore
    const __VLS_287 = __VLS_asFunctionalComponent(__VLS_286, new __VLS_286({
        ...{ 'onCurrentChange': {} },
        ...{ 'onSizeChange': {} },
        currentPage: (__VLS_ctx.logPage),
        pageSize: (__VLS_ctx.logPageSize),
        layout: "total, sizes, prev, pager, next",
        pageSizes: ([10, 20, 50]),
        total: (__VLS_ctx.logTotal),
    }));
    const __VLS_288 = __VLS_287({
        ...{ 'onCurrentChange': {} },
        ...{ 'onSizeChange': {} },
        currentPage: (__VLS_ctx.logPage),
        pageSize: (__VLS_ctx.logPageSize),
        layout: "total, sizes, prev, pager, next",
        pageSizes: ([10, 20, 50]),
        total: (__VLS_ctx.logTotal),
    }, ...__VLS_functionalComponentArgsRest(__VLS_287));
    let __VLS_290;
    let __VLS_291;
    let __VLS_292;
    const __VLS_293 = {
        onCurrentChange: (__VLS_ctx.loadLogs)
    };
    const __VLS_294 = {
        onSizeChange: (__VLS_ctx.loadLogs)
    };
    var __VLS_289;
}
/** @type {__VLS_StyleScopedClasses['layout']} */ ;
/** @type {__VLS_StyleScopedClasses['brand']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['login-page']} */ ;
/** @type {__VLS_StyleScopedClasses['login-card']} */ ;
/** @type {__VLS_StyleScopedClasses['full']} */ ;
/** @type {__VLS_StyleScopedClasses['role-assignment-card']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CustomerPagination: CustomerPagination,
            CustomerTable: CustomerTable,
            CustomerForm: CustomerForm,
            UserTable: UserTable,
            RoleTable: RoleTable,
            OperationLogTable: OperationLogTable,
            UserForm: UserForm,
            RoleForm: RoleForm,
            RolePermissionDialog: RolePermissionDialog,
            MenuForm: MenuForm,
            loggedIn: loggedIn,
            username: username,
            password: password,
            customers: customers,
            customerTotal: customerTotal,
            customerPage: customerPage,
            customerPageSize: customerPageSize,
            users: users,
            roles: roles,
            logs: logs,
            userPage: userPage,
            userPageSize: userPageSize,
            userTotal: userTotal,
            rolePage: rolePage,
            rolePageSize: rolePageSize,
            roleTotal: roleTotal,
            logPage: logPage,
            logPageSize: logPageSize,
            logTotal: logTotal,
            activeView: activeView,
            menuView: menuView,
            userDialogVisible: userDialogVisible,
            roleDialogVisible: roleDialogVisible,
            selectedUserId: selectedUserId,
            selectedRoleCode: selectedRoleCode,
            menuDialogVisible: menuDialogVisible,
            menus: menus,
            selectedMenuIds: selectedMenuIds,
            permissionRole: permissionRole,
            permissionDialogVisible: permissionDialogVisible,
            loading: loading,
            dialogVisible: dialogVisible,
            editingId: editingId,
            login: login,
            hasPermission: hasPermission,
            loadCustomers: loadCustomers,
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
