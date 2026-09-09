package com.moyucloud.customer.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/** 创建或修改客户时的请求参数。 */
public record CustomerRequest(
        @NotBlank(message = "客户名称不能为空") String name,
        @NotBlank(message = "联系人不能为空") String contact,
        @NotBlank(message = "手机号不能为空") @Pattern(regexp = "^1[3-9]\\d{9}$", message = "手机号格式不正确") String phone,
        @NotBlank(message = "客户状态不能为空") String status,
        String departmentId) {
    public CustomerRequest(String name, String contact, String phone, String status) {
        this(name, contact, phone, status, null);
    }
}
