<script setup lang="ts">
interface User { id: number; username: string; roleCode: string; enabled: boolean } interface Role { roleCode: string; roleName: string; enabled: boolean }
const props=defineProps<{users:User[];roles:Role[];canWrite:boolean}>(); const emit=defineEmits<{(e:'toggle',u:User):void;(e:'assign-role',u:User,c:string):void}>();
</script>
<template>
  <el-table :data="users" stripe>
    <el-table-column prop="id" label="编号" width="90" />
    <el-table-column prop="username" label="用户名" />
    <el-table-column label="角色"><template #default="s"><el-select v-if="canWrite" :model-value="s.row.roleCode" size="small" @change="emit('assign-role',s.row,$event)"><el-option v-for="r in props.roles" :key="r.roleCode" :label="r.roleName" :value="r.roleCode"/></el-select><span v-else>{{s.row.roleCode}}</span></template></el-table-column>
    <el-table-column label="状态"><template #default="scope"><el-tag :type="scope.row.enabled ? 'success' : 'info'">{{ scope.row.enabled ? '启用' : '禁用' }}</el-tag></template></el-table-column>
    <el-table-column label="操作" width="110"><template #default="scope"><el-button v-if="canWrite" link type="primary" @click="emit('toggle', scope.row)">{{ scope.row.enabled ? '禁用' : '启用' }}</el-button></template></el-table-column>
  </el-table>
</template>
