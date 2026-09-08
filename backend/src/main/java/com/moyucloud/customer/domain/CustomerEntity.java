package com.moyucloud.customer.domain;

import jakarta.persistence.*;

/** 客户数据库实体。 */
@Entity
@Table(name = "customer")
public class CustomerEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String contact;
    private String phone;
    private String status;

    protected CustomerEntity() { }

    /** 创建客户实体。 */
    public CustomerEntity(String name, String contact, String phone, String status) {
        this.name = name; this.contact = contact; this.phone = phone; this.status = status;
    }
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getContact() { return contact; }
    public String getPhone() { return phone; }
    public String getStatus() { return status; }
    /** 更新客户字段。 */
    public void update(String name, String contact, String phone, String status) {
        this.name = name; this.contact = contact; this.phone = phone; this.status = status;
    }
}
