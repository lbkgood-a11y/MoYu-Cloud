package com.moyucloud.system.controller;

import java.util.List;
import com.moyucloud.auth.service.AuthService;
import com.moyucloud.shared.ApiResponse;
import com.moyucloud.system.dto.CreateUserRequest;
import com.moyucloud.system.dto.UserResponse;
import com.moyucloud.system.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/** 用户管理接口。 */
@RestController
@RequestMapping("/api/system/users")
public class UserController {
    private final UserService userService;
    private final AuthService authService;

    public UserController(UserService userService, AuthService authService) { this.userService = userService; this.authService = authService; }

    /** 查询用户列表。 */
    @GetMapping
    public ApiResponse<List<UserResponse>> findAll(@RequestHeader(value = "Authorization", required = false) String authorization) {
        authService.requirePermission(authorization, "system:user:read");
        return ApiResponse.success(userService.findAll());
    }

    /** 创建用户。 */
    @PostMapping
    public ApiResponse<UserResponse> create(@RequestHeader(value = "Authorization", required = false) String authorization,
                                            @Valid @RequestBody CreateUserRequest request) {
        authService.requirePermission(authorization, "system:user:write");
        return ApiResponse.success(userService.create(request));
    }

    /** 修改用户启用状态。 */
    @PutMapping("/{id}/enabled")
    public ApiResponse<UserResponse> setEnabled(@RequestHeader(value = "Authorization", required = false) String authorization,
                                                @PathVariable Long id, @RequestParam boolean enabled) {
        authService.requirePermission(authorization, "system:user:write");
        return ApiResponse.success(userService.setEnabled(id, enabled));
    }
}
