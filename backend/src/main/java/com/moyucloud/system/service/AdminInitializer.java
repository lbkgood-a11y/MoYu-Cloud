package com.moyucloud.system.service;

import com.moyucloud.system.domain.UserEntity;
import com.moyucloud.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

/** 按环境变量初始化管理员账号，未配置则不创建。 */
@Component
public class AdminInitializer implements CommandLineRunner {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final String adminUsername;
    private final String adminPassword;

    public AdminInitializer(UserRepository userRepository,
            @Value("${moyu.admin.username:}") String adminUsername,
            @Value("${moyu.admin.password:}") String adminPassword) {
        this.userRepository = userRepository;
        this.adminUsername = adminUsername;
        this.adminPassword = adminPassword;
    }

    /** 配置了管理员账号且数据库中不存在时创建。 */
    @Override
    public void run(String... args) {
        if (adminUsername.isBlank() || adminPassword.isBlank()) {
            return;
        }
        if (userRepository.findByUsername(adminUsername).isEmpty()) {
            userRepository.save(new UserEntity(adminUsername, passwordEncoder.encode(adminPassword)));
        }
    }
}
