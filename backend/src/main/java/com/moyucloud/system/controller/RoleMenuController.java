package com.moyucloud.system.controller;

import com.moyucloud.auth.service.PermissionCodes;
import com.moyucloud.auth.service.RequiresPermission;
import com.moyucloud.shared.ApiResponse;
import com.moyucloud.system.dto.AssignMenuRequest;
import com.moyucloud.system.service.RoleMenuService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/** 角色菜单授权接口。 */
@RestController
@RequestMapping("/api/system/roles")
public class RoleMenuController {
    private final RoleMenuService roleMenuService;

    public RoleMenuController(RoleMenuService roleMenuService) {
        this.roleMenuService = roleMenuService;
    }

    /** 覆盖指定角色的菜单授权。 */
    @PutMapping("/{roleId}/menus")
    @RequiresPermission(PermissionCodes.SYSTEM_ROLE_WRITE)
    public ApiResponse<Void> assignMenus(
            @PathVariable String roleId, @Valid @RequestBody AssignMenuRequest request) {
        roleMenuService.assignMenus(roleId, request);
        return ApiResponse.success(null);
    }

    @GetMapping("/{roleId}/menus")
    @RequiresPermission(PermissionCodes.SYSTEM_ROLE_READ)
    public ApiResponse<java.util.List<String>> findMenus(@PathVariable String roleId) {
        return ApiResponse.success(roleMenuService.findMenuIds(roleId));
    }
}
