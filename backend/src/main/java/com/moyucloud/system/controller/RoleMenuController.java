package com.moyucloud.system.controller;

import com.moyucloud.auth.service.AuthService;
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
    private final AuthService authService;
    public RoleMenuController(RoleMenuService roleMenuService, AuthService authService) { this.roleMenuService = roleMenuService; this.authService = authService; }

    /** 覆盖指定角色的菜单授权。 */
    @PutMapping("/{roleId}/menus")
    public ApiResponse<Void> assignMenus(@RequestHeader(value = "Authorization", required = false) String authorization,
                                         @PathVariable Long roleId, @Valid @RequestBody AssignMenuRequest request) {
        authService.requirePermission(authorization, "system:user:write");
        roleMenuService.assignMenus(roleId, request);
        return ApiResponse.success(null);
    }

    @GetMapping("/{roleId}/menus")
    public ApiResponse<java.util.List<Long>> findMenus(@RequestHeader(value = "Authorization", required = false) String authorization,
                                                        @PathVariable Long roleId) {
        authService.requirePermission(authorization, "system:user:read");
        return ApiResponse.success(roleMenuService.findMenuIds(roleId));
    }
}
