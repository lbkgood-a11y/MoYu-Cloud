package com.moyucloud.system.service;

import com.moyucloud.system.repository.MenuRepository;
import java.util.List;
import org.springframework.stereotype.Service;

/** 权限查询服务。当前返回管理员默认权限，后续接入角色菜单关联查询。 */
@Service
public class PermissionService {
    private final MenuRepository menuRepository;

    public PermissionService(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    /** 根据用户编号查询数据库关联权限。 */
    public List<String> findPermissionsByUserId(String userId) {
        return menuRepository.findPermissionsByUserId(userId);
    }

    /** 根据角色编码查询权限标识。 */
    public List<String> findPermissions(String roleCode) {
        if ("admin".equals(roleCode)) {
            return List.of(
                    "system:user:read",
                    "system:user:write",
                    "system:role:read",
                    "system:role:write",
                    "system:menu:read",
                    "customer:read",
                    "customer:write",
                    "audit:read");
        }
        return List.of();
    }
}
