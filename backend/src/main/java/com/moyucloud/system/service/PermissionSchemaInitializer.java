package com.moyucloud.system.service;

import com.moyucloud.shared.Ulid;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/** 启动时补齐 MVP 权限关联表，保证已有数据库可以平滑升级。 */
@Component
public class PermissionSchemaInitializer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public PermissionSchemaInitializer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /** 幂等创建用户角色关联表和角色菜单关联表。 */
    @Override
    public void run(String... args) {
        jdbcTemplate.execute(
                "CREATE TABLE IF NOT EXISTS sys_user_role ("
                        + "user_id CHAR(26) CHARACTER SET ascii NOT NULL, role_id CHAR(26) CHARACTER SET ascii NOT NULL, "
                        + "PRIMARY KEY (user_id, role_id)) ENGINE=InnoDB");
        jdbcTemplate.execute(
                "CREATE TABLE IF NOT EXISTS sys_role_menu ("
                        + "role_id CHAR(26) CHARACTER SET ascii NOT NULL, menu_id CHAR(26) CHARACTER SET ascii NOT NULL, "
                        + "PRIMARY KEY (role_id, menu_id)) ENGINE=InnoDB");
        initializeDefaultMenus();
    }

    /** 初始化管理员角色、默认菜单和关联关系，重复启动不会重复插入。 */
    private void initializeDefaultMenus() {
        jdbcTemplate.update(
                "INSERT INTO sys_role (id, role_code, role_name, enabled) "
                        + "SELECT ?, 'admin', '系统管理员', 1 WHERE NOT EXISTS "
                        + "(SELECT 1 FROM sys_role WHERE role_code = 'admin')",
                Ulid.next());
        insertMenu("客户管理", "customer:read", "M");
        insertMenu("用户管理", "system:user:read", "M");
        insertMenu("角色管理", "system:role:read", "M");
        insertMenu("角色写入", "system:role:write", "B");
        insertMenu("菜单管理", "system:menu:read", "M");
        insertMenu("操作日志", "audit:read", "M");
        insertMenu("客户写入", "customer:write", "B");
        insertMenu("用户写入", "system:user:write", "B");
        jdbcTemplate.update(
                "INSERT INTO sys_user_role (user_id, role_id) "
                        + "SELECT u.id, r.id FROM sys_user u JOIN sys_role r ON r.role_code = 'admin' "
                        + "WHERE u.username = 'admin' AND NOT EXISTS "
                        + "(SELECT 1 FROM sys_user_role ur WHERE ur.user_id = u.id AND ur.role_id = r.id)");
        jdbcTemplate.update(
                "INSERT INTO sys_role_menu (role_id, menu_id) "
                        + "SELECT r.id, m.id FROM sys_role r JOIN sys_menu m WHERE r.role_code = 'admin' "
                        + "AND NOT EXISTS (SELECT 1 FROM sys_role_menu rm WHERE rm.role_id = r.id AND rm.menu_id = m.id)");
    }

    /** 幂等插入一个默认菜单权限。 */
    private void insertMenu(String name, String permission, String type) {
        jdbcTemplate.update(
                "INSERT INTO sys_menu (id, parent_id, menu_name, permission, menu_type, enabled) "
                        + "SELECT ?, ?, ?, ?, ?, 1 WHERE NOT EXISTS "
                        + "(SELECT 1 FROM sys_menu WHERE permission = ?)",
                Ulid.next(),
                "00000000000000000000000000",
                name,
                permission,
                type,
                permission);
    }
}
