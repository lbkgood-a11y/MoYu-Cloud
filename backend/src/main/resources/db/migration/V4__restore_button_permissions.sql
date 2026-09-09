-- 按钮权限不参与导航，但页面操作仍需要保留。
INSERT INTO sys_menu (parent_id, menu_name, permission, menu_type, enabled)
SELECT 0, '客户写入', 'customer:write', 'B', TRUE
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE permission = 'customer:write');
INSERT INTO sys_menu (parent_id, menu_name, permission, menu_type, enabled)
SELECT 0, '用户写入', 'system:user:write', 'B', TRUE
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE permission = 'system:user:write');
INSERT INTO sys_role_menu (role_id, menu_id)
SELECT r.id, m.id FROM sys_role r JOIN sys_menu m
WHERE r.role_code = 'admin'
  AND m.permission IN ('customer:write', 'system:user:write')
  AND NOT EXISTS (SELECT 1 FROM sys_role_menu rm WHERE rm.role_id = r.id AND rm.menu_id = m.id);
