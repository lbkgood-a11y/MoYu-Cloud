<script setup lang="ts">
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';
defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void; (e: 'save', value: { roleCode: string; roleName: string }): void }>();
const form = reactive({ roleCode: '', roleName: '' });
function submit() {
  if (!/^[a-z][a-z0-9:_-]{1,31}$/.test(form.roleCode)) { ElMessage.warning('角色编码须以小写字母开头，长度 2-32 位'); return; }
  if (!form.roleName.trim()) { ElMessage.warning('角色名称不能为空'); return; }
  emit('save', { ...form });
}
</script>
<template><el-dialog :model-value="modelValue" title="新增角色" width="400px" @update:model-value="emit('update:modelValue', $event)"><el-form label-width="80px"><el-form-item label="角色编码"><el-input v-model="form.roleCode" /></el-form-item><el-form-item label="角色名称"><el-input v-model="form.roleName" /></el-form-item></el-form><template #footer><el-button @click="emit('update:modelValue', false)">取消</el-button><el-button type="primary" @click="submit">保存</el-button></template></el-dialog></template>
