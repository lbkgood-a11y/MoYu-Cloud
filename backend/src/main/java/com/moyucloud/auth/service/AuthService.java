package com.moyucloud.auth.service;

import com.moyucloud.auth.dto.CurrentUserResponse;
import com.moyucloud.auth.dto.LoginRequest;
import com.moyucloud.auth.dto.LoginResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.moyucloud.system.domain.UserEntity;
import com.moyucloud.system.repository.UserRepository;
import com.moyucloud.system.service.PermissionService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

/** 认证业务服务。当前使用演示用户，后续接入数据库。 */
@Service
public class AuthService {

    private static final int TOKEN_EXPIRES_IN_SECONDS = 28_800;
    private final JwtTokenService jwtTokenService;
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final PermissionService permissionService;

    public AuthService(JwtTokenService jwtTokenService, UserRepository userRepository, PermissionService permissionService) {
        this.jwtTokenService = jwtTokenService;
        this.userRepository = userRepository;
        this.permissionService = permissionService;
    }

    /** 校验账号并生成访问令牌。 */
    public LoginResponse login(LoginRequest request) {
        UserEntity user = userRepository.findByUsername(request.username()).orElse(null);
        if (user == null || !user.isEnabled() || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "用户名或密码错误");
        }
        String token = jwtTokenService.createToken(user.getId(), user.getUsername());
        return new LoginResponse(token, "bearer", TOKEN_EXPIRES_IN_SECONDS);
    }

    /** 校验令牌并返回当前用户。 */
    public CurrentUserResponse currentUser(String authorization) {
        Long userId = jwtTokenService.parseUserId(authorization);
        UserEntity user = userRepository.findById(userId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.UNAUTHORIZED, "用户不存在"));
        if (!user.isEnabled()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "用户已被禁用");
        }
        java.util.List<String> permissions = permissionService.findPermissionsByUserId(userId);
        if (permissions.isEmpty() && "admin".equals(user.getRoleCode())) {
            permissions = java.util.List.of("system:user:read", "system:user:write", "customer:read", "customer:write");
        }
        return new CurrentUserResponse(user.getId(), user.getUsername(), java.util.List.of(user.getRoleCode()), permissions);
    }

    /** 校验当前用户是否拥有指定权限。 */
    public void requirePermission(String authorization, String permission) {
        CurrentUserResponse user = currentUser(authorization);
        if (!user.permissions().contains(permission)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "无权执行该操作");
        }
    }
}
