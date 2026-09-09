package com.moyucloud.auth.service;

import com.moyucloud.auth.dto.CurrentUserResponse;
import com.moyucloud.auth.dto.LoginRequest;
import com.moyucloud.auth.dto.LoginResponse;
import com.moyucloud.system.domain.UserEntity;
import com.moyucloud.system.repository.RoleRepository;
import com.moyucloud.system.repository.UserRepository;
import com.moyucloud.system.repository.UserRoleRepository;
import com.moyucloud.system.service.PermissionService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/** 认证业务服务。当前使用演示用户，后续接入数据库。 */
@Service
public class AuthService {

    private static final int TOKEN_EXPIRES_IN_SECONDS = 28_800;
    private final JwtTokenService jwtTokenService;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final PermissionService permissionService;
    private final UserRoleRepository userRoleRepository;
    private final RoleRepository roleRepository;

    public AuthService(
            JwtTokenService jwtTokenService,
            UserRepository userRepository,
            PermissionService permissionService,
            UserRoleRepository userRoleRepository,
            RoleRepository roleRepository) {
        this.jwtTokenService = jwtTokenService;
        this.userRepository = userRepository;
        this.permissionService = permissionService;
        this.userRoleRepository = userRoleRepository;
        this.roleRepository = roleRepository;
    }

    /** 校验账号并生成访问令牌。 */
    public LoginResponse login(LoginRequest request) {
        UserEntity user = userRepository.findByUsername(request.username()).orElse(null);
        if (user == null
                || !user.isEnabled()
                || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "用户名或密码错误");
        }
        String token = jwtTokenService.createToken(user.getId(), user.getUsername());
        return new LoginResponse(token, "bearer", TOKEN_EXPIRES_IN_SECONDS);
    }

    /** 校验令牌并返回当前用户。 */
    public CurrentUserResponse currentUser(String authorization) {
        String userId = jwtTokenService.parseUserId(authorization);
        UserEntity user =
                userRepository
                        .findById(userId)
                        .orElseThrow(
                                () ->
                                        new ResponseStatusException(
                                                HttpStatus.UNAUTHORIZED, "用户不存在"));
        if (!user.isEnabled()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "用户已被禁用");
        }
        java.util.List<String> permissions = permissionService.findPermissionsByUserId(userId);
        if ("admin".equals(user.getRoleCode())) {
            // 管理员是平台保留的全权限账号；即使历史数据中的角色菜单关联不完整，
            // 也不能因为数据库迁移或手工调整而丢失管理入口。
            java.util.LinkedHashSet<String> allPermissions =
                    new java.util.LinkedHashSet<>(permissions);
            allPermissions.addAll(
                    java.util.List.of(
                            PermissionCodes.SYSTEM_USER_READ,
                            PermissionCodes.SYSTEM_USER_WRITE,
                            PermissionCodes.SYSTEM_ROLE_READ,
                            PermissionCodes.SYSTEM_ROLE_WRITE,
                            "system:menu:read",
                            PermissionCodes.CUSTOMER_READ,
                            PermissionCodes.CUSTOMER_WRITE,
                            "audit:read"));
            permissions = java.util.List.copyOf(allPermissions);
        }
        var roles =
                userRoleRepository.findByIdUserId(userId).stream()
                        .map(
                                x ->
                                        roleRepository
                                                .findById(x.getId().getRoleId())
                                                .map(r -> r.getRoleCode())
                                                .orElse(null))
                        .filter(java.util.Objects::nonNull)
                        .collect(
                                java.util.stream.Collectors.toCollection(java.util.ArrayList::new));
        if (roles.isEmpty()) roles.add(user.getRoleCode());
        return new CurrentUserResponse(
                user.getId(), user.getUsername(), roles, permissions, user.getDepartmentId());
    }

    /** 校验当前用户是否拥有指定权限。 */
    public void requirePermission(String authorization, String permission) {
        CurrentUserResponse user = currentUser(authorization);
        if (!user.permissions().contains(permission)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "无权执行该操作");
        }
    }
}
