<script setup lang="ts">
defineProps<{ page: number; size: number; total: number }>();
const emit = defineEmits<{
  (event: 'update:page', value: number): void;
  (event: 'update:size', value: number): void;
}>();
</script>

<template>
  <el-pagination
    class="customer-pagination"
    :current-page="page"
    :page-size="size"
    layout="total, sizes, prev, pager, next"
    :page-sizes="[10, 20, 50]"
    :total="total"
    @update:current-page="emit('update:page', $event)"
    @update:page-size="emit('update:size', $event)"
  />
</template>
