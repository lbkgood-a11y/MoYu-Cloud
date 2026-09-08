package com.moyucloud.system.repository;

import java.util.Optional;
import com.moyucloud.system.domain.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

/** 系统用户数据访问接口。 */
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    /** 按用户名查询用户。 */
    Optional<UserEntity> findByUsername(String username);
}
