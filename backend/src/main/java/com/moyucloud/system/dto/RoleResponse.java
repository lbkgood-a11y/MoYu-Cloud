package com.moyucloud.system.dto;

/** 角色管理响应对象。 */
public record RoleResponse(Long id, String roleCode, String roleName, boolean enabled) { }
