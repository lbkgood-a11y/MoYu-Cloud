package com.moyucloud.customer.domain;

/** 客户领域对象。 */
public record Customer(Long id, String name, String contact, String phone, String status) {
}
