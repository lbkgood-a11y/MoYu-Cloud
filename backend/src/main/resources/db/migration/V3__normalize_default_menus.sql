-- 统一默认菜单：导航菜单与按钮权限分离，并补齐操作日志菜单。
UPDATE sys_menu SET menu_name = '用户管理', menu_type = 'M' WHERE permission = 'system:user:read';
DELETE FROM sys_menu WHERE permission IN ('customer:write', 'system:user:write');
INSERT INTO sys_menu (parent_id, menu_name, permission, menu_type, enabled)
SELECT 0, '角色管理', 'system:role:read', 'M', TRUE
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE permission = 'system:role:read');
INSERT INTO sys_menu (parent_id, menu_name, permission, menu_type, enabled)
SELECT 0, '菜单管理', 'system:menu:read', 'M', TRUE
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE permission = 'system:menu:read');
INSERT INTO sys_menu (parent_id, menu_name, permission, menu_type, enabled)
SELECT 0, '操作日志', 'audit:read', 'M', TRUE
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE permission = 'audit:read');
INSERT INTO sys_role_menu (role_id, menu_id)
SELECT r.id, m.id FROM sys_role r JOIN sys_menu m
WHERE r.role_code = 'admin'
  AND NOT EXISTS (SELECT 1 FROM sys_role_menu rm WHERE rm.role_id = r.id AND rm.menu_id = m.id);
