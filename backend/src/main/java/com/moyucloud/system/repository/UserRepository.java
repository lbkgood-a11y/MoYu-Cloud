package com.moyucloud.system.repository;

import java.util.Optional;
import com.moyucloud.system.domain.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/** 系统用户数据访问接口。 */
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Page<UserEntity> findAllByOrderByIdAsc(Pageable pageable);
    /** 按用户名查询用户。 */
    Optional<UserEntity> findByUsername(String username);
}
