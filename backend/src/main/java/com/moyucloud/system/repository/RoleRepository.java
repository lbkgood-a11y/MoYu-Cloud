package com.moyucloud.system.repository;

import java.util.Optional;
import com.moyucloud.system.domain.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

/** 系统角色数据访问接口。 */
public interface RoleRepository extends JpaRepository<RoleEntity, Long> {
    /** 按角色编码查询角色。 */
    Optional<RoleEntity> findByRoleCode(String roleCode);
}
