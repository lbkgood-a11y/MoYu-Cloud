package com.moyucloud.system.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/** 创建菜单请求参数。 */
public record CreateMenuRequest(
        @NotNull(message = "父菜单编号不能为空") String parentId,
        @NotBlank(message = "菜单名称不能为空") String menuName,
        String permission,
        @NotBlank(message = "菜单类型不能为空") String menuType,
        String icon) {}
