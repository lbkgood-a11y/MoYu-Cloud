package com.moyucloud.system.dto;

import jakarta.validation.constraints.NotBlank;

/** 修改用户资料请求参数。 */
public record UpdateUserRequest(
        @NotBlank(message = "用户名不能为空") String username, String departmentId) {
    public UpdateUserRequest(String username) {
        this(username, null);
    }
}
