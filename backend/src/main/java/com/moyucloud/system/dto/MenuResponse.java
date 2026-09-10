package com.moyucloud.system.dto;

/** 菜单权限响应对象。 */
public record MenuResponse(
        String id,
        String parentId,
        String menuName,
        String permission,
        String menuType,
        String icon,
        boolean enabled) {}
