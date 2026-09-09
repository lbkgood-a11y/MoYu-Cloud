<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { fetchOperationLogs } from '../../api/audit';
import OperationLogTable from '../../components/OperationLogTable.vue';
import CustomerPagination from '../../components/CustomerPagination.vue';
const logs = ref<any[]>([]);
const page = ref(1);
const size = ref(10);
const total = ref(0);
async function load() {
  try {
    const r = (await fetchOperationLogs(page.value, size.value)).data.data;
    logs.value = r.items;
    total.value = r.total;
  } catch {
    ElMessage.error('操作日志加载失败');
  }
}
onMounted(load);
</script>
<template>
  <el-card
    ><template #header>操作日志</template><OperationLogTable :logs="logs" /><CustomerPagination
      :page="page"
      :size="size"
      :total="total"
      @update:page="
        page = $event;
        load();
      "
      @update:size="
        size = $event;
        page = 1;
        load();
      "
  /></el-card>
</template>
