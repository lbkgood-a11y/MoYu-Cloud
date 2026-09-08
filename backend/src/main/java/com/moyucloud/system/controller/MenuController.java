package com.moyucloud.system.controller;

import java.util.List;
import com.moyucloud.auth.service.AuthService;
import com.moyucloud.shared.ApiResponse;
import com.moyucloud.system.dto.MenuResponse;
import com.moyucloud.system.dto.CreateMenuRequest;
import com.moyucloud.system.service.MenuService;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

/** 菜单权限查询接口。 */
@RestController
@RequestMapping("/api/system/menus")
public class MenuController {
    private final MenuService menuService;
    private final AuthService authService;
    public MenuController(MenuService menuService, AuthService authService) { this.menuService = menuService; this.authService = authService; }
    /** 查询启用菜单。 */
    @GetMapping
    public ApiResponse<List<MenuResponse>> findAll(@RequestHeader(value = "Authorization", required = false) String authorization) {
        authService.requirePermission(authorization, "system:user:read");
        return ApiResponse.success(menuService.findAll());
    }

    /** 创建菜单权限。 */
    @PostMapping
    public ApiResponse<MenuResponse> create(@RequestHeader(value = "Authorization", required = false) String authorization,
                                            @Valid @RequestBody CreateMenuRequest request) {
        authService.requirePermission(authorization, "system:user:write");
        return ApiResponse.success(menuService.create(request));
    }
}
