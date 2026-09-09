package com.moyucloud.system.repository;

import com.moyucloud.system.domain.UserRoleEntity;
import com.moyucloud.system.domain.UserRoleId;
import org.springframework.data.jpa.repository.JpaRepository;

/** 用户角色关联数据访问接口。 */
public interface UserRoleRepository extends JpaRepository<UserRoleEntity, UserRoleId> {
    /** 清除用户已有角色。 */
    void deleteByIdUserId(String userId);

    java.util.List<UserRoleEntity> findByIdUserId(String userId);
}
