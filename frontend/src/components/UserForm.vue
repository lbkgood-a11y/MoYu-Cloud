<script setup lang="ts">
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';
defineProps<{ modelValue: boolean }>();
const emit = defineEmits<{ (e: 'update:modelValue', value: boolean): void; (e: 'save', value: { username: string; password: string }): void }>();
const form = reactive({ username: '', password: '' });
function submit() {
  if (!form.username.trim()) { ElMessage.warning('用户名不能为空'); return; }
  if (form.password.length < 6) { ElMessage.warning('密码至少需要 6 位'); return; }
  emit('save', { ...form });
}
</script>
<template><el-dialog :model-value="modelValue" title="新增用户" width="400px" @update:model-value="emit('update:modelValue', $event)"><el-form label-width="70px"><el-form-item label="用户名"><el-input v-model="form.username" /></el-form-item><el-form-item label="密码"><el-input v-model="form.password" type="password" show-password /></el-form-item></el-form><template #footer><el-button @click="emit('update:modelValue', false)">取消</el-button><el-button type="primary" @click="submit">保存</el-button></template></el-dialog></template>
