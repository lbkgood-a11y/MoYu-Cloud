<script setup lang="ts">
type Field={code:string;label:string;type:string;table?:boolean};
const props=defineProps<{fields:Field[];rows:Record<string,unknown>[];loading?:boolean;canWrite?:boolean;selectable?:boolean}>();
const emit=defineEmits<{(e:'selection-change',rows:Record<string,unknown>[]):void}>();
</script>
<template><el-table v-loading="props.loading" :data="props.rows" stripe @selection-change="emit('selection-change',$event)"><el-table-column v-if="props.selectable" type="selection" width="48"/><template #empty><el-empty description="暂无数据"/></template><el-table-column v-for="f in props.fields.filter(x=>x.table)" :key="f.code" :prop="f.code" :label="f.label"><template #default="scope"><slot :name="`cell-${f.code}`" :row="scope.row" :field="f">{{scope.row[f.code]}}</slot></template></el-table-column><el-table-column v-if="props.canWrite||$slots.actions" label="操作"><template #default="scope"><slot name="actions" :row="scope.row"/></template></el-table-column></el-table></template>
