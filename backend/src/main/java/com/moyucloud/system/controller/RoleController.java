package com.moyucloud.system.controller;

import java.util.List;
import com.moyucloud.auth.service.AuthService;
import com.moyucloud.shared.ApiResponse;
import com.moyucloud.system.dto.CreateRoleRequest;
import com.moyucloud.system.dto.RoleResponse;
import com.moyucloud.system.service.RoleService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/** 角色管理接口。 */
@RestController
@RequestMapping("/api/system/roles")
public class RoleController {
    private final RoleService roleService;
    private final AuthService authService;
    public RoleController(RoleService roleService, AuthService authService) { this.roleService = roleService; this.authService = authService; }
    /** 查询角色列表。 */
    @GetMapping
    public ApiResponse<List<RoleResponse>> findAll(@RequestHeader(value = "Authorization", required = false) String authorization) {
        authService.requirePermission(authorization, "system:user:read");
        return ApiResponse.success(roleService.findAll());
    }
    /** 创建角色。 */
    @PostMapping
    public ApiResponse<RoleResponse> create(@RequestHeader(value = "Authorization", required = false) String authorization,
                                            @Valid @RequestBody CreateRoleRequest request) {
        authService.requirePermission(authorization, "system:user:write");
        return ApiResponse.success(roleService.create(request));
    }
}
