<script setup lang="ts">
import type { Customer } from '../api/customer';

const props = defineProps<{ customers: Customer[]; loading?: boolean; canWrite: boolean }>();
const emit = defineEmits<{ (event: 'edit', customer: Customer): void; (event: 'delete', customer: Customer): void; (event: 'detail', customer: Customer): void }>();
</script>

<template>
  <el-table v-loading="loading" :data="customers" stripe>
    <template #empty><el-empty description="暂无客户数据" /></template>
    <el-table-column prop="id" label="编号" width="90" />
    <el-table-column prop="name" label="客户名称" />
    <el-table-column
      v-if="props.customers.length === 0 || props.customers.some((c) => c.contact !== undefined)"
      prop="contact"
      label="联系人"
    />
    <el-table-column
      v-if="props.customers.length === 0 || props.customers.some((c) => c.phone !== undefined)"
      prop="phone"
      label="联系电话"
    />
    <el-table-column prop="status" label="状态" />
    <el-table-column label="操作" width="150">
      <template #default="scope"><div class="table-actions">
        <el-button v-if="canWrite" link type="primary" @click="emit('edit', scope.row)">编辑</el-button>
        <el-button v-if="canWrite" link type="danger" @click="emit('delete', scope.row)">删除</el-button>
      </div></template>
    </el-table-column>
  </el-table>
</template>
