<script setup lang="ts">
import { computed, ref, watch } from 'vue';

interface Menu {
  id: string;
  parentId: string;
  menuName: string;
  permission: string;
  menuType: string;
}
interface Role {
  id: string;
  roleName: string;
}
const props = defineProps<{ modelValue: boolean; role: Role | null; menus: Menu[]; selectedIds: string[] }>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'update:selectedIds', value: string[]): void;
  (e: 'save'): void;
}>();
const checkedKeys = ref<string[]>([]);
/** 将扁平菜单转换为 Element Plus 树结构。 */
const tree = computed(() => {
  const nodes = props.menus.map((menu) => ({ ...menu, children: [] as any[] }));
  const roots: any[] = [];
  nodes.forEach((node) => {
    const parent = nodes.find((item) => item.id === node.parentId);
    if (parent) parent.children.push(node);
    else roots.push(node);
  });
  return roots;
});
watch(
  () => props.selectedIds,
  (ids) => {
    checkedKeys.value = [...ids];
  },
  { immediate: true },
);
/** 更新勾选权限并同步父组件。 */
function updateChecked(_data: unknown, info: { checkedKeys: Array<string | number> }) {
  const ids = info.checkedKeys.map(String);
  checkedKeys.value = ids;
  emit('update:selectedIds', ids);
}
</script>
<template>
  <el-dialog
    :model-value="modelValue"
    :title="`菜单授权 - ${role?.roleName ?? ''}`"
    width="520px"
    @update:model-value="emit('update:modelValue', $event)"
    ><el-tree
      node-key="id"
      show-checkbox
      default-expand-all
      :data="tree"
      :default-checked-keys="checkedKeys"
      :props="{ label: 'menuName', children: 'children' }"
      @check="updateChecked"
    /><template #footer
      ><el-button @click="emit('update:modelValue', false)">取消</el-button
      ><el-button type="primary" @click="emit('save')">保存</el-button></template
    ></el-dialog
  >
</template>
