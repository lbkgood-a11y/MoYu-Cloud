package com.moyucloud.system.service;

import com.moyucloud.system.domain.MenuEntity;
import com.moyucloud.system.dto.CreateMenuRequest;
import com.moyucloud.system.dto.MenuResponse;
import com.moyucloud.system.repository.MenuRepository;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/** 菜单权限查询服务。 */
@Service
public class MenuService {
    private final MenuRepository menuRepository;

    public MenuService(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    /** 查询所有启用菜单。 */
    @Transactional(readOnly = true)
    public List<MenuResponse> findAll() {
        return menuRepository.findAll().stream()
                .filter(menu -> menu.isEnabled())
                .map(
                        menu ->
                                new MenuResponse(
                                        menu.getId(),
                                        menu.getParentId(),
                                        menu.getMenuName(),
                                        menu.getPermission(),
                                        menu.getMenuType(),
                                        menu.getIcon(),
                                        menu.isEnabled()))
                .toList();
    }

    /** 创建菜单权限。 */
    @Transactional
    public MenuResponse create(CreateMenuRequest request) {
        if (request.permission() != null
                && !request.permission().isBlank()
                && menuRepository.existsByPermission(request.permission()))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "权限标识已存在");
        MenuEntity menu =
                menuRepository.save(
                        new MenuEntity(
                                request.parentId(),
                                request.menuName(),
                                request.permission(),
                                request.menuType(), request.icon()));
        return new MenuResponse(
                menu.getId(),
                menu.getParentId(),
                menu.getMenuName(),
                menu.getPermission(),
                menu.getMenuType(),
                menu.getIcon(),
                menu.isEnabled());
    }

    @Transactional
    public MenuResponse update(String id, com.moyucloud.system.dto.UpdateMenuRequest r) {
        MenuEntity m =
                menuRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "菜单不存在"));
        if (r.permission() != null && menuRepository.existsByPermissionAndIdNot(r.permission(), id))
            throw new ResponseStatusException(HttpStatus.CONFLICT, "权限标识已存在");
        m.update(r.parentId(), r.menuName(), r.permission(), r.menuType(), r.icon());
        return new MenuResponse(
                m.getId(),
                m.getParentId(),
                m.getMenuName(),
                m.getPermission(),
                m.getMenuType(),
                m.getIcon(),
                m.isEnabled());
    }

    @Transactional
    public void delete(String id) {
        if (!menuRepository.existsById(id))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "菜单不存在");
        menuRepository.deleteById(id);
    }

    @Transactional
    public void setEnabled(String id, boolean enabled) {
        MenuEntity m =
                menuRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "菜单不存在"));
        m.setEnabled(enabled);
    }
}
