<script setup lang="ts">
import { reactive, watch, onMounted, ref } from 'vue';
import { fetchDictionary } from '../api/dictionary';
import { ElMessage } from 'element-plus';
import type { Customer } from '../api/customer';

const props = defineProps<{ modelValue: boolean; customer?: Customer | null }>();
const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void;
  (event: 'save', value: Omit<Customer, 'id'>): void;
}>();
const form = reactive<Omit<Customer, 'id'>>({ name: '', contact: '', phone: '', status: 'ACTIVE' });
const statusOptions = ref<any[]>([]);
onMounted(async () => {
  try {
    statusOptions.value = (await fetchDictionary('customer_status')).data.data.items.filter((x: any) => x.enabled);
  } catch {
    statusOptions.value = [
      { itemValue: 'ACTIVE', itemLabel: '有效' },
      { itemValue: 'INACTIVE', itemLabel: '停用' },
    ];
  }
});

watch(
  () => props.customer,
  (customer) => {
    Object.assign(
      form,
      customer
        ? { name: customer.name, contact: customer.contact, phone: customer.phone, status: customer.status }
        : { name: '', contact: '', phone: '', status: 'ACTIVE' },
    );
  },
  { immediate: true },
);

function submit() {
  if (!form.name.trim()) {
    ElMessage.warning('客户名称不能为空');
    return;
  }
  if (form.phone && !/^1\d{10}$/.test(form.phone)) {
    ElMessage.warning('请输入正确的手机号');
    return;
  }
  emit('save', { ...form });
}
</script>

<template>
  <el-dialog
    :model-value="modelValue"
    :title="customer ? '编辑客户' : '新增客户'"
    width="460px"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <el-form label-width="80px">
      <el-form-item label="客户名称"><el-input v-model="form.name" /></el-form-item>
      <el-form-item label="联系人"><el-input v-model="form.contact" /></el-form-item>
      <el-form-item label="手机号"><el-input v-model="form.phone" /></el-form-item>
      <el-form-item label="状态"
        ><el-select v-model="form.status" style="width: 100%"
          ><el-option
            v-for="o in statusOptions"
            :key="o.itemValue"
            :label="o.itemLabel"
            :value="o.itemValue" /></el-select
      ></el-form-item>
    </el-form>
    <template #footer
      ><el-button @click="emit('update:modelValue', false)">取消</el-button
      ><el-button type="primary" @click="submit">保存</el-button></template
    >
  </el-dialog>
</template>
