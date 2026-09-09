package com.moyucloud.system.domain;

import com.moyucloud.shared.Ulid;
import jakarta.persistence.*;

@Entity
@Table(
        name = "sys_role_field_permission",
        uniqueConstraints =
                @UniqueConstraint(columnNames = {"roleId", "resourceCode", "fieldCode"}))
public class RoleFieldPermissionEntity {
    @Id
    @Column(length = 26, columnDefinition = "char(26)")
    private String id;

    @Column(nullable = false, length = 26, columnDefinition = "char(26)")
    private String roleId;

    @Column(nullable = false, length = 80)
    private String resourceCode;

    @Column(nullable = false, length = 80)
    private String fieldCode;

    private boolean readable;
    private boolean writable;

    @Column(length = 30)
    private String maskStrategy = "NONE";

    protected RoleFieldPermissionEntity() {}

    public RoleFieldPermissionEntity(
            String roleId,
            String resourceCode,
            String fieldCode,
            boolean readable,
            boolean writable,
            String maskStrategy) {
        this.roleId = roleId;
        this.resourceCode = resourceCode;
        this.fieldCode = fieldCode;
        this.readable = readable;
        this.writable = writable;
        this.maskStrategy = maskStrategy;
    }

    @PrePersist
    void id() {
        if (id == null) id = Ulid.next();
    }

    public String getId() {
        return id;
    }

    public String getRoleId() {
        return roleId;
    }

    public String getResourceCode() {
        return resourceCode;
    }

    public String getFieldCode() {
        return fieldCode;
    }

    public boolean isReadable() {
        return readable;
    }

    public boolean isWritable() {
        return writable;
    }

    public String getMaskStrategy() {
        return maskStrategy;
    }
}
