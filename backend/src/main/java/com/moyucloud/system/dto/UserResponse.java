package com.moyucloud.system.dto;

/** 用户管理响应对象。 */
public record UserResponse(Long id, String username, String roleCode, boolean enabled) { }
