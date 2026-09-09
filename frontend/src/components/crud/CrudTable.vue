<script setup lang="ts">
defineProps<{fields:{code:string;label:string;type:string;table?:boolean}[];rows:Record<string,unknown>[];loading?:boolean;canWrite?:boolean}>();
</script>
<template><el-table v-loading="loading" :data="rows" stripe><template #empty><el-empty description="暂无数据"/></template><el-table-column v-for="f in fields.filter(x=>x.table)" :key="f.code" :prop="f.code" :label="f.label"><template #default="scope"><slot :name="`cell-${f.code}`" :row="scope.row" :field="f">{{scope.row[f.code]}}</slot></template></el-table-column><el-table-column v-if="canWrite||$slots.actions" label="操作"><template #default="scope"><slot name="actions" :row="scope.row"/></template></el-table-column></el-table></template>
