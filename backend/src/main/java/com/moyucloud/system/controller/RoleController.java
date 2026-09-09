package com.moyucloud.system.controller;

import com.moyucloud.auth.service.PermissionCodes;
import com.moyucloud.auth.service.RequiresPermission;
import com.moyucloud.shared.ApiResponse;
import com.moyucloud.shared.PageResponse;
import com.moyucloud.system.dto.CreateRoleRequest;
import com.moyucloud.system.dto.RoleResponse;
import com.moyucloud.system.dto.UpdateRoleRequest;
import com.moyucloud.system.service.RoleService;
import jakarta.validation.Valid;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;

/** 角色管理接口。 */
@RestController
@RequestMapping("/api/system/roles")
public class RoleController {
    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    /** 查询角色列表。 */
    @GetMapping
    @RequiresPermission(PermissionCodes.SYSTEM_ROLE_READ)
    public ApiResponse<java.util.List<RoleResponse>> findAll() {
        return ApiResponse.success(roleService.findAll());
    }

    /** 分页查询角色。 */
    @GetMapping("/page")
    @RequiresPermission(PermissionCodes.SYSTEM_ROLE_READ)
    public ApiResponse<PageResponse<RoleResponse>> findPage(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        var pageable = PageRequest.of(Math.max(page, 1) - 1, Math.min(Math.max(size, 1), 100));
        var result = roleService.findPage(pageable);
        return ApiResponse.success(
                new PageResponse<>(
                        result.getContent(),
                        result.getTotalElements(),
                        pageable.getPageNumber() + 1,
                        pageable.getPageSize()));
    }

    /** 创建角色。 */
    @PostMapping
    @RequiresPermission(PermissionCodes.SYSTEM_ROLE_WRITE)
    public ApiResponse<RoleResponse> create(@Valid @RequestBody CreateRoleRequest request) {
        return ApiResponse.success(roleService.create(request));
    }

    /** 修改角色名称。 */
    @PutMapping("/{id}")
    @RequiresPermission(PermissionCodes.SYSTEM_ROLE_WRITE)
    public ApiResponse<RoleResponse> update(
            @PathVariable String id, @Valid @RequestBody UpdateRoleRequest request) {
        return ApiResponse.success(roleService.update(id, request));
    }

    /** 启用或禁用角色。 */
    @PutMapping("/{id}/enabled")
    @RequiresPermission(PermissionCodes.SYSTEM_ROLE_WRITE)
    public ApiResponse<RoleResponse> setEnabled(
            @PathVariable String id, @RequestParam boolean enabled) {
        return ApiResponse.success(roleService.setEnabled(id, enabled));
    }

    /** 删除角色。 */
    @DeleteMapping("/{id}")
    @RequiresPermission(PermissionCodes.SYSTEM_ROLE_WRITE)
    public ApiResponse<Void> delete(@PathVariable String id) {
        roleService.delete(id);
        return ApiResponse.success(null);
    }
}
