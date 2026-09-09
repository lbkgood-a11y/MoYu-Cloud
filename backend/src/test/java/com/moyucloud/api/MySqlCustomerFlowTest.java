package com.moyucloud.api;

import static org.assertj.core.api.Assertions.assertThat;

import com.moyucloud.customer.domain.CustomerEntity;
import com.moyucloud.customer.repository.CustomerRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

/** 使用真实 MySQL 验证 Flyway、JPA 和数据库初始化链路。 */
@SpringBootTest
@ActiveProfiles("testcontainers")
@Testcontainers
@EnabledIfEnvironmentVariable(named = "RUN_MYSQL_TESTS", matches = "true")
class MySqlCustomerFlowTest {
    @Autowired private CustomerRepository customerRepository;
    @Container static final MySQLContainer<?> MYSQL = new MySQLContainer<>("mysql:8.4");

    /** 将容器连接信息注入 Spring 测试环境。 */
    @DynamicPropertySource
    static void registerProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", MYSQL::getJdbcUrl);
        registry.add("spring.datasource.username", MYSQL::getUsername);
        registry.add("spring.datasource.password", MYSQL::getPassword);
        registry.add("spring.flyway.enabled", () -> "true");
        registry.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
    }

    /** 验证容器数据库可用且 Flyway 已成功建表。 */
    @Test
    void mysqlContainerProvidesMvpSchema() {
        assertThat(MYSQL.isRunning()).isTrue();
        customerRepository.save(
                new CustomerEntity("Testcontainers 客户", "测试联系人", "13800138001", "ACTIVE"));
        assertThat(customerRepository.findAll()).isNotEmpty();
    }
}
