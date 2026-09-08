import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { api } from '../../api';
import MenuForm from '../../components/MenuForm.vue';
import { useAuthStore } from '../../stores/auth';
const auth = useAuthStore();
const menus = ref([]);
const dialog = ref(false);
const editing = ref(null);
async function load() { try {
    menus.value = (await api.get('/system/menus')).data.data;
}
catch {
    ElMessage.error('菜单加载失败');
} }
function openCreate() { editing.value = null; dialog.value = true; }
function openEdit(row) { editing.value = row; dialog.value = true; }
async function save(payload) { try {
    if (editing.value)
        await api.put(`/system/menus/${editing.value.id}`, payload);
    else
        await api.post('/system/menus', payload);
    dialog.value = false;
    ElMessage.success('保存成功');
    await load();
}
catch {
    ElMessage.error('保存失败');
} }
async function remove(row) { try {
    await api.delete(`/system/menus/${row.id}`);
    ElMessage.success('删除成功');
    await load();
}
catch {
    ElMessage.error('删除失败');
} }
async function toggle(row) { try {
    await api.put(`/system/menus/${row.id}/enabled`, null, { params: { enabled: !row.enabled } });
    await load();
}
catch {
    ElMessage.error('状态更新失败');
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
            onClick: (__VLS_ctx.openCreate)
        };
        __VLS_7.slots.default;
        var __VLS_7;
    }
}
const __VLS_12 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    data: (__VLS_ctx.menus),
    stripe: true,
}));
const __VLS_14 = __VLS_13({
    data: (__VLS_ctx.menus),
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
const __VLS_16 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    prop: "id",
    label: "编号",
    width: "90",
}));
const __VLS_18 = __VLS_17({
    prop: "id",
    label: "编号",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
const __VLS_20 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    prop: "menuName",
    label: "菜单名称",
}));
const __VLS_22 = __VLS_21({
    prop: "menuName",
    label: "菜单名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
const __VLS_24 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    prop: "permission",
    label: "权限标识",
}));
const __VLS_26 = __VLS_25({
    prop: "permission",
    label: "权限标识",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
const __VLS_28 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    prop: "menuType",
    label: "类型",
    width: "90",
}));
const __VLS_30 = __VLS_29({
    prop: "menuType",
    label: "类型",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
const __VLS_32 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    label: "状态",
}));
const __VLS_34 = __VLS_33({
    label: "状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_35.slots;
    const [s] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_36 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
        type: (s.row.enabled ? 'success' : 'info'),
    }));
    const __VLS_38 = __VLS_37({
        type: (s.row.enabled ? 'success' : 'info'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_37));
    __VLS_39.slots.default;
    (s.row.enabled ? '启用' : '禁用');
    var __VLS_39;
}
var __VLS_35;
if (__VLS_ctx.auth.hasPermission('system:user:write')) {
    const __VLS_40 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
        label: "操作",
        width: "220",
    }));
    const __VLS_42 = __VLS_41({
        label: "操作",
        width: "220",
    }, ...__VLS_functionalComponentArgsRest(__VLS_41));
    __VLS_43.slots.default;
    {
        const { default: __VLS_thisSlot } = __VLS_43.slots;
        const [s] = __VLS_getSlotParams(__VLS_thisSlot);
        const __VLS_44 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }));
        const __VLS_46 = __VLS_45({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_45));
        let __VLS_48;
        let __VLS_49;
        let __VLS_50;
        const __VLS_51 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.auth.hasPermission('system:user:write')))
                    return;
                __VLS_ctx.openEdit(s.row);
            }
        };
        __VLS_47.slots.default;
        var __VLS_47;
        const __VLS_52 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
            ...{ 'onClick': {} },
            link: true,
        }));
        const __VLS_54 = __VLS_53({
            ...{ 'onClick': {} },
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_53));
        let __VLS_56;
        let __VLS_57;
        let __VLS_58;
        const __VLS_59 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.auth.hasPermission('system:user:write')))
                    return;
                __VLS_ctx.toggle(s.row);
            }
        };
        __VLS_55.slots.default;
        (s.row.enabled ? '禁用' : '启用');
        var __VLS_55;
        const __VLS_60 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }));
        const __VLS_62 = __VLS_61({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_61));
        let __VLS_64;
        let __VLS_65;
        let __VLS_66;
        const __VLS_67 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.auth.hasPermission('system:user:write')))
                    return;
                __VLS_ctx.remove(s.row);
            }
        };
        __VLS_63.slots.default;
        var __VLS_63;
    }
    var __VLS_43;
}
var __VLS_15;
var __VLS_3;
/** @type {[typeof MenuForm, ]} */ ;
// @ts-ignore
const __VLS_68 = __VLS_asFunctionalComponent(MenuForm, new MenuForm({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.dialog),
    menu: (__VLS_ctx.editing),
}));
const __VLS_69 = __VLS_68({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.dialog),
    menu: (__VLS_ctx.editing),
}, ...__VLS_functionalComponentArgsRest(__VLS_68));
let __VLS_71;
let __VLS_72;
let __VLS_73;
const __VLS_74 = {
    onSave: (__VLS_ctx.save)
};
var __VLS_70;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            MenuForm: MenuForm,
            auth: auth,
            menus: menus,
            dialog: dialog,
            editing: editing,
            openCreate: openCreate,
            openEdit: openEdit,
            save: save,
            remove: remove,
            toggle: toggle,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
