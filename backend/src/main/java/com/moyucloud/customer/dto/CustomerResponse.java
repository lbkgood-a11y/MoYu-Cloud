package com.moyucloud.customer.dto;

/** 客户对外响应对象，作为列级权限处理的承载类型。 */
@com.fasterxml.jackson.annotation.JsonInclude(
        com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL)
public record CustomerResponse(
        String id, String name, String contact, String phone, String status, String departmentId) {
    public static CustomerResponse from(com.moyucloud.customer.domain.Customer c) {
        return new CustomerResponse(
                c.id(), c.name(), c.contact(), c.phone(), c.status(), c.departmentId());
    }
}
