package com.moyucloud.system.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** 重置用户密码请求参数。 */
public record ResetPasswordRequest(
        @NotBlank(message = "新密码不能为空") @Size(min = 8, message = "密码至少 8 位") String password) {}
