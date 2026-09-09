package com.moyucloud.api;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/** 真实 MySQL 兼容性烟囱测试；设置 RUN_MYSQL_TESTS=true 后执行。 */
@Testcontainers
@EnabledIfEnvironmentVariable(named = "RUN_MYSQL_TESTS", matches = "true")
class MySqlContainerSmokeTest {
    @Container static final MySQLContainer<?> MYSQL = new MySQLContainer<>("mysql:8.4");

    @Test
    void mysqlContainerStarts() {
        assertThat(MYSQL.isRunning()).isTrue();
        assertThat(MYSQL.getJdbcUrl()).contains("jdbc:mysql:");
    }
}
