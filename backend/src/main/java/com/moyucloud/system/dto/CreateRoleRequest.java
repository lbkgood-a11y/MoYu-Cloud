package com.moyucloud.system.dto;

import jakarta.validation.constraints.NotBlank;

/** 创建角色请求参数。 */
public record CreateRoleRequest(
        @NotBlank(message = "角色编码不能为空") String roleCode,
        @NotBlank(message = "角色名称不能为空") String roleName) {}
