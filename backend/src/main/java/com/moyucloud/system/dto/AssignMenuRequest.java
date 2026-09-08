package com.moyucloud.system.dto;

import java.util.List;
import jakarta.validation.constraints.NotNull;

/** 角色菜单授权请求。 */
public record AssignMenuRequest(@NotNull(message = "菜单编号不能为空") List<Long> menuIds) { }
