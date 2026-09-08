import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { api } from '../../api';
import { fetchRoles } from '../../api/system';
import RoleTable from '../../components/RoleTable.vue';
import RoleForm from '../../components/RoleForm.vue';
import RolePermissionDialog from '../../components/RolePermissionDialog.vue';
import CustomerPagination from '../../components/CustomerPagination.vue';
import { useAuthStore } from '../../stores/auth';
const auth = useAuthStore();
const roles = ref([]);
const menus = ref([]);
const page = ref(1);
const size = ref(10);
const total = ref(0);
const form = ref(false);
const permission = ref(false);
const role = ref(null);
const selected = ref([]);
async function load() { try {
    const r = (await fetchRoles(page.value, size.value)).data.data;
    roles.value = r.items;
    total.value = r.total;
}
catch {
    ElMessage.error('角色数据加载失败');
} }
async function create(payload) { try {
    await api.post('/system/roles', payload);
    form.value = false;
    ElMessage.success('角色创建成功');
    await load();
}
catch {
    ElMessage.error('角色创建失败');
} }
async function open(r) { role.value = r; menus.value = (await api.get('/system/menus')).data.data; selected.value = (await api.get(`/system/roles/${r.id}/menus`)).data.data; permission.value = true; }
async function save() { if (!role.value)
    return; try {
    await api.put(`/system/roles/${role.value.id}/menus`, { menuIds: selected.value });
    permission.value = false;
    ElMessage.success('权限保存成功');
}
catch {
    ElMessage.error('权限保存失败');
} }
onMounted(async () => { try {
    auth.setPermissions((await api.get('/auth/me')).data.data.permissions);
}
catch { } await load(); });
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
                __VLS_ctx.form = true;
            }
        };
        __VLS_7.slots.default;
        var __VLS_7;
    }
}
/** @type {[typeof RoleTable, ]} */ ;
// @ts-ignore
const __VLS_12 = __VLS_asFunctionalComponent(RoleTable, new RoleTable({
    ...{ 'onPermission': {} },
    roles: (__VLS_ctx.roles),
    canWrite: (__VLS_ctx.auth.hasPermission('system:user:write')),
}));
const __VLS_13 = __VLS_12({
    ...{ 'onPermission': {} },
    roles: (__VLS_ctx.roles),
    canWrite: (__VLS_ctx.auth.hasPermission('system:user:write')),
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
let __VLS_15;
let __VLS_16;
let __VLS_17;
const __VLS_18 = {
    onPermission: (__VLS_ctx.open)
};
var __VLS_14;
/** @type {[typeof CustomerPagination, ]} */ ;
// @ts-ignore
const __VLS_19 = __VLS_asFunctionalComponent(CustomerPagination, new CustomerPagination({
    ...{ 'onUpdate:page': {} },
    ...{ 'onUpdate:size': {} },
    page: (__VLS_ctx.page),
    size: (__VLS_ctx.size),
    total: (__VLS_ctx.total),
}));
const __VLS_20 = __VLS_19({
    ...{ 'onUpdate:page': {} },
    ...{ 'onUpdate:size': {} },
    page: (__VLS_ctx.page),
    size: (__VLS_ctx.size),
    total: (__VLS_ctx.total),
}, ...__VLS_functionalComponentArgsRest(__VLS_19));
let __VLS_22;
let __VLS_23;
let __VLS_24;
const __VLS_25 = {
    'onUpdate:page': (...[$event]) => {
        __VLS_ctx.page = $event;
        __VLS_ctx.load();
    }
};
const __VLS_26 = {
    'onUpdate:size': (...[$event]) => {
        __VLS_ctx.size = $event;
        __VLS_ctx.page = 1;
        __VLS_ctx.load();
    }
};
var __VLS_21;
var __VLS_3;
/** @type {[typeof RoleForm, ]} */ ;
// @ts-ignore
const __VLS_27 = __VLS_asFunctionalComponent(RoleForm, new RoleForm({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.form),
}));
const __VLS_28 = __VLS_27({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.form),
}, ...__VLS_functionalComponentArgsRest(__VLS_27));
let __VLS_30;
let __VLS_31;
let __VLS_32;
const __VLS_33 = {
    onSave: (__VLS_ctx.create)
};
var __VLS_29;
/** @type {[typeof RolePermissionDialog, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(RolePermissionDialog, new RolePermissionDialog({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.permission),
    role: (__VLS_ctx.role),
    menus: (__VLS_ctx.menus),
    selectedIds: (__VLS_ctx.selected),
}));
const __VLS_35 = __VLS_34({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.permission),
    role: (__VLS_ctx.role),
    menus: (__VLS_ctx.menus),
    selectedIds: (__VLS_ctx.selected),
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
let __VLS_37;
let __VLS_38;
let __VLS_39;
const __VLS_40 = {
    onSave: (__VLS_ctx.save)
};
var __VLS_36;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            RoleTable: RoleTable,
            RoleForm: RoleForm,
            RolePermissionDialog: RolePermissionDialog,
            CustomerPagination: CustomerPagination,
            auth: auth,
            roles: roles,
            menus: menus,
            page: page,
            size: size,
            total: total,
            form: form,
            permission: permission,
            role: role,
            selected: selected,
            load: load,
            create: create,
            open: open,
            save: save,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
