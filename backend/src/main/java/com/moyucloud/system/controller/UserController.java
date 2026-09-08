package com.moyucloud.system.controller;

import java.util.List;
import com.moyucloud.auth.service.AuthService;
import com.moyucloud.shared.ApiResponse;
import com.moyucloud.system.dto.CreateUserRequest;
import com.moyucloud.system.dto.UserResponse;
import com.moyucloud.system.dto.AssignRoleRequest;
import com.moyucloud.system.service.UserService;
import com.moyucloud.auth.service.RequiresPermission;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.moyucloud.shared.PageResponse;
import com.moyucloud.shared.PageSupport;

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

    @GetMapping("/page")
    @RequiresPermission("system:user:read")
    public ApiResponse<PageResponse<UserResponse>> findPage(@RequestHeader(value = "Authorization", required = false) String authorization,
                                                             @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size) {
        authService.requirePermission(authorization, "system:user:read");
        var result = userRepositoryPage(page, size);
        return ApiResponse.success(result);
    }

    private PageResponse<UserResponse> userRepositoryPage(int page, int size) {
        var pageable = org.springframework.data.domain.PageRequest.of(Math.max(page, 1) - 1, Math.min(Math.max(size, 1), 100));
        var result = userService.findPage(pageable);
        return new PageResponse<>(result.getContent(), result.getTotalElements(), pageable.getPageNumber() + 1, pageable.getPageSize());
    }

    /** 创建用户。 */
    @PostMapping
    @RequiresPermission("system:user:write")
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

    /** 为用户分配角色。 */
    @PutMapping("/{id}/role")
    public ApiResponse<UserResponse> assignRole(@RequestHeader(value = "Authorization", required = false) String authorization,
                                                @PathVariable Long id, @Valid @RequestBody AssignRoleRequest request) {
        authService.requirePermission(authorization, "system:user:write");
        return ApiResponse.success(userService.assignRole(id, request));
    }
}
