const __VLS_props = defineProps();
const emit = defineEmits();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.ElPagination;
/** @type {[typeof __VLS_components.ElPagination, typeof __VLS_components.elPagination, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onUpdate:currentPage': {} },
    ...{ 'onUpdate:pageSize': {} },
    ...{ class: "customer-pagination" },
    currentPage: (__VLS_ctx.page),
    pageSize: (__VLS_ctx.size),
    layout: "total, sizes, prev, pager, next",
    pageSizes: ([10, 20, 50]),
    total: (__VLS_ctx.total),
}));
const __VLS_2 = __VLS_1({
    ...{ 'onUpdate:currentPage': {} },
    ...{ 'onUpdate:pageSize': {} },
    ...{ class: "customer-pagination" },
    currentPage: (__VLS_ctx.page),
    pageSize: (__VLS_ctx.size),
    layout: "total, sizes, prev, pager, next",
    pageSizes: ([10, 20, 50]),
    total: (__VLS_ctx.total),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    'onUpdate:currentPage': (...[$event]) => {
        __VLS_ctx.emit('update:page', $event);
    }
};
const __VLS_8 = {
    'onUpdate:pageSize': (...[$event]) => {
        __VLS_ctx.emit('update:size', $event);
    }
};
var __VLS_9 = {};
var __VLS_3;
/** @type {__VLS_StyleScopedClasses['customer-pagination']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            emit: emit,
        };
    },
    __typeEmits: {},
    __typeProps: {},
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
    __typeEmits: {},
    __typeProps: {},
});
; /* PartiallyEnd: #4569/main.vue */
