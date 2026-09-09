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
{
    const { empty: __VLS_thisSlot } = __VLS_3.slots;
    const __VLS_5 = {}.ElEmpty;
    /** @type {[typeof __VLS_components.ElEmpty, typeof __VLS_components.elEmpty, ]} */ ;
    // @ts-ignore
    const __VLS_6 = __VLS_asFunctionalComponent(__VLS_5, new __VLS_5({
        description: "暂无用户数据",
    }));
    const __VLS_7 = __VLS_6({
        description: "暂无用户数据",
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
    prop: "username",
    label: "用户名",
}));
const __VLS_15 = __VLS_14({
    prop: "username",
    label: "用户名",
}, ...__VLS_functionalComponentArgsRest(__VLS_14));
const __VLS_17 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
    label: "角色",
}));
const __VLS_19 = __VLS_18({
    label: "角色",
}, ...__VLS_functionalComponentArgsRest(__VLS_18));
__VLS_20.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_20.slots;
    const [s] = __VLS_getSlotParams(__VLS_thisSlot);
    if (__VLS_ctx.canWrite) {
        const __VLS_21 = {}.ElSelect;
        /** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
        // @ts-ignore
        const __VLS_22 = __VLS_asFunctionalComponent(__VLS_21, new __VLS_21({
            ...{ 'onChange': {} },
            modelValue: (s.row.roleCode),
            size: "small",
        }));
        const __VLS_23 = __VLS_22({
            ...{ 'onChange': {} },
            modelValue: (s.row.roleCode),
            size: "small",
        }, ...__VLS_functionalComponentArgsRest(__VLS_22));
        let __VLS_25;
        let __VLS_26;
        let __VLS_27;
        const __VLS_28 = {
            onChange: (...[$event]) => {
                if (!(__VLS_ctx.canWrite))
                    return;
                __VLS_ctx.emit('assign-role', s.row, $event);
            }
        };
        __VLS_24.slots.default;
        for (const [r] of __VLS_getVForSourceType((props.roles))) {
            const __VLS_29 = {}.ElOption;
            /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
            // @ts-ignore
            const __VLS_30 = __VLS_asFunctionalComponent(__VLS_29, new __VLS_29({
                key: (r.roleCode),
                label: (r.roleName),
                value: (r.roleCode),
            }));
            const __VLS_31 = __VLS_30({
                key: (r.roleCode),
                label: (r.roleName),
                value: (r.roleCode),
            }, ...__VLS_functionalComponentArgsRest(__VLS_30));
        }
        var __VLS_24;
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (s.row.roleCode);
    }
}
var __VLS_20;
const __VLS_33 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_34 = __VLS_asFunctionalComponent(__VLS_33, new __VLS_33({
    label: "状态",
}));
const __VLS_35 = __VLS_34({
    label: "状态",
}, ...__VLS_functionalComponentArgsRest(__VLS_34));
__VLS_36.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_36.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    const __VLS_37 = {}.ElTag;
    /** @type {[typeof __VLS_components.ElTag, typeof __VLS_components.elTag, typeof __VLS_components.ElTag, typeof __VLS_components.elTag, ]} */ ;
    // @ts-ignore
    const __VLS_38 = __VLS_asFunctionalComponent(__VLS_37, new __VLS_37({
        type: (scope.row.enabled ? 'success' : 'info'),
    }));
    const __VLS_39 = __VLS_38({
        type: (scope.row.enabled ? 'success' : 'info'),
    }, ...__VLS_functionalComponentArgsRest(__VLS_38));
    __VLS_40.slots.default;
    (scope.row.enabled ? '启用' : '禁用');
    var __VLS_40;
}
var __VLS_36;
const __VLS_41 = {}.ElTableColumn;
/** @type {[typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, typeof __VLS_components.ElTableColumn, typeof __VLS_components.elTableColumn, ]} */ ;
// @ts-ignore
const __VLS_42 = __VLS_asFunctionalComponent(__VLS_41, new __VLS_41({
    label: "操作",
    width: "270",
}));
const __VLS_43 = __VLS_42({
    label: "操作",
    width: "270",
}, ...__VLS_functionalComponentArgsRest(__VLS_42));
__VLS_44.slots.default;
{
    const { default: __VLS_thisSlot } = __VLS_44.slots;
    const [scope] = __VLS_getSlotParams(__VLS_thisSlot);
    if (__VLS_ctx.canWrite) {
        const __VLS_45 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_46 = __VLS_asFunctionalComponent(__VLS_45, new __VLS_45({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }));
        const __VLS_47 = __VLS_46({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_46));
        let __VLS_49;
        let __VLS_50;
        let __VLS_51;
        const __VLS_52 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.canWrite))
                    return;
                __VLS_ctx.emit('edit', scope.row);
            }
        };
        __VLS_48.slots.default;
        var __VLS_48;
    }
    if (__VLS_ctx.canWrite) {
        const __VLS_53 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_54 = __VLS_asFunctionalComponent(__VLS_53, new __VLS_53({
            ...{ 'onClick': {} },
            link: true,
        }));
        const __VLS_55 = __VLS_54({
            ...{ 'onClick': {} },
            link: true,
        }, ...__VLS_functionalComponentArgsRest(__VLS_54));
        let __VLS_57;
        let __VLS_58;
        let __VLS_59;
        const __VLS_60 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.canWrite))
                    return;
                __VLS_ctx.emit('reset-password', scope.row);
            }
        };
        __VLS_56.slots.default;
        var __VLS_56;
    }
    if (__VLS_ctx.canWrite) {
        const __VLS_61 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_62 = __VLS_asFunctionalComponent(__VLS_61, new __VLS_61({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }));
        const __VLS_63 = __VLS_62({
            ...{ 'onClick': {} },
            link: true,
            type: "primary",
        }, ...__VLS_functionalComponentArgsRest(__VLS_62));
        let __VLS_65;
        let __VLS_66;
        let __VLS_67;
        const __VLS_68 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.canWrite))
                    return;
                __VLS_ctx.emit('toggle', scope.row);
            }
        };
        __VLS_64.slots.default;
        (scope.row.enabled ? '禁用' : '启用');
        var __VLS_64;
    }
    if (__VLS_ctx.canWrite) {
        const __VLS_69 = {}.ElButton;
        /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
        // @ts-ignore
        const __VLS_70 = __VLS_asFunctionalComponent(__VLS_69, new __VLS_69({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }));
        const __VLS_71 = __VLS_70({
            ...{ 'onClick': {} },
            link: true,
            type: "danger",
        }, ...__VLS_functionalComponentArgsRest(__VLS_70));
        let __VLS_73;
        let __VLS_74;
        let __VLS_75;
        const __VLS_76 = {
            onClick: (...[$event]) => {
                if (!(__VLS_ctx.canWrite))
                    return;
                __VLS_ctx.emit('remove', scope.row);
            }
        };
        __VLS_72.slots.default;
        var __VLS_72;
    }
}
var __VLS_44;
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
