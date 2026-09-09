package com.moyucloud.system.controller;

import com.moyucloud.auth.service.PermissionCodes;
import com.moyucloud.auth.service.RequiresPermission;
import com.moyucloud.shared.ApiResponse;
import com.moyucloud.system.dto.CreateMenuRequest;
import com.moyucloud.system.dto.MenuResponse;
import com.moyucloud.system.dto.UpdateMenuRequest;
import com.moyucloud.system.service.MenuService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/** 菜单权限管理接口。 */
@RestController
@RequestMapping("/api/system/menus")
public class MenuController {
    private final MenuService menuService;

    public MenuController(MenuService menuService) {
        this.menuService = menuService;
    }

    /** 查询启用菜单。 */
    @GetMapping
    @RequiresPermission(PermissionCodes.SYSTEM_USER_READ)
    public ApiResponse<java.util.List<MenuResponse>> findAll() {
        return ApiResponse.success(menuService.findAll());
    }

    /** 创建菜单权限。 */
    @PostMapping
    @RequiresPermission(PermissionCodes.SYSTEM_USER_WRITE)
    public ApiResponse<MenuResponse> create(@Valid @RequestBody CreateMenuRequest request) {
        return ApiResponse.success(menuService.create(request));
    }

    /** 修改菜单权限。 */
    @PutMapping("/{id}")
    @RequiresPermission(PermissionCodes.SYSTEM_USER_WRITE)
    public ApiResponse<MenuResponse> update(
            @PathVariable String id, @Valid @RequestBody UpdateMenuRequest request) {
        return ApiResponse.success(menuService.update(id, request));
    }

    /** 删除菜单权限。 */
    @DeleteMapping("/{id}")
    @RequiresPermission(PermissionCodes.SYSTEM_USER_WRITE)
    public ApiResponse<Void> delete(@PathVariable String id) {
        menuService.delete(id);
        return ApiResponse.success(null);
    }

    /** 启用或禁用菜单权限。 */
    @PutMapping("/{id}/enabled")
    @RequiresPermission(PermissionCodes.SYSTEM_USER_WRITE)
    public ApiResponse<Void> setEnabled(@PathVariable String id, @RequestParam boolean enabled) {
        menuService.setEnabled(id, enabled);
        return ApiResponse.success(null);
    }
}
