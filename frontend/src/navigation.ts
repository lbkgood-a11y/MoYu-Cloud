export const homeRoutes = [
  { path: '/customers', permission: 'customer:read' },
  { path: '/users', permission: 'system:user:read' },
  { path: '/roles', permission: 'system:role:read' },
  { path: '/menus', permission: 'system:menu:read' },
  { path: '/logs', permission: 'audit:read' },
] as const;

export function firstAccessiblePath(hasPermission: (permission: string) => boolean) {
  return homeRoutes.find(({ permission }) => hasPermission(permission))?.path;
}
