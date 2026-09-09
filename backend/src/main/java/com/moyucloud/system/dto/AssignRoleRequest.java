package com.moyucloud.system.dto;

import jakarta.validation.constraints.NotBlank;

/** 用户角色分配请求参数。 */
public record AssignRoleRequest(@NotBlank(message = "角色编码不能为空") String roleCode) {}
