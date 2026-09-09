package com.moyucloud.system.service;

import com.moyucloud.system.domain.UserEntity;
import com.moyucloud.system.domain.UserRoleEntity;
import com.moyucloud.system.dto.AssignRoleRequest;
import com.moyucloud.system.dto.CreateUserRequest;
import com.moyucloud.system.dto.ResetPasswordRequest;
import com.moyucloud.system.dto.UpdateUserRequest;
import com.moyucloud.system.dto.UserResponse;
import com.moyucloud.system.repository.RoleRepository;
import com.moyucloud.system.repository.UserRepository;
import com.moyucloud.system.repository.UserRoleRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/** 用户管理业务服务。 */
@Service
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;

    public UserService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            UserRoleRepository userRoleRepository) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
    }

    /** 查询用户列表。 */
    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public Page<UserResponse> findPage(Pageable pageable) {
        return userRepository.findAllByOrderByIdAsc(pageable).map(this::toResponse);
    }

    /** 创建用户并使用 BCrypt 保存密码哈希。 */
    @Transactional
    public UserResponse create(CreateUserRequest request) {
        UserEntity user =
                new UserEntity(request.username(), passwordEncoder.encode(request.password()));
        user.setDepartmentId(request.departmentId());
        return toResponse(userRepository.save(user));
    }

    /** 修改用户启用状态。 */
    @Transactional
    public UserResponse setEnabled(String id, boolean enabled) {
        UserEntity user = userRepository.findById(id).orElseThrow();
        if ("admin".equals(user.getUsername()) && !enabled) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "系统管理员账号不可禁用");
        }
        user.setEnabled(enabled);
        return toResponse(user);
    }

    /** 为用户分配已存在的角色。 */
    @Transactional
    public UserResponse assignRole(String id, AssignRoleRequest request) {
        var role =
                roleRepository
                        .findByRoleCode(request.roleCode())
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "角色不存在"));
        UserEntity user =
                userRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "用户不存在"));
        if ("admin".equals(user.getUsername()) && !"admin".equals(request.roleCode())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "系统管理员账号不可变更角色");
        }
        user.setRoleCode(request.roleCode());
        userRoleRepository.deleteByIdUserId(id);
        userRoleRepository.save(new UserRoleEntity(id, role.getId()));
        return toResponse(user);
    }

    /** 修改用户资料，系统管理员账号不可改名。 */
    @Transactional
    public UserResponse update(String id, UpdateUserRequest request) {
        UserEntity user =
                userRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "用户不存在"));
        if ("admin".equals(user.getUsername()) && !"admin".equals(request.username())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "系统管理员账号不可修改");
        }
        userRepository
                .findByUsername(request.username())
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(
                        existing -> {
                            throw new ResponseStatusException(HttpStatus.CONFLICT, "用户名已存在");
                        });
        user.setUsername(request.username());
        user.setDepartmentId(request.departmentId());
        return toResponse(user);
    }

    /** 删除用户，系统管理员账号不可删除。 */
    @Transactional
    public void delete(String id) {
        UserEntity user =
                userRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "用户不存在"));
        if ("admin".equals(user.getUsername())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "系统管理员账号不可删除");
        }
        userRepository.delete(user);
    }

    /** 重置用户密码，系统管理员密码只能通过安全运维流程修改。 */
    @Transactional
    public void resetPassword(String id, ResetPasswordRequest request) {
        UserEntity user =
                userRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "用户不存在"));
        if ("admin".equals(user.getUsername())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "系统管理员密码不可通过此接口重置");
        }
        user.setPasswordHash(passwordEncoder.encode(request.password()));
    }

    private UserResponse toResponse(UserEntity user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getRoleCode(),
                user.isEnabled(),
                user.getDepartmentId());
    }
}
