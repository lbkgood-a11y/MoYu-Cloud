-- 为系统管理员角色补齐角色管理及菜单授权权限。
-- 幂等执行，兼容已经存在的管理员角色和菜单数据。
INSERT INTO sys_role_menu (role_id, menu_id)
SELECT r.id, m.id
FROM sys_role r
JOIN sys_menu m ON m.permission IN ('system:role:read', 'system:role:write')
WHERE r.role_code = 'admin'
  AND NOT EXISTS (
      SELECT 1
      FROM sys_role_menu rm
      WHERE rm.role_id = r.id AND rm.menu_id = m.id
  );
