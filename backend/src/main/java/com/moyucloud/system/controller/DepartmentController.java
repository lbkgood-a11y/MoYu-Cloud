package com.moyucloud.system.controller;

import com.moyucloud.auth.service.*;
import com.moyucloud.shared.ApiResponse;
import com.moyucloud.system.domain.DepartmentEntity;
import com.moyucloud.system.dto.DepartmentRequest;
import com.moyucloud.system.repository.DepartmentRepository;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {
    private final DepartmentRepository repo;
    private final AuthService auth;

    public DepartmentController(DepartmentRepository repo, AuthService auth) {
        this.repo = repo;
        this.auth = auth;
    }

    @GetMapping
    @RequiresPermission(PermissionCodes.SYSTEM_USER_READ)
    public ApiResponse<List<DepartmentEntity>> list(
            @RequestHeader(value = "Authorization", required = false) String a) {
        auth.requirePermission(a, PermissionCodes.SYSTEM_USER_READ);
        return ApiResponse.success(repo.findAllByOrderBySortOrderAscNameAsc());
    }

    @PostMapping
    @RequiresPermission(PermissionCodes.SYSTEM_USER_WRITE)
    public ApiResponse<DepartmentEntity> create(
            @RequestHeader(value = "Authorization", required = false) String a,
            @Valid @RequestBody DepartmentRequest r) {
        auth.requirePermission(a, PermissionCodes.SYSTEM_USER_WRITE);
        return ApiResponse.success(
                repo.save(new DepartmentEntity(r.name(), r.parentId(), r.sortOrder())));
    }

    @PutMapping("/{id}")
    @RequiresPermission(PermissionCodes.SYSTEM_USER_WRITE)
    public ApiResponse<DepartmentEntity> update(
            @RequestHeader(value = "Authorization", required = false) String a,
            @PathVariable String id,
            @Valid @RequestBody DepartmentRequest r) {
        auth.requirePermission(a, PermissionCodes.SYSTEM_USER_WRITE);
        var d = repo.findById(id).orElseThrow();
        d.update(r.name(), r.parentId(), r.sortOrder());
        return ApiResponse.success(d);
    }

    @DeleteMapping("/{id}")
    @RequiresPermission(PermissionCodes.SYSTEM_USER_WRITE)
    public ApiResponse<Void> delete(
            @RequestHeader(value = "Authorization", required = false) String a,
            @PathVariable String id) {
        auth.requirePermission(a, PermissionCodes.SYSTEM_USER_WRITE);
        if (repo.existsByParentId(id)) throw new IllegalStateException("请先删除子部门");
        repo.deleteById(id);
        return ApiResponse.success(null);
    }
}
