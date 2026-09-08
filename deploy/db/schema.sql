-- MoYu-Cloud MVP 数据库结构
CREATE DATABASE IF NOT EXISTS moyu_cloud DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE moyu_cloud;

CREATE TABLE IF NOT EXISTS sys_user (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '用户主键',
    username VARCHAR(64) NOT NULL COMMENT '用户名',
    password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希',
    enabled TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
    role_code VARCHAR(64) NOT NULL DEFAULT 'admin' COMMENT '角色编码',
    PRIMARY KEY (id),
    UNIQUE KEY uk_user_username (username)
) ENGINE=InnoDB COMMENT='系统用户表';

CREATE TABLE IF NOT EXISTS customer (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '客户主键',
    name VARCHAR(100) NOT NULL COMMENT '客户名称',
    contact VARCHAR(50) NOT NULL COMMENT '联系人',
    phone VARCHAR(20) NOT NULL COMMENT '联系电话',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' COMMENT '客户状态',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (id),
    KEY idx_customer_name (name)
) ENGINE=InnoDB COMMENT='客户信息表';

CREATE TABLE IF NOT EXISTS operation_log (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '日志主键',
    username VARCHAR(64) NOT NULL COMMENT '操作用户',
    action VARCHAR(100) NOT NULL COMMENT '操作动作',
    resource VARCHAR(100) NOT NULL COMMENT '操作资源',
    detail VARCHAR(500) NULL COMMENT '操作详情',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
    PRIMARY KEY (id),
    KEY idx_operation_log_created_at (created_at)
) ENGINE=InnoDB COMMENT='操作审计日志表';

CREATE TABLE IF NOT EXISTS sys_role (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '角色主键',
    role_code VARCHAR(64) NOT NULL COMMENT '角色编码',
    role_name VARCHAR(100) NOT NULL COMMENT '角色名称',
    enabled TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
    PRIMARY KEY (id),
    UNIQUE KEY uk_role_code (role_code)
) ENGINE=InnoDB COMMENT='系统角色表';

CREATE TABLE IF NOT EXISTS sys_menu (
    id BIGINT NOT NULL AUTO_INCREMENT COMMENT '菜单主键',
    parent_id BIGINT NOT NULL DEFAULT 0 COMMENT '父菜单编号',
    menu_name VARCHAR(100) NOT NULL COMMENT '菜单名称',
    permission VARCHAR(150) NULL COMMENT '权限标识',
    menu_type CHAR(1) NOT NULL DEFAULT 'M' COMMENT '菜单类型',
    enabled TINYINT(1) NOT NULL DEFAULT 1 COMMENT '是否启用',
    PRIMARY KEY (id),
    KEY idx_menu_parent (parent_id)
) ENGINE=InnoDB COMMENT='系统菜单表';

CREATE TABLE IF NOT EXISTS sys_user_role (
    user_id BIGINT NOT NULL COMMENT '用户编号',
    role_id BIGINT NOT NULL COMMENT '角色编号',
    PRIMARY KEY (user_id, role_id)
) ENGINE=InnoDB COMMENT='用户角色关联表';

CREATE TABLE IF NOT EXISTS sys_role_menu (
    role_id BIGINT NOT NULL COMMENT '角色编号',
    menu_id BIGINT NOT NULL COMMENT '菜单编号',
    PRIMARY KEY (role_id, menu_id)
) ENGINE=InnoDB COMMENT='角色菜单关联表';
