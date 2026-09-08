package com.moyucloud.system.service;

import java.util.List;
import com.moyucloud.system.domain.UserEntity;
import com.moyucloud.system.dto.CreateUserRequest;
import com.moyucloud.system.dto.UserResponse;
import com.moyucloud.system.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 用户管理业务服务。 */
@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository) { this.userRepository = userRepository; }

    /** 查询用户列表。 */
    @Transactional(readOnly = true)
    public List<UserResponse> findAll() { return userRepository.findAll().stream().map(this::toResponse).toList(); }

    /** 创建用户并使用 BCrypt 保存密码哈希。 */
    @Transactional
    public UserResponse create(CreateUserRequest request) {
        UserEntity user = new UserEntity(request.username(), passwordEncoder.encode(request.password()));
        return toResponse(userRepository.save(user));
    }

    /** 修改用户启用状态。 */
    @Transactional
    public UserResponse setEnabled(Long id, boolean enabled) {
        UserEntity user = userRepository.findById(id).orElseThrow();
        user.setEnabled(enabled);
        return toResponse(user);
    }

    private UserResponse toResponse(UserEntity user) { return new UserResponse(user.getId(), user.getUsername(), user.getRoleCode(), user.isEnabled()); }
}
