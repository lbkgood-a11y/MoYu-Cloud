package com.moyucloud.system.dto;

import jakarta.validation.constraints.NotNull;
import java.util.List;

/** 角色菜单授权请求。 */
public record AssignMenuRequest(@NotNull(message = "菜单编号不能为空") List<String> menuIds) {}
