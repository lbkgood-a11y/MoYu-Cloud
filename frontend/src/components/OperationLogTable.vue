<script setup lang="ts">
interface OperationLog {
  id: string;
  username: string;
  action: string;
  resource: string;
  detail: string;
  createdAt: string;
}
defineProps<{ logs: OperationLog[] }>();
</script>
<template>
  <el-table :data="logs" stripe>
    <template #empty><el-empty description="暂无操作日志" /></template>
    <el-table-column prop="createdAt" label="时间" width="190" />
    <el-table-column prop="username" label="用户" width="100" />
    <el-table-column prop="action" label="动作" width="100" />
    <el-table-column prop="resource" label="资源" width="120" />
    <el-table-column prop="detail" label="详情" />
  </el-table>
</template>
