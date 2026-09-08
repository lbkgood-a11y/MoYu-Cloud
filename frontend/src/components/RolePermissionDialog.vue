<script setup lang="ts">
interface Menu { id: number; menuName: string; permission: string }
interface Role { id: number; roleName: string }
defineProps<{ modelValue: boolean; role: Role | null; menus: Menu[]; selectedIds: number[] }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void; (e: 'update:selectedIds', value: number[]): void; (e: 'save'): void }>();
</script>
<template><el-dialog :model-value="modelValue" :title="`菜单授权 - ${role?.roleName ?? ''}`" width="460px" @update:model-value="emit('update:modelValue', $event)"><el-checkbox-group :model-value="selectedIds" @update:model-value="emit('update:selectedIds', $event as number[])"><el-checkbox v-for="menu in menus" :key="menu.id" :label="menu.id">{{ menu.menuName }}<span v-if="menu.permission" class="permission">（{{ menu.permission }}）</span></el-checkbox></el-checkbox-group><template #footer><el-button @click="emit('update:modelValue', false)">取消</el-button><el-button type="primary" @click="emit('save')">保存</el-button></template></el-dialog></template>
