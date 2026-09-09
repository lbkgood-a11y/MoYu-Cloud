<script setup>
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { api } from '../api';
import { useAuthStore } from '../stores/auth';
const router = useRouter(),
  route = useRoute(),
  auth = useAuthStore(),
  username = ref('admin'),
  password = ref('admin123'),
  loading = ref(false);
async function submit() {
  loading.value = true;
  try {
    const r = (await api.post('/auth/login', { username: username.value, password: password.value })).data.data;
    auth.setSession(r.accessToken, [], username.value);
    const me = (await api.get('/auth/me')).data.data;
    auth.setPermissions(me.permissions || []);
    router.replace(route.query.redirect || '/customers');
  } catch {
    auth.clearSession();
    ElMessage.error('登录失败，请检查账号和密码');
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <div class="login-page">
    <div class="login-brand"><span class="brand-mark">M</span><div><strong>MoYu Cloud</strong><small>让业务系统快速落座</small></div></div><el-card class="login-card"
      ><h2>欢迎回来</h2><p class="subtitle">登录管理平台继续工作</p>
      <el-form @submit.prevent="submit"
        ><el-form-item label="用户名"><el-input v-model="username" /></el-form-item
        ><el-form-item label="密码"><el-input v-model="password" type="password" show-password /></el-form-item
        ><el-button type="primary" native-type="submit" :loading="loading" style="width: 100%">登录</el-button></el-form
      ></el-card
    >
  </div>
</template>
<style scoped>
.login-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(circle at 15% 20%,#dbeafe 0,transparent 35%),radial-gradient(circle at 85% 80%,#e0e7ff 0,transparent 35%),#f4f7fb;
  position:relative;
}
.login-brand{position:absolute;top:48px;display:flex;align-items:center;gap:10px;font-size:20px}.login-brand small{display:block;font-size:12px;color:#64748b;font-weight:400;margin-top:4px}.brand-mark{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,#2563eb,#60a5fa);color:#fff;font-weight:800}
.login-card {
  width: 380px;
  padding: 12px;
}
.login-card h2 {
  text-align: center;
  margin: 0 0 24px;
}
.subtitle{text-align:center;color:#94a3b8;margin:-14px 0 24px;font-size:13px}
</style>
