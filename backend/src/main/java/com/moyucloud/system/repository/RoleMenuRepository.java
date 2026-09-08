package com.moyucloud.system.repository;

import com.moyucloud.system.domain.RoleMenuEntity;
import com.moyucloud.system.domain.RoleMenuId;
import org.springframework.data.jpa.repository.JpaRepository;

/** 角色菜单授权数据访问接口。 */
public interface RoleMenuRepository extends JpaRepository<RoleMenuEntity, RoleMenuId> {
    /** 删除角色已有的全部菜单授权。 */
    void deleteByIdRoleId(Long roleId);
}
