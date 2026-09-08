package com.moyucloud.system.repository;

import java.util.Optional;
import com.moyucloud.system.domain.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/** 系统角色数据访问接口。 */
public interface RoleRepository extends JpaRepository<RoleEntity, Long> {
    Page<RoleEntity> findAllByOrderByIdAsc(Pageable pageable);
    /** 按角色编码查询角色。 */
    Optional<RoleEntity> findByRoleCode(String roleCode);
}
