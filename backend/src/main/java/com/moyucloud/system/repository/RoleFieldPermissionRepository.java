package com.moyucloud.system.repository;

import com.moyucloud.system.domain.RoleFieldPermissionEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleFieldPermissionRepository
        extends JpaRepository<RoleFieldPermissionEntity, String> {
    List<RoleFieldPermissionEntity> findByRoleIdAndResourceCode(String roleId, String resourceCode);
}
