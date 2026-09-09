package com.moyucloud.system.service;

import com.moyucloud.system.domain.RoleMenuEntity;
import com.moyucloud.system.dto.AssignMenuRequest;
import com.moyucloud.system.repository.RoleMenuRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 角色菜单授权服务。 */
@Service
public class RoleMenuService {
    private final RoleMenuRepository roleMenuRepository;

    public RoleMenuService(RoleMenuRepository roleMenuRepository) {
        this.roleMenuRepository = roleMenuRepository;
    }

    /** 覆盖角色的菜单授权关系。 */
    @Transactional
    public void assignMenus(String roleId, AssignMenuRequest request) {
        roleMenuRepository.deleteByIdRoleId(roleId);
        request.menuIds().stream()
                .map(menuId -> new RoleMenuEntity(roleId, menuId))
                .forEach(roleMenuRepository::save);
    }

    @Transactional(readOnly = true)
    public List<String> findMenuIds(String roleId) {
        return roleMenuRepository.findByIdRoleId(roleId).stream()
                .map(item -> item.getId().getMenuId())
                .toList();
    }
}
