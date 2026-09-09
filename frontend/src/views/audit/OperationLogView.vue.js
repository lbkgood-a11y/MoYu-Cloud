import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { fetchOperationLogs } from '../../api/audit';
import OperationLogTable from '../../components/OperationLogTable.vue';
import CustomerPagination from '../../components/CustomerPagination.vue';
const logs = ref([]);
const page = ref(1);
const size = ref(10);
const total = ref(0);
async function load() {
    try {
        const r = (await fetchOperationLogs(page.value, size.value)).data.data;
        logs.value = r.items;
        total.value = r.total;
    }
    catch {
        ElMessage.error('操作日志加载失败');
    }
}
onMounted(load);
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.ElCard;
/** @type {[typeof __VLS_components.ElCard, typeof __VLS_components.elCard, typeof __VLS_components.ElCard, typeof __VLS_components.elCard, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({}));
const __VLS_2 = __VLS_1({}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
{
    const { header: __VLS_thisSlot } = __VLS_3.slots;
}
/** @type {[typeof OperationLogTable, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(OperationLogTable, new OperationLogTable({
    logs: (__VLS_ctx.logs),
}));
const __VLS_6 = __VLS_5({
    logs: (__VLS_ctx.logs),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
/** @type {[typeof CustomerPagination, ]} */ ;
// @ts-ignore
const __VLS_8 = __VLS_asFunctionalComponent(CustomerPagination, new CustomerPagination({
    ...{ 'onUpdate:page': {} },
    ...{ 'onUpdate:size': {} },
    page: (__VLS_ctx.page),
    size: (__VLS_ctx.size),
    total: (__VLS_ctx.total),
}));
const __VLS_9 = __VLS_8({
    ...{ 'onUpdate:page': {} },
    ...{ 'onUpdate:size': {} },
    page: (__VLS_ctx.page),
    size: (__VLS_ctx.size),
    total: (__VLS_ctx.total),
}, ...__VLS_functionalComponentArgsRest(__VLS_8));
let __VLS_11;
let __VLS_12;
let __VLS_13;
const __VLS_14 = {
    'onUpdate:page': (...[$event]) => {
        __VLS_ctx.page = $event;
        __VLS_ctx.load();
        ;
    }
};
const __VLS_15 = {
    'onUpdate:size': (...[$event]) => {
        __VLS_ctx.size = $event;
        __VLS_ctx.page = 1;
        __VLS_ctx.load();
        ;
    }
};
var __VLS_10;
var __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            OperationLogTable: OperationLogTable,
            CustomerPagination: CustomerPagination,
            logs: logs,
            page: page,
            size: size,
            total: total,
            load: load,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
