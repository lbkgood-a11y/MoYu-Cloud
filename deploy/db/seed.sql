-- MoYu-Cloud MVP 演示数据
USE moyu_cloud;

INSERT INTO customer (name, contact, phone, status)
SELECT '示例客户', '张三', '13800138000', 'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM customer WHERE name = '示例客户');

-- 初始化管理员角色和菜单权限
INSERT INTO sys_role (role_code, role_name, enabled)
SELECT 'admin', '系统管理员', 1
WHERE NOT EXISTS (SELECT 1 FROM sys_role WHERE role_code = 'admin');

INSERT INTO sys_menu (parent_id, menu_name, permission, menu_type, enabled)
SELECT 0, '客户管理', 'customer:read', 'M', 1
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE permission = 'customer:read');

INSERT INTO sys_menu (parent_id, menu_name, permission, menu_type, enabled)
SELECT 0, '客户写入', 'customer:write', 'B', 1
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE permission = 'customer:write');

INSERT INTO sys_menu (parent_id, menu_name, permission, menu_type, enabled)
SELECT 0, '用户查询', 'system:user:read', 'M', 1
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE permission = 'system:user:read');

INSERT INTO sys_menu (parent_id, menu_name, permission, menu_type, enabled)
SELECT 0, '用户管理', 'system:user:write', 'B', 1
WHERE NOT EXISTS (SELECT 1 FROM sys_menu WHERE permission = 'system:user:write');

INSERT INTO sys_user_role (user_id, role_id)
SELECT u.id, r.id FROM sys_user u JOIN sys_role r ON r.role_code = 'admin'
WHERE u.username = 'admin'
  AND NOT EXISTS (SELECT 1 FROM sys_user_role ur WHERE ur.user_id = u.id AND ur.role_id = r.id);

INSERT INTO sys_role_menu (role_id, menu_id)
SELECT r.id, m.id FROM sys_role r JOIN sys_menu m
WHERE r.role_code = 'admin'
  AND NOT EXISTS (SELECT 1 FROM sys_role_menu rm WHERE rm.role_id = r.id AND rm.menu_id = m.id);
