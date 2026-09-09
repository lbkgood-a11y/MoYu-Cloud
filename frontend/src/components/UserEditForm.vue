<script setup lang="ts">
import { reactive, watch } from 'vue';
import { ElMessage } from 'element-plus';

interface User {
  id: string;
  username: string;
  roleCode: string;
  enabled: boolean;
  departmentId?: string;
}
const props = defineProps<{ modelValue: boolean; user: User | null; departments?: { id: string; name: string }[] }>();
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'save', value: { username: string; departmentId?: string }): void;
}>();
const form = reactive({ username: '', departmentId: '' });
watch(
  () => props.user,
  (user) => {
    form.username = user?.username ?? '';
  },
  { immediate: true },
);
/** 提交用户资料修改。 */
function submit() {
  if (!form.username.trim()) {
    ElMessage.warning('用户名不能为空');
    return;
  }
  emit('save', { username: form.username.trim() });
}
</script>
<template>
  <el-dialog
    :model-value="modelValue"
    title="编辑用户"
    width="400px"
    @update:model-value="emit('update:modelValue', $event)"
    ><el-form label-width="70px"
      ><el-form-item label="用户名"><el-input v-model="form.username" /></el-form-item
      ><el-form-item label="部门"
        ><el-select v-model="form.departmentId" clearable
          ><el-option
            v-for="d in props.departments ?? []"
            :key="d.id"
            :label="d.name"
            :value="d.id" /></el-select></el-form-item></el-form
    ><template #footer
      ><el-button @click="emit('update:modelValue', false)">取消</el-button
      ><el-button type="primary" @click="submit">保存</el-button></template
    ></el-dialog
  >
</template>
