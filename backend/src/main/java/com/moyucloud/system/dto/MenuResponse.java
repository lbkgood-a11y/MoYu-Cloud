package com.moyucloud.system.dto;

/** 菜单权限响应对象。 */
public record MenuResponse(Long id, Long parentId, String menuName, String permission, String menuType, boolean enabled) { }
