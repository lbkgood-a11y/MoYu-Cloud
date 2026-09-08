<script setup>
import { computed } from 'vue'; import { useRoute, useRouter, RouterView } from 'vue-router'; import { useAuthStore } from '../stores/auth';
const route=useRoute(); const router=useRouter(); const auth=useAuthStore();
const menus=[{path:'/customers',label:'客户管理',permission:'customer:read'},{path:'/users',label:'用户管理',permission:'system:user:read'},{path:'/roles',label:'角色管理',permission:'system:user:read'},{path:'/menus',label:'菜单管理',permission:'system:user:read'},{path:'/logs',label:'操作日志',permission:'system:user:read'}];
const visibleMenus=computed(()=>menus.filter(m=>auth.hasPermission(m.permission))); const breadcrumb=computed(()=>menus.find(m=>m.path===route.path)?.label || '管理控制台');
function logout(){auth.clearSession();router.replace('/login')}
</script>
<template><el-container class="shell"><el-aside width="220px"><div class="brand">MoYu Cloud</div><el-menu :default-active="route.path" router><el-menu-item v-for="item in visibleMenus" :key="item.path" :index="item.path">{{item.label}}</el-menu-item></el-menu></el-aside><el-container><el-header class="topbar"><el-breadcrumb><el-breadcrumb-item>首页</el-breadcrumb-item><el-breadcrumb-item>{{breadcrumb}}</el-breadcrumb-item></el-breadcrumb><div class="user"><span>{{auth.username || '用户'}}</span><el-button link @click="logout">退出登录</el-button></div></el-header><el-main><RouterView /></el-main></el-container></el-container></template>
<style scoped>.shell{min-height:100vh}.brand{height:60px;display:flex;align-items:center;padding:0 20px;font-size:20px;font-weight:700;color:#409eff}.topbar{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #eee}.user{display:flex;align-items:center;gap:16px}.el-main{background:#f5f7fa}</style>
