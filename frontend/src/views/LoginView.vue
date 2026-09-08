<script setup>
import { ref } from 'vue'; import { useRouter, useRoute } from 'vue-router'; import { ElMessage } from 'element-plus'; import { api } from '../api'; import { useAuthStore } from '../stores/auth';
const router=useRouter(), route=useRoute(), auth=useAuthStore(), username=ref('admin'), password=ref('admin12345'), loading=ref(false);
async function submit(){loading.value=true;try{const r=(await api.post('/auth/login',{username:username.value,password:password.value})).data.data;auth.setSession(r.accessToken,[],username.value);const me=(await api.get('/auth/me')).data.data;auth.setPermissions(me.permissions||[]);router.replace(route.query.redirect||'/customers')}catch{auth.clearSession();ElMessage.error('登录失败，请检查账号和密码')}finally{loading.value=false}}
</script>
<template><div class="login-page"><el-card class="login-card"><h2>MoYu Cloud 管理平台</h2><el-form @submit.prevent="submit"><el-form-item label="用户名"><el-input v-model="username" /></el-form-item><el-form-item label="密码"><el-input v-model="password" type="password" show-password /></el-form-item><el-button type="primary" native-type="submit" :loading="loading" style="width:100%">登录</el-button></el-form></el-card></div></template>
<style scoped>.login-page{min-height:100vh;display:grid;place-items:center;background:#f5f7fa}.login-card{width:380px}.login-card h2{text-align:center;margin:0 0 24px}</style>
