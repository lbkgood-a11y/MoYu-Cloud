<script setup lang="ts">
import { reactive, watch } from 'vue';
import { ElMessage } from 'element-plus';
const props = defineProps<{ modelValue: boolean; username: string }>();
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'save', value: { password: string }): void;
}>();
const form = reactive({ password: '' });
watch(
  () => props.modelValue,
  (visible) => {
    if (visible) form.password = '';
  },
);
/** 提交密码重置。 */
function submit() {
  if (form.password.length < 8) {
    ElMessage.warning('密码至少需要 8 位');
    return;
  }
  emit('save', { password: form.password });
}
</script>
<template>
  <el-dialog
    :model-value="modelValue"
    :title="`重置密码 - ${username}`"
    width="400px"
    @update:model-value="emit('update:modelValue', $event)"
    ><el-form label-width="80px"
      ><el-form-item label="新密码"
        ><el-input v-model="form.password" type="password" show-password /></el-form-item></el-form
    ><template #footer
      ><el-button @click="emit('update:modelValue', false)">取消</el-button
      ><el-button type="primary" @click="submit">保存</el-button></template
    ></el-dialog
  >
</template>
