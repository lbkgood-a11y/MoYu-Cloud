package com.moyucloud.system.controller;

import java.util.List;
import com.moyucloud.auth.service.RequiresPermission;
import com.moyucloud.shared.ApiResponse;
import com.moyucloud.system.dto.MenuResponse;
import com.moyucloud.system.dto.CreateMenuRequest;
import com.moyucloud.system.service.MenuService;
import com.moyucloud.system.dto.UpdateMenuRequest;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

/** 菜单权限查询接口。 */
@RestController
@RequestMapping("/api/system/menus")
public class MenuController {
    private final MenuService menuService;
    public MenuController(MenuService menuService) { this.menuService = menuService; }
    /** 查询启用菜单。 */
    @GetMapping
    @RequiresPermission("system:user:read")
    public ApiResponse<List<MenuResponse>> findAll() {
        return ApiResponse.success(menuService.findAll());
    }

    /** 创建菜单权限。 */
    @PostMapping
    @RequiresPermission("system:user:write")
    public ApiResponse<MenuResponse> create(
                                            @Valid @RequestBody CreateMenuRequest request) {
        return ApiResponse.success(menuService.create(request));
    }
    @PutMapping("/{id}") @RequiresPermission("system:user:write") public ApiResponse<MenuResponse> update(@PathVariable Long id,@Valid @RequestBody UpdateMenuRequest r){return ApiResponse.success(menuService.update(id,r));}
    @DeleteMapping("/{id}") @RequiresPermission("system:user:write") public ApiResponse<Void> delete(@PathVariable Long id){menuService.delete(id);return ApiResponse.success(null);}
    @PutMapping("/{id}/enabled") @RequiresPermission("system:user:write") public ApiResponse<Void> enabled(@PathVariable Long id,@RequestParam boolean enabled){menuService.setEnabled(id,enabled);return ApiResponse.success(null);}
}
