package com.moyucloud.system.controller;

import com.moyucloud.auth.service.PermissionCodes;
import com.moyucloud.auth.service.RequiresPermission;
import com.moyucloud.shared.ApiResponse;
import com.moyucloud.shared.PageResponse;
import com.moyucloud.system.dto.AssignRoleRequest;
import com.moyucloud.system.dto.CreateUserRequest;
import com.moyucloud.system.dto.ResetPasswordRequest;
import com.moyucloud.system.dto.UpdateUserRequest;
import com.moyucloud.system.dto.UserResponse;
import com.moyucloud.system.service.UserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

/** 用户管理接口。 */
@RestController
@RequestMapping("/api/system/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /** 分页查询用户。 */
    @GetMapping("/page")
    @RequiresPermission(PermissionCodes.SYSTEM_USER_READ)
    public ApiResponse<PageResponse<UserResponse>> findPage(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        var pageable = PageRequest.of(Math.max(page, 1) - 1, Math.min(Math.max(size, 1), 100));
        var result = userService.findPage(pageable);
        return ApiResponse.success(
                new PageResponse<>(
                        result.getContent(),
                        result.getTotalElements(),
                        pageable.getPageNumber() + 1,
                        pageable.getPageSize()));
    }

    /** 查询全部用户。 */
    @GetMapping
    @RequiresPermission(PermissionCodes.SYSTEM_USER_READ)
    public ApiResponse<java.util.List<UserResponse>> findAll() {
        return ApiResponse.success(userService.findAll());
    }

    /** 创建用户。 */
    @PostMapping
    @RequiresPermission(PermissionCodes.SYSTEM_USER_WRITE)
    public ApiResponse<UserResponse> create(@Valid @RequestBody CreateUserRequest request) {
        return ApiResponse.success(userService.create(request));
    }

    /** 修改用户资料。 */
    @PutMapping("/{id}")
    @RequiresPermission(PermissionCodes.SYSTEM_USER_WRITE)
    public ApiResponse<UserResponse> update(
            @PathVariable String id, @Valid @RequestBody UpdateUserRequest request) {
        return ApiResponse.success(userService.update(id, request));
    }

    /** 启用或禁用用户。 */
    @PutMapping("/{id}/enabled")
    @RequiresPermission(PermissionCodes.SYSTEM_USER_WRITE)
    public ApiResponse<UserResponse> setEnabled(
            @PathVariable String id, @RequestParam boolean enabled) {
        return ApiResponse.success(userService.setEnabled(id, enabled));
    }

    /** 为用户分配角色。 */
    @PutMapping("/{id}/role")
    @RequiresPermission(PermissionCodes.SYSTEM_USER_WRITE)
    public ApiResponse<UserResponse> assignRole(
            @PathVariable String id, @Valid @RequestBody AssignRoleRequest request) {
        return ApiResponse.success(userService.assignRole(id, request));
    }

    /** 删除用户。 */
    @DeleteMapping("/{id}")
    @RequiresPermission(PermissionCodes.SYSTEM_USER_WRITE)
    public ApiResponse<Void> delete(@PathVariable String id) {
        userService.delete(id);
        return ApiResponse.success(null);
    }

    /** 重置用户密码。 */
    @PostMapping("/{id}/reset-password")
    @RequiresPermission(PermissionCodes.SYSTEM_USER_WRITE)
    public ApiResponse<Void> resetPassword(
            @PathVariable String id, @Valid @RequestBody ResetPasswordRequest request) {
        userService.resetPassword(id, request);
        return ApiResponse.success(null);
    }
}
