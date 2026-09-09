package com.moyucloud.system.domain;

import com.moyucloud.shared.Ulid;
import jakarta.persistence.*;

/** 组织部门实体，使用 parentId 表示树形层级。 */
@Entity
@Table(name = "sys_department")
public class DepartmentEntity {
    @Id
    @Column(length = 26, columnDefinition = "char(26)")
    private String id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 26, columnDefinition = "char(26)")
    private String parentId;

    @Column(nullable = false)
    private boolean enabled = true;

    private int sortOrder;

    protected DepartmentEntity() {}

    public DepartmentEntity(String name, String parentId, int sortOrder) {
        this.name = name;
        this.parentId = parentId;
        this.sortOrder = sortOrder;
    }

    @PrePersist
    void assignId() {
        if (id == null) id = Ulid.next();
    }

    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getParentId() {
        return parentId;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public void update(String name, String parentId, int sortOrder) {
        this.name = name;
        this.parentId = parentId;
        this.sortOrder = sortOrder;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
