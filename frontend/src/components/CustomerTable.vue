<script setup lang="ts">
import type { Customer } from '../api/customer';

defineProps<{ customers: Customer[]; loading?: boolean; canWrite: boolean }>();
const emit = defineEmits<{ (event: 'edit', customer: Customer): void; (event: 'delete', customer: Customer): void }>();
</script>

<template>
  <el-table v-loading="loading" :data="customers" stripe>
    <el-table-column prop="id" label="编号" width="90" />
    <el-table-column prop="name" label="客户名称" />
    <el-table-column prop="contact" label="联系人" />
    <el-table-column prop="phone" label="联系电话" />
    <el-table-column prop="status" label="状态" />
    <el-table-column label="操作" width="150">
      <template #default="scope">
        <el-button v-if="canWrite" link type="primary" @click="emit('edit', scope.row)">编辑</el-button>
        <el-button v-if="canWrite" link type="danger" @click="emit('delete', scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
