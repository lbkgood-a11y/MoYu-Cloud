package com.moyucloud.system.controller;

import java.util.List;
import com.moyucloud.auth.service.RequiresPermission;
import com.moyucloud.shared.ApiResponse;
import com.moyucloud.system.dto.CreateRoleRequest;
import com.moyucloud.system.dto.RoleResponse;
import com.moyucloud.system.service.RoleService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import com.moyucloud.shared.PageResponse;
import com.moyucloud.shared.PageSupport;

/** 角色管理接口。 */
@RestController
@RequestMapping("/api/system/roles")
public class RoleController {
    private final RoleService roleService;
    public RoleController(RoleService roleService) { this.roleService = roleService; }
    /** 查询角色列表。 */
    @GetMapping
    @RequiresPermission("system:user:read")
    public ApiResponse<List<RoleResponse>> findAll() {
        return ApiResponse.success(roleService.findAll());
    }
    @GetMapping("/page")
    @RequiresPermission("system:user:read")
    public ApiResponse<PageResponse<RoleResponse>> findPage(
                                                             @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size) {
        var pageable = org.springframework.data.domain.PageRequest.of(Math.max(page, 1) - 1, Math.min(Math.max(size, 1), 100));
        var result = roleService.findPage(pageable);
        return ApiResponse.success(new PageResponse<>(result.getContent(), result.getTotalElements(), pageable.getPageNumber() + 1, pageable.getPageSize()));
    }
    /** 创建角色。 */
    @PostMapping
    @RequiresPermission("system:user:write")
    public ApiResponse<RoleResponse> create(
                                            @Valid @RequestBody CreateRoleRequest request) {
        return ApiResponse.success(roleService.create(request));
    }
}
