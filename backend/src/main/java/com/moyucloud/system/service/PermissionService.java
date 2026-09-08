package com.moyucloud.system.service;

import java.util.List;
import com.moyucloud.system.repository.MenuRepository;
import org.springframework.stereotype.Service;

/** 权限查询服务。当前返回管理员默认权限，后续接入角色菜单关联查询。 */
@Service
public class PermissionService {
    private final MenuRepository menuRepository;

    public PermissionService(MenuRepository menuRepository) { this.menuRepository = menuRepository; }

    /** 根据用户编号查询数据库关联权限。 */
    public List<String> findPermissionsByUserId(Long userId) {
        return menuRepository.findPermissionsByUserId(userId);
    }

    /** 根据角色编码查询权限标识。 */
    public List<String> findPermissions(String roleCode) {
        if ("admin".equals(roleCode)) {
            return List.of("system:user:read", "system:user:write", "customer:read", "customer:write");
        }
        return List.of();
    }
}
