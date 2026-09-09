import { createRouter, createWebHistory } from 'vue-router';
import AdminLayout from '../layouts/AdminLayout.vue';
import CustomerView from '../views/customer/CustomerView.vue';
import UserView from '../views/system/UserView.vue';
import RoleView from '../views/system/RoleView.vue';
import MenuView from '../views/system/MenuView.vue';
import OperationLogView from '../views/audit/OperationLogView.vue';
import LoginView from '../views/LoginView.vue';
import UnauthorizedView from '../views/UnauthorizedView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import DepartmentView from '../views/system/DepartmentView.vue';
import DictionaryView from '../views/system/DictionaryView.vue';
import { useAuthStore } from '../stores/auth';
/** 管理端页面权限元数据；页面仍由当前壳层编排，后续可逐步迁移到路由视图。 */
export const routePermissions = {
    customers: 'customer:read',
    users: 'system:user:read',
    roles: 'system:role:read',
    menus: 'system:menu:read',
    departments: 'system:user:read',
    logs: 'audit:read',
};
export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/login', name: 'login', component: LoginView },
        { path: '/403', name: 'unauthorized', component: UnauthorizedView },
        {
            path: '/',
            component: AdminLayout,
            children: [
                { path: '', redirect: '/customers' },
                {
                    path: 'customers',
                    name: 'customers',
                    component: CustomerView,
                    meta: { permission: routePermissions.customers },
                },
                { path: 'users', name: 'users', component: UserView, meta: { permission: routePermissions.users } },
                { path: 'roles', name: 'roles', component: RoleView, meta: { permission: routePermissions.roles } },
                { path: 'menus', name: 'menus', component: MenuView, meta: { permission: routePermissions.menus } },
                { path: 'departments', name: 'departments', component: DepartmentView, meta: { permission: routePermissions.departments } },
                { path: 'dictionaries', name: 'dictionaries', component: DictionaryView, meta: { permission: routePermissions.departments } },
                { path: 'logs', name: 'logs', component: OperationLogView, meta: { permission: routePermissions.logs } },
            ],
        },
        { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
    ],
});
router.beforeEach((to) => {
    const auth = useAuthStore();
    if (to.path === '/login' && auth.loggedIn)
        return '/customers';
    if (to.path !== '/login' && !auth.loggedIn)
        return { path: '/login', query: { redirect: to.fullPath } };
    if (to.meta.permission && !auth.hasPermission(String(to.meta.permission)))
        return '/403';
});
