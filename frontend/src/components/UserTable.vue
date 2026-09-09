<script setup lang="ts">
import CrudTable from './crud/CrudTable.vue';
const props=defineProps<{users:any[];roles:any[];canWrite:boolean}>();
const emit=defineEmits<{(e:'toggle',u:any):void;(e:'assign-role',u:any,c:string):void;(e:'edit',u:any):void;(e:'remove',u:any):void;(e:'reset-password',u:any):void}>();
const fields=[{code:'username',label:'用户名',type:'text',table:true},{code:'roleCode',label:'角色',type:'select',table:true},{code:'enabled',label:'状态',type:'switch',table:true}];
</script>
<template><CrudTable :fields="fields" :rows="props.users" :can-write="canWrite"><template #cell-roleCode="{row}"><el-select v-if="canWrite" :model-value="row.roleCode" size="small" @change="emit('assign-role',row,$event)"><el-option v-for="r in props.roles" :key="r.roleCode" :label="r.roleName" :value="r.roleCode"/></el-select><span v-else>{{row.roleCode}}</span></template><template #actions="{row}"><el-button link type="primary" @click="emit('edit',row)">编辑</el-button><el-button link @click="emit('reset-password',row)">重置密码</el-button><el-button link @click="emit('toggle',row)">{{row.enabled?'禁用':'启用'}}</el-button><el-button link type="danger" @click="emit('remove',row)">删除</el-button></template></CrudTable></template>
