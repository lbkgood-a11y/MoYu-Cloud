package com.moyucloud.system.dto;

/** 角色管理响应对象。 */
public record RoleResponse(String id, String roleCode, String roleName, boolean enabled) {}
