package com.moyucloud.system.service;

import java.util.List;
import com.moyucloud.system.dto.MenuResponse;
import com.moyucloud.system.repository.MenuRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 菜单权限查询服务。 */
@Service
public class MenuService {
    private final MenuRepository menuRepository;
    public MenuService(MenuRepository menuRepository) { this.menuRepository = menuRepository; }
    /** 查询所有启用菜单。 */
    @Transactional(readOnly = true)
    public List<MenuResponse> findAll() {
        return menuRepository.findAll().stream().filter(menu -> menu.isEnabled())
                .map(menu -> new MenuResponse(menu.getId(), menu.getParentId(), menu.getMenuName(), menu.getPermission(), menu.getMenuType(), menu.isEnabled())).toList();
    }
}
