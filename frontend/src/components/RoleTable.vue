<script setup lang="ts">
import CrudTable from './crud/CrudTable.vue';
const props=defineProps<{roles:any[];canWrite:boolean}>();
const emit=defineEmits<{(e:'permission',r:any):void;(e:'field-permission',r:any):void;(e:'edit',r:any):void;(e:'remove',r:any):void;(e:'toggle',r:any):void}>();
const fields=[{code:'roleCode',label:'角色编码',type:'text',table:true},{code:'roleName',label:'角色名称',type:'text',table:true},{code:'enabled',label:'状态',type:'switch',table:true}];
</script>
<template><CrudTable :fields="fields" :rows="props.roles" :can-write="canWrite"><template #actions="{row}"><el-button link type="primary" @click="emit('permission',row)">菜单授权</el-button><el-button link type="primary" @click="emit('field-permission',row)">列权限</el-button><el-button link type="primary" @click="emit('edit',row)">编辑</el-button><el-button link @click="emit('toggle',row)">{{row.enabled?'禁用':'启用'}}</el-button><el-button link type="danger" @click="emit('remove',row)">删除</el-button></template></CrudTable></template>
