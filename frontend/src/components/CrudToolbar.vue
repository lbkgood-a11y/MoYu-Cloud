<script setup lang="ts">
defineProps<{ title: string; permission?: string }>();
</script>
<template><div class="crud-toolbar"><div class="crud-title">{{ title }}</div><div class="crud-actions"><slot /></div></div></template>
<style scoped>.crud-toolbar{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}.crud-title{font-size:18px;font-weight:600;color:#172033}.crud-actions{display:flex;gap:6px}</style>
