package com.moyucloud.system.controller;

import com.moyucloud.auth.service.*;
import com.moyucloud.shared.ApiResponse;
import com.moyucloud.system.domain.RoleFieldPermissionEntity;
import com.moyucloud.system.dto.FieldPermissionRequest;
import com.moyucloud.system.service.RoleFieldPermissionService;
import jakarta.validation.Valid;
import java.util.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/system/roles/{roleId}/field-permissions")
public class RoleFieldPermissionController {
    private final RoleFieldPermissionService service;
    private final AuthService auth;

    public RoleFieldPermissionController(RoleFieldPermissionService s, AuthService a) {
        service = s;
        auth = a;
    }

    @GetMapping
    public ApiResponse<List<RoleFieldPermissionEntity>> list(
            @RequestHeader(value = "Authorization", required = false) String a,
            @PathVariable String roleId) {
        auth.requirePermission(a, PermissionCodes.SYSTEM_ROLE_READ);
        return ApiResponse.success(service.list(roleId));
    }

    @PutMapping
    public ApiResponse<List<RoleFieldPermissionEntity>> save(
            @RequestHeader(value = "Authorization", required = false) String a,
            @PathVariable String roleId,
            @Valid @RequestBody List<FieldPermissionRequest> r) {
        auth.requirePermission(a, PermissionCodes.SYSTEM_ROLE_WRITE);
        return ApiResponse.success(service.save(roleId, r));
    }
}
