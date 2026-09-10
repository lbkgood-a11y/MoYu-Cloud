<script setup>
import { reactive, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { api } from '../api';
import { useAuthStore } from '../stores/auth';
const router = useRouter(),
  route = useRoute(),
  auth = useAuthStore(),
  formRef = ref(),
  loading = ref(false);
const loginForm = reactive({ username: '', password: '' });
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
};
async function submit() {
  await formRef.value?.validate(async (valid) => {
    if (!valid) return;
  loading.value = true;
  try {
    const r = (await api.post('/auth/login', loginForm)).data.data;
    auth.setSession(r.accessToken, [], loginForm.username);
    const me = (await api.get('/auth/me')).data.data;
    auth.setPermissions(me.permissions || []);
    router.replace(route.query.redirect || '/customers');
  } catch {
    auth.clearSession();
    ElMessage.error('登录失败，请检查账号和密码');
  } finally {
    loading.value = false;
  }
  });
}
</script>
<template>
  <div class="login-page">
    <div class="login-glow"></div>
    <header class="login-brand"><span class="brand-mark">M</span><div><strong>MoYu Cloud</strong><small>业务开发平台</small></div></header>
    <main class="login-layout">
      <section class="login-intro"><div class="intro-kicker">MOYU CLOUD PLATFORM</div><h1>让业务系统<br /><em>快速落座</em></h1><p>从数据建模到权限管理，统一在一个清晰、可靠的工作台完成。</p><div class="intro-points"><span><b>01</b> 统一业务数据</span><span><b>02</b> 精细权限控制</span><span><b>03</b> 高效协同交付</span></div></section>
      <section class="login-card"
      ><div class="eyebrow">ADMIN CONSOLE</div><h2>欢迎回来</h2><p class="subtitle">登录管理平台，继续你的工作</p>
      <el-form ref="formRef" :model="loginForm" :rules="rules" label-position="top" @submit.prevent="submit"
        ><el-form-item label="用户名" prop="username"><el-input v-model="loginForm.username" size="large" placeholder="请输入用户名" autocomplete="username" /></el-form-item
        ><el-form-item label="密码" prop="password"><el-input v-model="loginForm.password" size="large" type="password" show-password placeholder="请输入密码" autocomplete="current-password" /></el-form-item
        ><el-button class="submit-button" type="primary" native-type="submit" :loading="loading" size="large">{{ loading ? '正在登录…' : '登录' }}</el-button></el-form
    ></section
    ></main>
    <footer class="login-footer">© 2025 MoYu Cloud · 安全、专注、可持续</footer>
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
  overflow:hidden;
}
.login-glow{position:absolute;width:560px;height:560px;border-radius:50%;background:rgba(255,255,255,.5);filter:blur(2px);top:50%;left:50%;transform:translate(-50%,-48%)}.login-brand{position:absolute;top:40px;left:clamp(24px,8vw,120px);display:flex;align-items:center;gap:10px;font-size:20px;z-index:1}.login-brand small{display:block;font-size:11px;color:#94a3b8;font-weight:400;margin-top:4px}.brand-mark{width:38px;height:38px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,#2563eb,#60a5fa);color:#fff;font-weight:800;box-shadow:0 8px 18px rgba(37,99,235,.2)}
.login-layout{width:min(920px,calc(100% - 48px));display:grid;grid-template-columns:1fr 380px;gap:76px;align-items:center;position:relative;z-index:1}.login-intro{color:#172033}.intro-kicker{font-size:11px;letter-spacing:.18em;color:#2563eb;font-weight:700;margin-bottom:18px}.login-intro h1{font-size:46px;line-height:1.16;letter-spacing:-.05em;margin:0 0 20px}.login-intro h1 em{font-style:normal;color:#2563eb}.login-intro p{color:#64748b;line-height:1.8;max-width:360px;margin:0}.intro-points{display:flex;flex-direction:column;gap:14px;margin-top:30px;color:#475569;font-size:13px}.intro-points span{display:flex;align-items:center;gap:12px}.intro-points b{font-size:11px;color:#2563eb;letter-spacing:.08em}
.login-card {
  width: 380px;
  padding: 12px;
  z-index: 1;
  background:rgba(255,255,255,.94);
  box-shadow:var(--moyu-shadow),0 20px 55px rgba(30,64,175,.12);
}
.eyebrow{font-size:11px;letter-spacing:.16em;color:#2563eb;font-weight:700;margin:4px 0 12px}.login-card h2{text-align:center;font-size:27px;letter-spacing:-.03em;margin:0 0 10px}.login-card :deep(.el-form-item__label){padding-bottom:6px;color:#475569;font-weight:600}.login-card :deep(.el-form-item){margin-bottom:18px}.submit-button{width:100%;margin-top:4px;font-weight:600;letter-spacing:.02em}.login-card :deep(.el-input__wrapper){min-height:42px}
.subtitle{text-align:center;color:#94a3b8;margin:-14px 0 24px;font-size:13px}
.login-footer{position:absolute;bottom:24px;color:#94a3b8;font-size:12px;z-index:1}@media (max-width:768px){.login-layout{display:block;width:min(440px,calc(100% - 32px));padding-top:42px}.login-intro{display:none}.login-brand{top:28px;left:20px}.login-card{width:100%}.login-footer{bottom:14px;font-size:11px}}
</style>
