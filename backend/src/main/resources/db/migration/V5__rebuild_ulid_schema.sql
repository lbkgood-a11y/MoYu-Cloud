-- 破坏性本地重建：所有业务主键与关联键统一为 ULID 字符串。
DROP TABLE IF EXISTS sys_role_menu;
DROP TABLE IF EXISTS sys_user_role;
DROP TABLE IF EXISTS operation_log;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS sys_menu;
DROP TABLE IF EXISTS sys_user;
DROP TABLE IF EXISTS sys_role;

CREATE TABLE sys_user (
    id CHAR(26) CHARACTER SET ascii NOT NULL,
    username VARCHAR(64) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    role_code VARCHAR(64) NOT NULL DEFAULT 'admin',
    PRIMARY KEY (id), UNIQUE KEY uk_user_username (username)
);
CREATE TABLE sys_role (
    id CHAR(26) CHARACTER SET ascii NOT NULL,
    role_code VARCHAR(64) NOT NULL,
    role_name VARCHAR(100) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id), UNIQUE KEY uk_role_code (role_code)
);
CREATE TABLE sys_menu (
    id CHAR(26) CHARACTER SET ascii NOT NULL,
    parent_id CHAR(26) CHARACTER SET ascii NOT NULL,
    menu_name VARCHAR(100) NOT NULL,
    permission VARCHAR(150),
    menu_type CHAR(1) NOT NULL DEFAULT 'M',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id)
);
CREATE TABLE customer (
    id CHAR(26) CHARACTER SET ascii NOT NULL,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
CREATE TABLE operation_log (
    id CHAR(26) CHARACTER SET ascii NOT NULL,
    username VARCHAR(64) NOT NULL,
    action VARCHAR(100) NOT NULL,
    resource VARCHAR(100) NOT NULL,
    detail VARCHAR(500),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);
CREATE TABLE sys_role_menu (
    role_id CHAR(26) CHARACTER SET ascii NOT NULL,
    menu_id CHAR(26) CHARACTER SET ascii NOT NULL,
    PRIMARY KEY (role_id, menu_id)
);
CREATE TABLE sys_user_role (
    user_id CHAR(26) CHARACTER SET ascii NOT NULL,
    role_id CHAR(26) CHARACTER SET ascii NOT NULL,
    PRIMARY KEY (user_id, role_id)
);
