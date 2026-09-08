package com.moyucloud.system.service;

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
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS sys_user_role ("
                + "user_id BIGINT NOT NULL, role_id BIGINT NOT NULL, "
                + "PRIMARY KEY (user_id, role_id)) ENGINE=InnoDB");
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS sys_role_menu ("
                + "role_id BIGINT NOT NULL, menu_id BIGINT NOT NULL, "
                + "PRIMARY KEY (role_id, menu_id)) ENGINE=InnoDB");
    }
}
