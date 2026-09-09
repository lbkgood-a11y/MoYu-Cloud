package com.moyucloud.auth.service;

import com.moyucloud.system.repository.RoleFieldPermissionRepository;
import org.springframework.stereotype.Service;

/** 按角色评估字段权限；管理员保留全字段访问，其他角色读取持久化配置。 */
@Service
public class RoleFieldPermissionEvaluator {
    private final RoleFieldPermissionRepository repository;

    public RoleFieldPermissionEvaluator(RoleFieldPermissionRepository repository) {
        this.repository = repository;
    }

    public boolean canRead(String roleId, String resource, String field) {
        if ("admin".equals(roleId)) return true;
        return repository.findByRoleIdAndResourceCode(roleId, resource).stream()
                .filter(p -> p.getFieldCode().equals(field))
                .anyMatch(p -> p.isReadable());
    }

    public boolean canRead(java.util.Collection<String> roles, String resource, String field) {
        return roles.stream().anyMatch(r -> canRead(r, resource, field));
    }

    public boolean canWrite(String roleId, String resource, String field) {
        if ("admin".equals(roleId)) return true;
        return repository.findByRoleIdAndResourceCode(roleId, resource).stream()
                .filter(p -> p.getFieldCode().equals(field))
                .anyMatch(p -> p.isWritable());
    }

    public boolean canWrite(java.util.Collection<String> roles, String resource, String field) {
        return roles.stream().anyMatch(r -> canWrite(r, resource, field));
    }

    public String maskStrategy(String roleId, String resource, String field) {
        if ("admin".equals(roleId)) return "NONE";
        return repository.findByRoleIdAndResourceCode(roleId, resource).stream()
                .filter(p -> p.getFieldCode().equals(field))
                .map(p -> p.getMaskStrategy())
                .findFirst()
                .orElse("FULL");
    }

    public String maskStrategy(java.util.Collection<String> roles, String resource, String field) {
        if (roles.stream().anyMatch("admin"::equals)) return "NONE";
        return roles.stream()
                .map(r -> maskStrategy(r, resource, field))
                .filter(s -> !"FULL".equals(s))
                .findFirst()
                .orElse("FULL");
    }
}
