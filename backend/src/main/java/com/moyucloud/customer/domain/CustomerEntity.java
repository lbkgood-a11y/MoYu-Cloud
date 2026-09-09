package com.moyucloud.customer.domain;

import com.moyucloud.shared.Ulid;
import jakarta.persistence.*;

/** 客户数据库实体。 */
@Entity
@Table(name = "customer")
public class CustomerEntity {
    @Id
    @Column(length = 26, columnDefinition = "char(26)")
    private String id;

    private String name;
    private String contact;
    private String phone;
    private String status;

    @Column(length = 26, columnDefinition = "char(26)")
    private String departmentId;

    protected CustomerEntity() {}

    @PrePersist
    void assignId() {
        if (id == null) id = Ulid.next();
    }

    /** 创建客户实体。 */
    public CustomerEntity(String name, String contact, String phone, String status) {
        this.name = name;
        this.contact = contact;
        this.phone = phone;
        this.status = status;
    }

    public void setDepartmentId(String id) {
        this.departmentId = id;
    }

    public String getDepartmentId() {
        return departmentId;
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getContact() {
        return contact;
    }

    public String getPhone() {
        return phone;
    }

    public String getStatus() {
        return status;
    }

    /** 更新客户字段。 */
    public void update(String name, String contact, String phone, String status) {
        this.name = name;
        this.contact = contact;
        this.phone = phone;
        this.status = status;
    }
}
