import { computed, ref, watch } from 'vue';
const props = defineProps();
const emit = defineEmits();
const checkedKeys = ref([]);
/** 将扁平菜单转换为 Element Plus 树结构。 */
const tree = computed(() => {
    const nodes = props.menus.map((menu) => ({ ...menu, children: [] }));
    const roots = [];
    nodes.forEach((node) => {
        const parent = nodes.find((item) => item.id === node.parentId);
        if (parent)
            parent.children.push(node);
        else
            roots.push(node);
    });
    return roots;
});
watch(() => props.selectedIds, (ids) => {
    checkedKeys.value = [...ids];
}, { immediate: true });
/** 更新勾选权限并同步父组件。 */
function updateChecked(_data, info) {
    const ids = info.checkedKeys.map(String);
    checkedKeys.value = ids;
    emit('update:selectedIds', ids);
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
const __VLS_0 = {}.ElDialog;
/** @type {[typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, typeof __VLS_components.ElDialog, typeof __VLS_components.elDialog, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    ...{ 'onUpdate:modelValue': {} },
    modelValue: (__VLS_ctx.modelValue),
    title: (`菜单授权 - ${__VLS_ctx.role?.roleName ?? ''}`),
    width: "520px",
}));
const __VLS_2 = __VLS_1({
    ...{ 'onUpdate:modelValue': {} },
    modelValue: (__VLS_ctx.modelValue),
    title: (`菜单授权 - ${__VLS_ctx.role?.roleName ?? ''}`),
    width: "520px",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
let __VLS_4;
let __VLS_5;
let __VLS_6;
const __VLS_7 = {
    'onUpdate:modelValue': (...[$event]) => {
        __VLS_ctx.emit('update:modelValue', $event);
    }
};
var __VLS_8 = {};
__VLS_3.slots.default;
const __VLS_9 = {}.ElTree;
/** @type {[typeof __VLS_components.ElTree, typeof __VLS_components.elTree, ]} */ ;
// @ts-ignore
const __VLS_10 = __VLS_asFunctionalComponent(__VLS_9, new __VLS_9({
    ...{ 'onCheck': {} },
    nodeKey: "id",
    showCheckbox: true,
    defaultExpandAll: true,
    data: (__VLS_ctx.tree),
    defaultCheckedKeys: (__VLS_ctx.checkedKeys),
    props: ({ label: 'menuName', children: 'children' }),
}));
const __VLS_11 = __VLS_10({
    ...{ 'onCheck': {} },
    nodeKey: "id",
    showCheckbox: true,
    defaultExpandAll: true,
    data: (__VLS_ctx.tree),
    defaultCheckedKeys: (__VLS_ctx.checkedKeys),
    props: ({ label: 'menuName', children: 'children' }),
}, ...__VLS_functionalComponentArgsRest(__VLS_10));
let __VLS_13;
let __VLS_14;
let __VLS_15;
const __VLS_16 = {
    onCheck: (__VLS_ctx.updateChecked)
};
var __VLS_12;
{
    const { footer: __VLS_thisSlot } = __VLS_3.slots;
    const __VLS_17 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_18 = __VLS_asFunctionalComponent(__VLS_17, new __VLS_17({
        ...{ 'onClick': {} },
    }));
    const __VLS_19 = __VLS_18({
        ...{ 'onClick': {} },
    }, ...__VLS_functionalComponentArgsRest(__VLS_18));
    let __VLS_21;
    let __VLS_22;
    let __VLS_23;
    const __VLS_24 = {
        onClick: (...[$event]) => {
            __VLS_ctx.emit('update:modelValue', false);
        }
    };
    __VLS_20.slots.default;
    var __VLS_20;
    const __VLS_25 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_26 = __VLS_asFunctionalComponent(__VLS_25, new __VLS_25({
        ...{ 'onClick': {} },
        type: "primary",
    }));
    const __VLS_27 = __VLS_26({
        ...{ 'onClick': {} },
        type: "primary",
    }, ...__VLS_functionalComponentArgsRest(__VLS_26));
    let __VLS_29;
    let __VLS_30;
    let __VLS_31;
    const __VLS_32 = {
        onClick: (...[$event]) => {
            __VLS_ctx.emit('save');
        }
    };
    __VLS_28.slots.default;
    var __VLS_28;
}
var __VLS_3;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            emit: emit,
            checkedKeys: checkedKeys,
            tree: tree,
            updateChecked: updateChecked,
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
