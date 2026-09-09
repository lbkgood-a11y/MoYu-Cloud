package com.moyucloud.system.dto;

import jakarta.validation.constraints.NotBlank;

/** 创建用户请求参数。 */
public record CreateUserRequest(
        @NotBlank(message = "用户名不能为空") String username,
        @NotBlank(message = "密码不能为空") String password,
        String departmentId) {
    public CreateUserRequest(String username, String password) {
        this(username, password, null);
    }
}
