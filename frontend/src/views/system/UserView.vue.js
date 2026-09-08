import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { api } from '../../api';
import { fetchUsers, fetchRoles, assignUserRole } from '../../api/system';
import UserTable from '../../components/UserTable.vue';
import UserForm from '../../components/UserForm.vue';
import CustomerPagination from '../../components/CustomerPagination.vue';
import { useAuthStore } from '../../stores/auth';
const auth = useAuthStore();
const users = ref([]);
const roles = ref([]);
const page = ref(1);
const size = ref(10);
const total = ref(0);
const dialog = ref(false);
async function load() { try {
    const [u, r] = await Promise.all([fetchUsers(page.value, size.value), fetchRoles(1, 100)]);
    users.value = u.data.data.items;
    total.value = u.data.data.total;
    roles.value = r.data.data.items;
}
catch {
    ElMessage.error('用户数据加载失败');
} }
async function create(payload) { try {
    await api.post('/system/users', payload);
    dialog.value = false;
    await load();
}
catch {
    ElMessage.error('用户创建失败');
} }
async function toggle(u) { try {
    await api.put(`/system/users/${u.id}/enabled`, null, { params: { enabled: !u.enabled } });
    await load();
}
catch {
    ElMessage.error('状态更新失败');
} }
async function assignRole(u, c) { try {
    await assignUserRole(u.id, c);
    await load();
}
catch {
    ElMessage.error('角色分配失败');
} }
onMounted(load);
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
    users: (__VLS_ctx.users),
    roles: (__VLS_ctx.roles),
    canWrite: (__VLS_ctx.auth.hasPermission('system:user:write')),
}));
const __VLS_13 = __VLS_12({
    ...{ 'onToggle': {} },
    ...{ 'onAssignRole': {} },
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
var __VLS_14;
/** @type {[typeof CustomerPagination, ]} */ ;
// @ts-ignore
const __VLS_20 = __VLS_asFunctionalComponent(CustomerPagination, new CustomerPagination({
    ...{ 'onUpdate:page': {} },
    ...{ 'onUpdate:size': {} },
    page: (__VLS_ctx.page),
    size: (__VLS_ctx.size),
    total: (__VLS_ctx.total),
}));
const __VLS_21 = __VLS_20({
    ...{ 'onUpdate:page': {} },
    ...{ 'onUpdate:size': {} },
    page: (__VLS_ctx.page),
    size: (__VLS_ctx.size),
    total: (__VLS_ctx.total),
}, ...__VLS_functionalComponentArgsRest(__VLS_20));
let __VLS_23;
let __VLS_24;
let __VLS_25;
const __VLS_26 = {
    'onUpdate:page': (...[$event]) => {
        __VLS_ctx.page = $event;
        __VLS_ctx.load();
    }
};
const __VLS_27 = {
    'onUpdate:size': (...[$event]) => {
        __VLS_ctx.size = $event;
        __VLS_ctx.page = 1;
        __VLS_ctx.load();
    }
};
var __VLS_22;
var __VLS_3;
/** @type {[typeof UserForm, ]} */ ;
// @ts-ignore
const __VLS_28 = __VLS_asFunctionalComponent(UserForm, new UserForm({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.dialog),
}));
const __VLS_29 = __VLS_28({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.dialog),
}, ...__VLS_functionalComponentArgsRest(__VLS_28));
let __VLS_31;
let __VLS_32;
let __VLS_33;
const __VLS_34 = {
    onSave: (__VLS_ctx.create)
};
var __VLS_30;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            UserTable: UserTable,
            UserForm: UserForm,
            CustomerPagination: CustomerPagination,
            auth: auth,
            users: users,
            roles: roles,
            page: page,
            size: size,
            total: total,
            dialog: dialog,
            load: load,
            create: create,
            toggle: toggle,
            assignRole: assignRole,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
