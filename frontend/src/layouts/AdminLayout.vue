<script setup>
import { computed } from 'vue';
import { useRoute, useRouter, RouterView } from 'vue-router';
import { useAuthStore } from '../stores/auth';
const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const menus = [
  { path: '/customers', label: '客户管理', permission: 'customer:read' },
  { path: '/users', label: '用户管理', permission: 'system:user:read' },
  { path: '/roles', label: '角色管理', permission: 'system:role:read' },
  { path: '/menus', label: '菜单管理', permission: 'system:menu:read' },
  { path: '/departments', label: '组织部门', permission: 'system:user:read' },
  { path: '/dictionaries', label: '字典管理', permission: 'system:user:read' },
  { path: '/modeling', label: '数据表建模', permission: 'system:user:read' },
  { path: '/logs', label: '操作日志', permission: 'audit:read' },
];
const visibleMenus = computed(() => menus.filter((m) => auth.hasPermission(m.permission)));
const breadcrumb = computed(() => menus.find((m) => m.path === route.path)?.label || '管理控制台');
function logout() {
  auth.clearSession();
  router.replace('/login');
}
</script>
<template>
  <el-container class="shell"
    ><el-aside width="240px" class="sidebar"
      ><div class="brand"><span class="brand-mark">M</span><div><strong>MoYu Cloud</strong><small>业务开发平台</small></div></div>
      <el-menu :default-active="route.path" router
        ><el-menu-item v-for="item in visibleMenus" :key="item.path" :index="item.path">{{
          item.label
        }}</el-menu-item></el-menu
      ></el-aside
    ><el-container
      ><el-header class="topbar"
        ><el-breadcrumb
          ><el-breadcrumb-item>首页</el-breadcrumb-item
          ><el-breadcrumb-item>{{ breadcrumb }}</el-breadcrumb-item></el-breadcrumb
        >
        <div class="user">
          <span>{{ auth.username || '用户' }}</span
          ><el-button link @click="logout">退出登录</el-button>
        </div></el-header
      ><el-main><RouterView /></el-main></el-container
  ></el-container>
</template>
<style scoped>
.shell {
  min-height: 100vh;
}
.brand {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-size: 18px;
  color: #172033;
  gap: 10px;
}
.brand-mark{width:32px;height:32px;border-radius:10px;display:grid;place-items:center;background:linear-gradient(135deg,#2563eb,#60a5fa);color:#fff;font-weight:800}.brand small{display:block;font-size:11px;color:#94a3b8;font-weight:400;margin-top:2px}.sidebar{background:#fff;border-right:1px solid #e5eaf2}.el-menu{border-right:0}.el-menu-item{margin:4px 10px;border-radius:8px}.el-menu-item.is-active{background:#eff6ff;color:#2563eb;font-weight:600}
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
}
.user {
  display: flex;
  align-items: center;
  gap: 16px;
}
.el-main {
  background: var(--moyu-bg);
  padding: 24px;
}
</style>
