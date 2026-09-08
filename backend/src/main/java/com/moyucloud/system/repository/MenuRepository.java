package com.moyucloud.system.repository;

import com.moyucloud.system.domain.MenuEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

/** 系统菜单数据访问接口。 */
public interface MenuRepository extends JpaRepository<MenuEntity, Long> {
    boolean existsByPermission(String permission);
    boolean existsByPermissionAndIdNot(String permission, Long id);
    /** 查询用户通过角色拥有的权限标识。 */
    @Query(value = "SELECT DISTINCT m.permission FROM sys_menu m "
            + "JOIN sys_role_menu rm ON rm.menu_id = m.id "
            + "JOIN sys_user_role ur ON ur.role_id = rm.role_id "
            + "WHERE ur.user_id = :userId AND m.enabled = 1 AND m.permission IS NOT NULL", nativeQuery = true)
    List<String> findPermissionsByUserId(@Param("userId") Long userId);
}
