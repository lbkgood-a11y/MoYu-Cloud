package com.moyucloud.system.dto;

import jakarta.validation.constraints.NotBlank;

/** 修改角色请求参数。 */
public record UpdateRoleRequest(@NotBlank(message = "角色名称不能为空") String roleName) {}
