<script setup lang="ts">
import { reactive, watch } from 'vue';
import { ElMessage } from 'element-plus';
const props = defineProps<{ modelValue: boolean; menu?: any | null }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void; (e: 'save', value: { parentId: number; menuName: string; permission: string; menuType: string }): void }>();
const form = reactive({ parentId: 0, menuName: '', permission: '', menuType: 'M' });
watch(() => props.menu, (value) => Object.assign(form, value ? { parentId:value.parentId, menuName:value.menuName, permission:value.permission || '', menuType:value.menuType } : { parentId:0, menuName:'', permission:'', menuType:'M' }), { immediate:true });
function submit() {
  if (!form.menuName.trim()) { ElMessage.warning('菜单名称不能为空'); return; }
  if (form.permission && !/^[a-z][a-z0-9:_-]{1,63}$/.test(form.permission)) { ElMessage.warning('权限标识格式不正确'); return; }
  emit('save', { ...form });
}
</script>
<template><el-dialog :model-value="modelValue" :title="props.menu ? '编辑菜单' : '新增菜单'" width="420px" @update:model-value="emit('update:modelValue', $event)"><el-form label-width="90px"><el-form-item label="菜单名称"><el-input v-model="form.menuName" /></el-form-item><el-form-item label="权限标识"><el-input v-model="form.permission" placeholder="例如 customer:read" /></el-form-item><el-form-item label="菜单类型"><el-select v-model="form.menuType" style="width: 100%"><el-option label="菜单" value="M" /><el-option label="按钮" value="B" /></el-select></el-form-item></el-form><template #footer><el-button @click="emit('update:modelValue', false)">取消</el-button><el-button type="primary" @click="submit">保存</el-button></template></el-dialog></template>
