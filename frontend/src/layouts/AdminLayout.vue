<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useRoute, useRouter, RouterView } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { ArrowLeft, ArrowRight, DataAnalysis, Document, Expand, Files, Fold, Key, Monitor, Refresh, Setting, User, UserFilled } from '@element-plus/icons-vue';
const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const collapsed = ref(false);
const sidebarBeforeFullscreen = ref(false);
const menus = [
  { path: '/customers', label: '客户管理', group: '业务工作台', permission: 'customer:read', icon: UserFilled },
  { path: '/users', label: '用户管理', group: '系统设置', permission: 'system:user:read', icon: User },
  { path: '/roles', label: '角色管理', group: '系统设置', permission: 'system:role:read', icon: Key },
  { path: '/menus', label: '菜单管理', group: '系统设置', permission: 'system:menu:read', icon: Monitor },
  { path: '/departments', label: '组织部门', group: '系统设置', permission: 'system:user:read', icon: Files },
  { path: '/dictionaries', label: '字典管理', group: '系统设置', permission: 'system:user:read', icon: Document },
  { path: '/modeling', label: '数据表建模', group: '业务工作台', permission: 'system:user:read', icon: DataAnalysis },
  { path: '/logs', label: '操作日志', group: '系统设置', permission: 'audit:read', icon: Setting },
];
const visibleMenus = computed(() => menus.filter((m) => auth.hasPermission(m.permission)));
const menuGroups = computed(() => [...new Set(visibleMenus.value.map((m) => m.group))]);
const breadcrumb = computed(() => menus.find((m) => m.path === route.path)?.label || '管理控制台');
function logout() {
  auth.clearSession();
  router.replace('/login');
}
function refreshPage() { globalThis.location.reload(); }
function handleFullscreenChange() {
  if (globalThis.document.fullscreenElement) {
    sidebarBeforeFullscreen.value = collapsed.value;
    collapsed.value = true;
  } else {
    collapsed.value = sidebarBeforeFullscreen.value;
  }
}
function toggleFullscreen() { if (!globalThis.document.fullscreenElement) globalThis.document.documentElement.requestFullscreen?.(); else globalThis.document.exitFullscreen?.(); }
onMounted(() => globalThis.document.addEventListener('fullscreenchange', handleFullscreenChange));
onBeforeUnmount(() => globalThis.document.removeEventListener('fullscreenchange', handleFullscreenChange));
</script>
<template>
  <el-container class="shell"
    ><el-aside :width="collapsed ? '72px' : '248px'" :class="['sidebar', { 'is-collapsed': collapsed }]"
      ><div class="brand"><span class="brand-mark">M</span><div v-show="!collapsed"><strong>MoYu Cloud</strong><small>业务开发平台</small></div></div><div v-show="!collapsed" class="workspace-label">WORKSPACE</div>
      <el-menu :default-active="route.path" :collapse="collapsed" router><template v-for="group in menuGroups" :key="group"><div v-show="!collapsed" class="menu-group">{{ group }}</div><el-menu-item v-for="item in visibleMenus.filter((m) => m.group === group)" :key="item.path" :index="item.path"><el-icon><component :is="item.icon" /></el-icon><template #title>{{ item.label }}</template></el-menu-item></template></el-menu><button class="collapse-toggle" type="button" :aria-label="collapsed ? '展开菜单' : '收起菜单'" @click="collapsed = !collapsed"><el-icon><component :is="collapsed ? ArrowRight : ArrowLeft" /></el-icon><span v-show="!collapsed">收起菜单</span></button
      ></el-aside
    ><el-container
      ><el-header class="topbar"
      ><div class="topbar-left"><el-button class="nav-toggle" text circle :aria-label="collapsed ? '展开菜单' : '收起菜单'" @click="collapsed = !collapsed"><el-icon><component :is="collapsed ? ArrowRight : Fold" /></el-icon></el-button><el-breadcrumb
          ><el-breadcrumb-item>首页</el-breadcrumb-item
          ><el-breadcrumb-item>{{ breadcrumb }}</el-breadcrumb-item></el-breadcrumb></div
        ><div class="topbar-actions"><el-button class="toolbar-button" text circle aria-label="刷新页面" @click="refreshPage"><el-icon><Refresh /></el-icon></el-button><el-button class="toolbar-button fullscreen-button" text circle aria-label="全屏显示" @click="toggleFullscreen"><el-icon><Expand /></el-icon></el-button><el-divider direction="vertical" /><el-dropdown trigger="click"><span class="user-menu"><el-avatar :size="30" class="user-avatar">{{ (auth.username || 'U').slice(0, 1).toUpperCase() }}</el-avatar><span class="user-name">{{ auth.username || '用户' }}</span><el-icon class="user-arrow"><ArrowRight /></el-icon></span><template #dropdown><el-dropdown-menu><el-dropdown-item disabled>{{ auth.username || '用户' }}</el-dropdown-item><el-dropdown-item divided @click="logout">退出登录</el-dropdown-item></el-dropdown-menu></template></el-dropdown></div></el-header
      ><el-main><div class="content-shell"><RouterView /></div></el-main></el-container
  ></el-container>
</template>
<style scoped>
.shell {
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
}
.brand {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-size: 18px;
  color: #172033;
  gap: 10px;
}
.brand-mark{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;background:linear-gradient(135deg,#2563eb,#60a5fa);color:#fff;font-weight:800;box-shadow:0 5px 12px rgba(37,99,235,.22)}.brand small{display:block;font-size:11px;color:#94a3b8;font-weight:400;margin-top:2px}.sidebar{background:#fff;border-right:1px solid #e5eaf2;box-shadow:4px 0 18px rgba(15,23,42,.025)}.el-menu{border-right:0;padding:12px 8px}.el-menu-item{height:44px;margin:4px 2px;border-radius:10px;color:#64748b}.el-menu-item:hover{background:#f8fafc;color:#2563eb}.el-menu-item.is-active{background:#eff6ff;color:#2563eb;font-weight:600}.user-avatar{background:#dbeafe;color:#2563eb;font-size:13px;font-weight:700}
.topbar {
  flex: 0 0 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  background: rgba(255,255,255,.86);
  backdrop-filter: blur(10px);
}
.user {
  display: flex;
  align-items: center;
  gap: 16px;
}
.el-main {
  background: var(--moyu-bg);
  padding: 10px 12px 12px;
  overflow: auto;
  min-height: 0;
}
.content-shell{max-width:1600px;margin:0 auto;min-height:100%}.page-enter-active,.page-leave-active{transition:opacity .16s ease,transform .16s ease}.page-enter-from{opacity:0;transform:translateY(4px)}.page-leave-to{opacity:0;transform:translateY(-4px)}
.shell>.el-container{height:100%;min-width:0;min-height:0}.sidebar{flex:0 0 auto;overflow-y:auto;overflow-x:hidden}.content-shell>.page-enter-active,.content-shell>.page-leave-active{width:100%}
</style>
<style scoped>
.sidebar{position:relative;transition:width .2s ease;overflow:hidden}.sidebar.is-collapsed .brand{justify-content:center;padding:0}.workspace-label,.menu-group{padding:7px 18px 4px;color:#a0aec0;font-size:10px;font-weight:700;letter-spacing:.12em}.menu-group{padding-top:12px}.el-menu{padding:4px 8px}.el-menu-item .el-icon{font-size:17px;margin-right:12px}.el-menu-item.is-active::before{content:'';position:absolute;left:0;width:3px;height:20px;border-radius:0 4px 4px 0;background:#2563eb}.collapse-toggle{position:absolute;bottom:12px;left:12px;right:12px;border:1px solid #e5eaf2;background:#fff;color:#64748b;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;font-size:12px}.collapse-toggle:hover{color:#2563eb;background:#f8fafc}
.topbar-left,.topbar-actions{display:flex;align-items:center}.topbar-left{gap:10px}.nav-toggle,.toolbar-button{color:#64748b;font-size:17px}.nav-toggle:hover,.toolbar-button:hover{color:#2563eb;background:#eff6ff}.topbar-actions{gap:4px}.topbar-actions .el-divider{height:20px;margin:0 10px}.user-menu{display:flex;align-items:center;gap:8px;padding:4px 8px;border-radius:8px;cursor:pointer}.user-menu:hover{background:#f8fafc}.user-name{font-size:13px;color:#475569;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.user-arrow{font-size:12px;color:#94a3b8;transform:rotate(90deg)}
@media (max-width:768px){.sidebar{width:68px!important}.brand div,.workspace-label,.menu-group,.collapse-toggle span{display:none}.brand{padding:0 18px}.sidebar .el-menu{padding-left:10px;padding-right:10px}.sidebar .el-menu-item{justify-content:center}.sidebar .el-menu-item .el-icon{margin-right:0}.collapse-toggle{left:10px;right:10px}.el-main{padding:8px}}
</style>
