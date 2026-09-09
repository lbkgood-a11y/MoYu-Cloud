package com.moyucloud.system.service;

import com.moyucloud.audit.service.OperationLogService;
import com.moyucloud.system.domain.RoleFieldPermissionEntity;
import com.moyucloud.system.dto.FieldPermissionRequest;
import com.moyucloud.system.repository.*;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RoleFieldPermissionService {
    private static final Set<String> FIELDS =
            Set.of("name", "contact", "phone", "status", "department");
    private static final Set<String> MASKS =
            Set.of("NONE", "PHONE", "NAME", "EMAIL", "ID_CARD", "BANK_CARD", "ADDRESS", "FULL");
    private final RoleFieldPermissionRepository repo;
    private final RoleRepository roles;
    private final OperationLogService logs;

    public RoleFieldPermissionService(
            RoleFieldPermissionRepository r, RoleRepository roles, OperationLogService logs) {
        repo = r;
        this.roles = roles;
        this.logs = logs;
    }

    @Transactional(readOnly = true)
    public List<RoleFieldPermissionEntity> list(String id) {
        roles.findById(id).orElseThrow();
        return repo.findByRoleIdAndResourceCode(id, "customer");
    }

    @Transactional
    public List<RoleFieldPermissionEntity> save(String id, List<FieldPermissionRequest> rs) {
        roles.findById(id).orElseThrow();
        for (var r : rs)
            if (!FIELDS.contains(r.fieldCode())
                    || r.writable() && !r.readable()
                    || !MASKS.contains(Optional.ofNullable(r.maskStrategy()).orElse("NONE")))
                throw new IllegalArgumentException("字段权限配置无效");
        repo.deleteAll(repo.findByRoleIdAndResourceCode(id, "customer"));
        var out =
                repo.saveAll(
                        rs.stream()
                                .map(
                                        r ->
                                                new RoleFieldPermissionEntity(
                                                        id,
                                                        "customer",
                                                        r.fieldCode(),
                                                        r.readable(),
                                                        r.writable(),
                                                        Optional.ofNullable(r.maskStrategy())
                                                                .orElse("NONE")))
                                .toList());
        logs.record("system", "UPDATE", "role_field_permission", "更新角色列权限：" + id);
        return out;
    }
}
