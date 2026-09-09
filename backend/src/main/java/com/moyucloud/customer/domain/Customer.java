package com.moyucloud.customer.domain;

/** 客户领域对象。 */
public record Customer(
        String id, String name, String contact, String phone, String status, String departmentId) {
    public Customer(String id, String name, String contact, String phone, String status) {
        this(id, name, contact, phone, status, null);
    }
}
