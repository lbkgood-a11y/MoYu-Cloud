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
    data: (__VLS_ctx.users),
    stripe: true,
}));
const __VLS_2 = __VLS_1({
    data: (__VLS_ctx.users),
    stripe: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
var __VLS_4 = {};
__VLS_3.slots.default;
const __VLS_5 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
    prop: "id",
    label: "编号",
    width: "90",
}));
const __VLS_7 = __VLS_6({
    prop: "id",
    label: "编号",
    width: "90",
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
const __VLS_9 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    prop: "username",
    label: "用户名",
}));
const __VLS_11 = __VLS_10({
    prop: "username",
    label: "用户名",
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
const __VLS_13 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_14 = __VLS_asFunctionalComponent(__VLS_13, new __VLS_13({
    label: "角色",
}));
const __VLS_15 = __VLS_14({
    label: "角色",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
__VLS_16.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_16.slots;
    const [s] = __VLS_getSlotParams(__VLS_thisSlot);
    if (__VLS_ctx.canWrite) {
        const __VLS_17 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
            ...{ 'onChange': {} },
            modelValue: (s.row.roleCode),
            size: "small",
        }));
        const __VLS_19 = __VLS_18({
            ...{ 'onChange': {} },
            modelValue: (s.row.roleCode),
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_18));
        let __VLS_21;
        let __VLS_22;
        let __VLS_23;
        const __VLS_24 = {
            onChange: (...[$event]) => {
                if (!(__VLS_ctx.canWrite))
                    return;
                __VLS_ctx.emit('assign-role', s.row, $event);
            }
        };
        __VLS_20.slots.default;
        for (const [r] of __VLS_getVForSourceType((props.roles))) {
            const __VLS_25 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
                key: (r.roleCode),
                label: (r.roleName),
                value: (r.roleCode),
            }));
            const __VLS_27 = __VLS_26({
                key: (r.roleCode),
                label: (r.roleName),
                value: (r.roleCode),
            }, ...__VLS_functionalComponentArgsRest(__VLS_26));
        }
        var __VLS_20;
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (s.row.roleCode);
    }
}
var __VLS_16;
const __VLS_29 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
    label: "状态",
}));
const __VLS_31 = __VLS_30({
    label: "状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_30));
__VLS_32.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_32.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_33 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
        type: (scope.row.enabled ? 'success' : 'info'),
    }));
    const __VLS_35 = __VLS_34({
        type: (scope.row.enabled ? 'success' : 'info'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_34));
    __VLS_36.slots.default;
    (scope.row.enabled ? '启用' : '禁用');
    var __VLS_36;
}
var __VLS_32;
const __VLS_37 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
    label: "操作",
    width: "110",
}));
const __VLS_39 = __VLS_38({
    label: "操作",
    width: "110",
}, ...__VLS_functionalComponentArgsRest(__VLS_38));
__VLS_40.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_40.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    if (__VLS_ctx.canWrite) {
        const __VLS_41 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }));
        const __VLS_43 = __VLS_42({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_42));
        let __VLS_45;
        let __VLS_46;
        let __VLS_47;
        const __VLS_48 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.canWrite))
                    return;
                __VLS_ctx.emit('toggle', scope.row);
            }
        };
        __VLS_44.slots.default;
        (scope.row.enabled ? '禁用' : '启用');
        var __VLS_44;
    }
}
var __VLS_40;
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
