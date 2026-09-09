const props = defineProps();
const emit = defineEmits();
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.ElTable;
/** @type {[typeof __VLS_components.ElTable, typeof __VLS_components.elTable, typeof __VLS_components.ElTable, typeof __VLS_components.elTable, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    data: (__VLS_ctx.customers),
    stripe: true,
}));
const __VLS_2 = __VLS_1({
    data: (__VLS_ctx.customers),
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_asFunctionalDirective(__VLS_directives.vLoading)(null, { ...__VLS_directiveBindingRestFields, value: (__VLS_ctx.loading) }, null, null);
var __VLS_4 = {};
__VLS_3.slots.default;
{
    const { empty: __VLS_thisSlot } = __VLS_3.slots;
    const __VLS_5 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        description: "暂无客户数据",
    }));
    const __VLS_7 = __VLS_6({
        description: "暂无客户数据",
    }, ...__VLS_functionalComponentArgsRest(__VLS_6));
}
const __VLS_9 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    prop: "id",
    label: "编号",
    width: "90",
}));
const __VLS_11 = __VLS_10({
    prop: "id",
    label: "编号",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
const __VLS_13 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    prop: "name",
    label: "客户名称",
}));
const __VLS_15 = __VLS_14({
    prop: "name",
    label: "客户名称",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
if (props.customers.length === 0 || props.customers.some(c => c.contact !== undefined)) {
    const __VLS_17 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
        prop: "contact",
        label: "联系人",
    }));
    const __VLS_19 = __VLS_18({
        prop: "contact",
        label: "联系人",
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
}
if (props.customers.length === 0 || props.customers.some(c => c.phone !== undefined)) {
    const __VLS_21 = {}.ElTableColumn;
    /** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
    // @ts-ignore
    const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
        prop: "phone",
        label: "联系电话",
    }));
    const __VLS_23 = __VLS_22({
        prop: "phone",
        label: "联系电话",
    }, ...__VLS_functionalComponentArgsRest(__VLS_22));
}
const __VLS_25 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
    prop: "status",
    label: "状态",
}));
const __VLS_27 = __VLS_26({
    prop: "status",
    label: "状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_26));
const __VLS_29 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    label: "操作",
    width: "150",
}));
const __VLS_31 = __VLS_30({
    label: "操作",
    width: "150",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_32.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_32.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    if (__VLS_ctx.canWrite) {
        const __VLS_33 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }));
        const __VLS_35 = __VLS_34({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_34));
        let __VLS_37;
        let __VLS_38;
        let __VLS_39;
        const __VLS_40 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.canWrite))
                    return;
                __VLS_ctx.emit('edit', scope.row);
            }
        };
        __VLS_36.slots.default;
        var __VLS_36;
    }
    if (__VLS_ctx.canWrite) {
        const __VLS_41 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }));
        const __VLS_43 = __VLS_42({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_42));
        let __VLS_45;
        let __VLS_46;
        let __VLS_47;
        const __VLS_48 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.canWrite))
                    return;
                __VLS_ctx.emit('delete', scope.row);
            }
        };
        __VLS_44.slots.default;
        var __VLS_44;
    }
}
var __VLS_32;
var __VLS_3;
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
