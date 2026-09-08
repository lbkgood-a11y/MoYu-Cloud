import { onMounted, ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useAuthStore } from '../../stores/auth';
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer } from '../../api/customer';
import CustomerTable from '../../components/CustomerTable.vue';
import CustomerPagination from '../../components/CustomerPagination.vue';
import CustomerForm from '../../components/CustomerForm.vue';
const auth = useAuthStore();
const customers = ref([]);
const keyword = ref('');
const page = ref(1);
const size = ref(10);
const total = ref(0);
const loading = ref(false);
const dialog = ref(false);
const editing = ref(null);
async function load() { loading.value = true; try {
    const result = (await fetchCustomers(keyword.value, page.value, size.value)).data.data;
    customers.value = result.items;
    total.value = result.total;
}
catch {
    ElMessage.error('客户数据加载失败');
}
finally {
    loading.value = false;
} }
function openForm(customer) { editing.value = customer ?? null; dialog.value = true; }
async function save(payload) { try {
    if (editing.value)
        await updateCustomer(editing.value.id, payload);
    else
        await createCustomer(payload);
    dialog.value = false;
    ElMessage.success('保存成功');
    await load();
}
catch {
    ElMessage.error('保存失败');
} }
async function remove(customer) { try {
    await ElMessageBox.confirm(`确定删除客户“${customer.name}”吗？`, '删除确认', { type: 'warning' });
    await deleteCustomer(customer.id);
    ElMessage.success('删除成功');
    await load();
}
catch (error) {
    if (error !== 'cancel' && error !== 'close')
        ElMessage.error('删除失败');
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
    if (__VLS_ctx.auth.hasPermission('customer:write')) {
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
                if (!(__VLS_ctx.auth.hasPermission('customer:write')))
                    return;
                __VLS_ctx.openForm();
            }
        };
        __VLS_7.slots.default;
        var __VLS_7;
    }
}
const __VLS_12 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    ...{ 'onSubmit': {} },
    inline: true,
}));
const __VLS_14 = __VLS_13({
    ...{ 'onSubmit': {} },
    inline: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
let __VLS_16;
let __VLS_17;
let __VLS_18;
const __VLS_19 = {
    onSubmit: (__VLS_ctx.load)
};
__VLS_15.slots.default;
const __VLS_20 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    label: "关键词",
}));
const __VLS_22 = __VLS_21({
    label: "关键词",
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
const __VLS_24 = {}.ElInput;
/** @type {[typeof __VLS_components.ElInput, typeof __VLS_components.elInput, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.keyword),
    clearable: true,
    placeholder: "客户名称/联系人/电话",
}));
const __VLS_26 = __VLS_25({
    ...{ 'onKeyup': {} },
    modelValue: (__VLS_ctx.keyword),
    clearable: true,
    placeholder: "客户名称/联系人/电话",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
let __VLS_28;
let __VLS_29;
let __VLS_30;
const __VLS_31 = {
    onKeyup: (__VLS_ctx.load)
};
var __VLS_27;
var __VLS_23;
const __VLS_32 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
    ...{ 'onClick': {} },
    type: "primary",
}));
const __VLS_34 = __VLS_33({
    ...{ 'onClick': {} },
    type: "primary",
}, ...__VLS_functionalComponentArgsRest(__VLS_33));
let __VLS_36;
let __VLS_37;
let __VLS_38;
const __VLS_39 = {
    onClick: (...[$event]) => {
        __VLS_ctx.page = 1;
        __VLS_ctx.load();
    }
};
__VLS_35.slots.default;
var __VLS_35;
var __VLS_15;
/** @type {[typeof CustomerTable, ]} */ ;
// @ts-ignore
const __VLS_40 = __VLS_asFunctionalComponent(CustomerTable, new CustomerTable({
    ...{ 'onEdit': {} },
    ...{ 'onDelete': {} },
    customers: (__VLS_ctx.customers),
    loading: (__VLS_ctx.loading),
    canWrite: (__VLS_ctx.auth.hasPermission('customer:write')),
}));
const __VLS_41 = __VLS_40({
    ...{ 'onEdit': {} },
    ...{ 'onDelete': {} },
    customers: (__VLS_ctx.customers),
    loading: (__VLS_ctx.loading),
    canWrite: (__VLS_ctx.auth.hasPermission('customer:write')),
}, ...__VLS_functionalComponentArgsRest(__VLS_40));
let __VLS_43;
let __VLS_44;
let __VLS_45;
const __VLS_46 = {
    onEdit: (__VLS_ctx.openForm)
};
const __VLS_47 = {
    onDelete: (__VLS_ctx.remove)
};
var __VLS_42;
/** @type {[typeof CustomerPagination, ]} */ ;
// @ts-ignore
const __VLS_48 = __VLS_asFunctionalComponent(CustomerPagination, new CustomerPagination({
    ...{ 'onUpdate:page': {} },
    ...{ 'onUpdate:size': {} },
    page: (__VLS_ctx.page),
    size: (__VLS_ctx.size),
    total: (__VLS_ctx.total),
}));
const __VLS_49 = __VLS_48({
    ...{ 'onUpdate:page': {} },
    ...{ 'onUpdate:size': {} },
    page: (__VLS_ctx.page),
    size: (__VLS_ctx.size),
    total: (__VLS_ctx.total),
}, ...__VLS_functionalComponentArgsRest(__VLS_48));
let __VLS_51;
let __VLS_52;
let __VLS_53;
const __VLS_54 = {
    'onUpdate:page': (...[$event]) => {
        __VLS_ctx.page = $event;
        __VLS_ctx.load();
    }
};
const __VLS_55 = {
    'onUpdate:size': (...[$event]) => {
        __VLS_ctx.size = $event;
        __VLS_ctx.page = 1;
        __VLS_ctx.load();
    }
};
var __VLS_50;
var __VLS_3;
/** @type {[typeof CustomerForm, ]} */ ;
// @ts-ignore
const __VLS_56 = __VLS_asFunctionalComponent(CustomerForm, new CustomerForm({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.dialog),
    customer: (__VLS_ctx.editing),
}));
const __VLS_57 = __VLS_56({
    ...{ 'onSave': {} },
    modelValue: (__VLS_ctx.dialog),
    customer: (__VLS_ctx.editing),
}, ...__VLS_functionalComponentArgsRest(__VLS_56));
let __VLS_59;
let __VLS_60;
let __VLS_61;
const __VLS_62 = {
    onSave: (__VLS_ctx.save)
};
var __VLS_58;
/** @type {__VLS_StyleScopedClasses['header']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            CustomerTable: CustomerTable,
            CustomerPagination: CustomerPagination,
            CustomerForm: CustomerForm,
            auth: auth,
            customers: customers,
            keyword: keyword,
            page: page,
            size: size,
            total: total,
            loading: loading,
            dialog: dialog,
            editing: editing,
            load: load,
            openForm: openForm,
            save: save,
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
