<script setup lang="ts">
import { useRouter } from 'vue-router';
import { firstAccessiblePath } from '../navigation';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();

function returnHome() {
  const path = firstAccessiblePath(auth.hasPermission);
  if (path) {
    router.replace(path);
    return;
  }

  auth.clearSession();
  router.replace('/login');
}
</script>

<template>
  <el-result icon="warning" title="无权访问"
    ><template #extra><el-button type="primary" @click="returnHome">返回首页</el-button></template></el-result
  >
</template>
