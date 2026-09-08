<script setup lang="ts">
interface Role { id: number; roleCode: string; roleName: string; enabled: boolean }
defineProps<{ roles: Role[]; canWrite: boolean }>();
const emit = defineEmits<{ (event: 'permission', role: Role): void }>();
</script>
<template>
  <el-table :data="roles" stripe>
    <el-table-column prop="id" label="编号" width="90" />
    <el-table-column prop="roleCode" label="角色编码" />
    <el-table-column prop="roleName" label="角色名称" />
    <el-table-column label="状态"><template #default="scope"><el-tag :type="scope.row.enabled ? 'success' : 'info'">{{ scope.row.enabled ? '启用' : '禁用' }}</el-tag></template></el-table-column>
    <el-table-column label="操作" width="120"><template #default="scope"><el-button v-if="canWrite" link type="primary" @click="emit('permission', scope.row)">菜单授权</el-button></template></el-table-column>
  </el-table>
</template>
