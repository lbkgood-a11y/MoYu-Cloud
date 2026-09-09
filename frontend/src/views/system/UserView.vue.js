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
import { fetchDepartments } from '../../api/department';
const auth = useAuthStore();
const users = ref([]);
const roles = ref([]);
const page = ref(1);
const size = ref(10);
const total = ref(0);
const dialog = ref(false);
const editDialog = ref(false);
const resetDialog = ref(false);
const selectedUser = ref(null);
const departments = ref([]);
async function load() {
    try {
        const [u, r, d] = await Promise.all([fetchUsers(page.value, size.value), fetchRoles(1, 100), fetchDepartments()]);
        users.value = u.data.data.items;
        total.value = u.data.data.total;
        roles.value = r.data.data.items;
        departments.value = d.data.data;
    }
    catch {
        ElMessage.error('用户数据加载失败');
    }
}
async function create(payload) {
    try {
        await api.post('/system/users', payload);
        dialog.value = false;
        await load();
    }
    catch {
        ElMessage.error('用户创建失败');
    }
}
async function toggle(u) {
    try {
        await api.put(`/system/users/${u.id}/enabled`, null, { params: { enabled: !u.enabled } });
        await load();
    }
    catch {
        ElMessage.error('状态更新失败');
    }
}
async function assignRole(u, c) {
    try {
        await assignUserRole(u.id, c);
        await load();
    }
    catch {
        ElMessage.error('角色分配失败');
    }
}
onMounted(load);
/** 打开编辑用户弹窗。 */
function openEdit(user) {
    selectedUser.value = user;
    editDialog.value = true;
}
/** 保存用户资料。 */
async function saveEdit(payload) {
    if (!selectedUser.value)
        return;
    try {
        await updateUser(selectedUser.value.id, payload);
        editDialog.value = false;
        ElMessage.success('用户修改成功');
        await load();
    }
    catch {
        ElMessage.error('用户修改失败');
    }
}
/** 删除用户并执行二次确认。 */
async function remove(user) {
    try {
        await ElMessageBox.confirm(`确定删除用户“${user.username}”吗？`, '删除确认', { type: 'warning' });
        await deleteUser(user.id);
        ElMessage.success('用户删除成功');
        await load();
    }
    catch (error) {
        if (error !== 'cancel' && error !== 'close')
            ElMessage.error('用户删除失败');
    }
}
/** 打开重置密码弹窗。 */
function openReset(user) {
    selectedUser.value = user;
    resetDialog.value = true;
}
/** 保存重置后的密码。 */
async function saveReset(payload) {
    if (!selectedUser.value)
        return;
    try {
        await resetUserPassword(selectedUser.value.id, payload.password);
        resetDialog.value = false;
        ElMessage.success('密码重置成功');
    }
    catch {
        ElMessage.error('密码重置失败');
    }
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_3.slots;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    if (__VLS_ctx.auth.hasPermission('system:user:write')) {
        const __VLS_4 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
            ...{ 'onClick': {} },
            type: "primary",
        }));
        const __VLS_6 = __VLS_5({
            ...{ 'onClick': {} },
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_5));
        let __VLS_8;
        let __VLS_9;
        let __VLS_10;
        const __VLS_11 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.auth.hasPermission('system:user:write')))
                    return;
                __VLS_ctx.dialog = true;
            }
        };
        __VLS_7.slots.default;
        var __VLS_7;
    }
}
/** @type {[typeof UserTable, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(UserTable, new UserTable({
    ...{ 'onToggle': {} },
    ...{ 'onAssignRole': {} },
    ...{ 'onEdit': {} },
    ...{ 'onRemove': {} },
    ...{ 'onResetPassword': {} },
    users: (__VLS_ctx.users),
    roles: (__VLS_ctx.roles),
    canWrite: (__VLS_ctx.auth.hasPermission('system:user:write')),
}));
const __VLS_13 = __VLS_12({
    ...{ 'onToggle': {} },
    ...{ 'onAssignRole': {} },
    ...{ 'onEdit': {} },
    ...{ 'onRemove': {} },
    ...{ 'onResetPassword': {} },
    users: (__VLS_ctx.users),
    roles: (__VLS_ctx.roles),
    canWrite: (__VLS_ctx.auth.hasPermission('system:user:write')),
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
let __VLS_15;
let __VLS_16;
let __VLS_17;
const __VLS_18 = {
    onToggle: (__VLS_ctx.toggle)
};
const __VLS_19 = {
    onAssignRole: (__VLS_ctx.assignRole)
};
const __VLS_20 = {
    onEdit: (__VLS_ctx.openEdit)
};
const __VLS_21 = {
    onRemove: (__VLS_ctx.remove)
};
const __VLS_22 = {
    onResetPassword: (__VLS_ctx.openReset)
};
var __VLS_14;
/** @type {[typeof CustomerPagination, ]} */ ;
// @ts-ignore
const __VLS_23 = __VLS_asFunctionalComponent(CustomerPagination, new CustomerPagination({
    ...{ 'onUpdate:page': {} },
    ...{ 'onUpdate:size': {} },
    page: (__VLS_ctx.page),
    size: (__VLS_ctx.size),
    total: (__VLS_ctx.total),
}));
const __VLS_24 = __VLS_23({
    ...{ 'onUpdate:page': {} },
    ...{ 'onUpdate:size': {} },
    page: (__VLS_ctx.page),
    size: (__VLS_ctx.size),
    total: (__VLS_ctx.total),
}, ...__VLS_functionalComponentArgsRest(__VLS_23));
let __VLS_26;
let __VLS_27;
let __VLS_28;
const __VLS_29 = {
    'onUpdate:page': (...[$event]) => {
        __VLS_ctx.page = $event;
        __VLS_ctx.load();
        ;
    }
};
const __VLS_30 = {
    'onUpdate:size': (...[$event]) => {
        __VLS_ctx.size = $event;
        __VLS_ctx.page = 1;
        __VLS_ctx.load();
        ;
    }
};
var __VLS_25;
var __VLS_3;
/** @type {[typeof UserForm, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(UserForm, new UserForm({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.dialog),
    departments: (__VLS_ctx.departments),
}));
const __VLS_32 = __VLS_31({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.dialog),
    departments: (__VLS_ctx.departments),
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
let __VLS_34;
let __VLS_35;
let __VLS_36;
const __VLS_37 = {
    onSave: (__VLS_ctx.create)
};
var __VLS_33;
/** @type {[typeof UserEditForm, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(UserEditForm, new UserEditForm({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.editDialog),
    user: (__VLS_ctx.selectedUser),
    departments: (__VLS_ctx.departments),
}));
const __VLS_39 = __VLS_38({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.editDialog),
    user: (__VLS_ctx.selectedUser),
    departments: (__VLS_ctx.departments),
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
let __VLS_41;
let __VLS_42;
let __VLS_43;
const __VLS_44 = {
    onSave: (__VLS_ctx.saveEdit)
};
var __VLS_40;
/** @type {[typeof ResetPasswordForm, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(ResetPasswordForm, new ResetPasswordForm({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.resetDialog),
    username: (__VLS_ctx.selectedUser?.username ?? ''),
}));
const __VLS_46 = __VLS_45({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.resetDialog),
    username: (__VLS_ctx.selectedUser?.username ?? ''),
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_48;
let __VLS_49;
let __VLS_50;
const __VLS_51 = {
    onSave: (__VLS_ctx.saveReset)
};
var __VLS_47;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            UserTable: UserTable,
            UserForm: UserForm,
            UserEditForm: UserEditForm,
            ResetPasswordForm: ResetPasswordForm,
            CustomerPagination: CustomerPagination,
            auth: auth,
            users: users,
            roles: roles,
            page: page,
            size: size,
            total: total,
            dialog: dialog,
            editDialog: editDialog,
            resetDialog: resetDialog,
            selectedUser: selectedUser,
            departments: departments,
            load: load,
            create: create,
            toggle: toggle,
            assignRole: assignRole,
            openEdit: openEdit,
            saveEdit: saveEdit,
            remove: remove,
            openReset: openReset,
            saveReset: saveReset,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
