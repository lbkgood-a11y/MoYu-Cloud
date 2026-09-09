package com.moyucloud.system.repository;

import com.moyucloud.system.domain.RoleEntity;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/** 系统角色数据访问接口。 */
public interface RoleRepository extends JpaRepository<RoleEntity, String> {
    Page<RoleEntity> findAllByOrderByIdAsc(Pageable pageable);

    /** 按角色编码查询角色。 */
    Optional<RoleEntity> findByRoleCode(String roleCode);
}
