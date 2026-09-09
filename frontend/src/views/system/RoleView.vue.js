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
import { fetchFieldPermissions, saveFieldPermissions } from '../../api/fieldPermission';
const auth = useAuthStore();
const roles = ref([]);
const menus = ref([]);
const page = ref(1);
const size = ref(10);
const total = ref(0);
const form = ref(false);
const editForm = ref(false);
const permission = ref(false);
const role = ref(null);
const selected = ref([]);
const fieldPermission = ref(false);
const fields = ref([]);
async function load() {
    try {
        const r = (await fetchRoles(page.value, size.value)).data.data;
        roles.value = r.items;
        total.value = r.total;
    }
    catch {
        ElMessage.error('角色数据加载失败');
    }
}
async function create(payload) {
    try {
        await api.post('/system/roles', payload);
        form.value = false;
        ElMessage.success('角色创建成功');
        await load();
    }
    catch {
        ElMessage.error('角色创建失败');
    }
}
async function open(r) {
    role.value = r;
    menus.value = (await api.get('/system/menus')).data.data;
    selected.value = (await api.get(`/system/roles/${r.id}/menus`)).data.data;
    permission.value = true;
}
async function openFieldPermissions(r) { role.value = r; fields.value = (await fetchFieldPermissions(r.id)).data.data; if (!fields.value.length)
    fields.value = ['name', 'contact', 'phone', 'status', 'department'].map(fieldCode => ({ fieldCode, readable: true, writable: false, maskStrategy: fieldCode === 'phone' ? 'PHONE' : 'NONE' })); fieldPermission.value = true; }
async function saveFields() { if (!role.value)
    return; await saveFieldPermissions(role.value.id, fields.value); fieldPermission.value = false; ElMessage.success('列权限保存成功'); }
async function save() {
    if (!role.value)
        return;
    try {
        await api.put(`/system/roles/${role.value.id}/menus`, { menuIds: selected.value });
        permission.value = false;
        ElMessage.success('权限保存成功');
    }
    catch {
        ElMessage.error('权限保存失败');
    }
}
/** 打开角色编辑窗口。 */
function openEdit(r) {
    role.value = r;
    editForm.value = true;
}
/** 保存角色名称。 */
async function saveEdit(payload) {
    if (!role.value)
        return;
    try {
        await updateRole(role.value.id, payload.roleName);
        editForm.value = false;
        ElMessage.success('角色修改成功');
        await load();
    }
    catch {
        ElMessage.error('角色修改失败');
    }
}
/** 切换角色状态。 */
async function toggle(r) {
    try {
        await setRoleEnabled(r.id, !r.enabled);
        ElMessage.success('状态更新成功');
        await load();
    }
    catch {
        ElMessage.error('状态更新失败');
    }
}
/** 删除角色。 */
async function remove(r) {
    try {
        await ElMessageBox.confirm(`确定删除角色“${r.roleName}”吗？`, '删除确认', { type: 'warning' });
        await deleteRole(r.id);
        ElMessage.success('角色删除成功');
        await load();
    }
    catch (error) {
        if (error !== 'cancel' && error !== 'close')
            ElMessage.error('角色删除失败');
    }
}
onMounted(async () => {
    try {
        auth.setPermissions((await api.get('/auth/me')).data.data.permissions);
    }
    catch { }
    await load();
});
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
    if (__VLS_ctx.auth.hasPermission('system:role:write')) {
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
                if (!(__VLS_ctx.auth.hasPermission('system:role:write')))
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
    ...{ 'onFieldPermission': {} },
    ...{ 'onEdit': {} },
    ...{ 'onToggle': {} },
    ...{ 'onRemove': {} },
    roles: (__VLS_ctx.roles),
    canWrite: (__VLS_ctx.auth.hasPermission('system:role:write')),
}));
const __VLS_13 = __VLS_12({
    ...{ 'onPermission': {} },
    ...{ 'onFieldPermission': {} },
    ...{ 'onEdit': {} },
    ...{ 'onToggle': {} },
    ...{ 'onRemove': {} },
    roles: (__VLS_ctx.roles),
    canWrite: (__VLS_ctx.auth.hasPermission('system:role:write')),
}, ...__VLS_functionalComponentArgsRest(__VLS_12));
let __VLS_15;
let __VLS_16;
let __VLS_17;
const __VLS_18 = {
    onPermission: (__VLS_ctx.open)
};
const __VLS_19 = {
    onFieldPermission: (__VLS_ctx.openFieldPermissions)
};
const __VLS_20 = {
    onEdit: (__VLS_ctx.openEdit)
};
const __VLS_21 = {
    onToggle: (__VLS_ctx.toggle)
};
const __VLS_22 = {
    onRemove: (__VLS_ctx.remove)
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
/** @type {[typeof RoleForm, ]} */ ;
// @ts-ignore
const __VLS_31 = __VLS_asFunctionalComponent(RoleForm, new RoleForm({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.form),
}));
const __VLS_32 = __VLS_31({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.form),
}, ...__VLS_functionalComponentArgsRest(__VLS_31));
let __VLS_34;
let __VLS_35;
let __VLS_36;
const __VLS_37 = {
    onSave: (__VLS_ctx.create)
};
var __VLS_33;
/** @type {[typeof RoleEditForm, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(RoleEditForm, new RoleEditForm({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.editForm),
    role: (__VLS_ctx.role),
}));
const __VLS_39 = __VLS_38({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.editForm),
    role: (__VLS_ctx.role),
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
let __VLS_41;
let __VLS_42;
let __VLS_43;
const __VLS_44 = {
    onSave: (__VLS_ctx.saveEdit)
};
var __VLS_40;
/** @type {[typeof RolePermissionDialog, ]} */ ;
// @ts-ignore
const __VLS_45 = __VLS_asFunctionalComponent(RolePermissionDialog, new RolePermissionDialog({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.permission),
    role: (__VLS_ctx.role),
    menus: (__VLS_ctx.menus),
    selectedIds: (__VLS_ctx.selected),
}));
const __VLS_46 = __VLS_45({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.permission),
    role: (__VLS_ctx.role),
    menus: (__VLS_ctx.menus),
    selectedIds: (__VLS_ctx.selected),
}, ...__VLS_functionalComponentArgsRest(__VLS_45));
let __VLS_48;
let __VLS_49;
let __VLS_50;
const __VLS_51 = {
    onSave: (__VLS_ctx.save)
};
var __VLS_47;
const __VLS_52 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
    modelValue: (__VLS_ctx.fieldPermission),
    title: (`客户列权限 - ${__VLS_ctx.role?.roleName ?? ''}`),
    width: "720px",
}));
const __VLS_54 = __VLS_53({
    modelValue: (__VLS_ctx.fieldPermission),
    title: (`客户列权限 - ${__VLS_ctx.role?.roleName ?? ''}`),
    width: "720px",
}, ...__VLS_functionalComponentArgsRest(__VLS_53));
__VLS_55.slots.default;
const __VLS_56 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_57 = __VLS_asFunctionalComponent(__VLS_56, new __VLS_56({
    data: (__VLS_ctx.fields),
}));
const __VLS_58 = __VLS_57({
    data: (__VLS_ctx.fields),
}, ...__VLS_functionalComponentArgsRest(__VLS_57));
__VLS_59.slots.default;
const __VLS_60 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
    prop: "fieldCode",
    label: "字段",
}));
const __VLS_62 = __VLS_61({
    prop: "fieldCode",
    label: "字段",
}, ...__VLS_functionalComponentArgsRest(__VLS_61));
const __VLS_64 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({
    label: "可读",
}));
const __VLS_66 = __VLS_65({
    label: "可读",
}, ...__VLS_functionalComponentArgsRest(__VLS_65));
__VLS_67.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_67.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_68 = {}.ElSwitch;
    /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
        modelValue: (row.readable),
    }));
    const __VLS_70 = __VLS_69({
        modelValue: (row.readable),
    }, ...__VLS_functionalComponentArgsRest(__VLS_69));
}
var __VLS_67;
const __VLS_72 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
    label: "可写",
}));
const __VLS_74 = __VLS_73({
    label: "可写",
}, ...__VLS_functionalComponentArgsRest(__VLS_73));
__VLS_75.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_75.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_76 = {}.ElSwitch;
    /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
    // @ts-ignore
    const __VLS_77 = __VLS_asFunctionalComponent(__VLS_76, new __VLS_76({
        modelValue: (row.writable),
        disabled: (!row.readable),
    }));
    const __VLS_78 = __VLS_77({
        modelValue: (row.writable),
        disabled: (!row.readable),
    }, ...__VLS_functionalComponentArgsRest(__VLS_77));
}
var __VLS_75;
const __VLS_80 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
    label: "脱敏策略",
}));
const __VLS_82 = __VLS_81({
    label: "脱敏策略",
}, ...__VLS_functionalComponentArgsRest(__VLS_81));
__VLS_83.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_83.slots;
    const [{ row }] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_84 = {}.ElSelect;
    /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
    // @ts-ignore
    const __VLS_85 = __VLS_asFunctionalComponent(__VLS_84, new __VLS_84({
        modelValue: (row.maskStrategy),
        disabled: (!row.readable),
    }));
    const __VLS_86 = __VLS_85({
        modelValue: (row.maskStrategy),
        disabled: (!row.readable),
    }, ...__VLS_functionalComponentArgsRest(__VLS_85));
    __VLS_87.slots.default;
    for (const [m] of __VLS_getVForSourceType((['NONE', 'PHONE', 'NAME', 'EMAIL', 'ID_CARD', 'BANK_CARD', 'ADDRESS', 'FULL']))) {
        const __VLS_88 = {}.ElOption;
        /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
        // @ts-ignore
        const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({
            key: (m),
            label: (m),
            value: (m),
        }));
        const __VLS_90 = __VLS_89({
            key: (m),
            label: (m),
            value: (m),
        }, ...__VLS_functionalComponentArgsRest(__VLS_89));
    }
    var __VLS_87;
}
var __VLS_83;
var __VLS_59;
{
    const { footer: __VLS_thisSlot } = __VLS_55.slots;
    const __VLS_92 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({
        ...{ 'onClick': {} },
    }));
    const __VLS_94 = __VLS_93({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_93));
    let __VLS_96;
    let __VLS_97;
    let __VLS_98;
    const __VLS_99 = {
        onClick: (...[$event]) => {
            __VLS_ctx.fieldPermission = false;
        }
    };
    __VLS_95.slots.default;
    var __VLS_95;
    const __VLS_100 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_101 = __VLS_asFunctionalComponent(__VLS_100, new __VLS_100({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_102 = __VLS_101({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_101));
    let __VLS_104;
    let __VLS_105;
    let __VLS_106;
    const __VLS_107 = {
        onClick: (__VLS_ctx.saveFields)
    };
    __VLS_103.slots.default;
    var __VLS_103;
}
var __VLS_55;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            RoleTable: RoleTable,
            RoleForm: RoleForm,
            RoleEditForm: RoleEditForm,
            RolePermissionDialog: RolePermissionDialog,
            CustomerPagination: CustomerPagination,
            auth: auth,
            roles: roles,
            menus: menus,
            page: page,
            size: size,
            total: total,
            form: form,
            editForm: editForm,
            permission: permission,
            role: role,
            selected: selected,
            fieldPermission: fieldPermission,
            fields: fields,
            load: load,
            create: create,
            open: open,
            openFieldPermissions: openFieldPermissions,
            saveFields: saveFields,
            save: save,
            openEdit: openEdit,
            saveEdit: saveEdit,
            toggle: toggle,
            remove: remove,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
