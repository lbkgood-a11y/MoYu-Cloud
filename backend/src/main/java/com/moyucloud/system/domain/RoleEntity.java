package com.moyucloud.system.domain;

import com.moyucloud.shared.Ulid;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

/** 系统角色实体。 */
@Entity
@Table(name = "sys_role")
public class RoleEntity {
    @Id
    @jakarta.persistence.Column(length = 26, columnDefinition = "char(26)")
    private String id;

    private String roleCode;
    private String roleName;
    private boolean enabled;

    protected RoleEntity() {}

    @PrePersist
    void assignId() {
        if (id == null) id = Ulid.next();
    }

    public RoleEntity(String roleCode, String roleName) {
        this.roleCode = roleCode;
        this.roleName = roleName;
        this.enabled = true;
    }

    public String getId() {
        return id;
    }

    public String getRoleCode() {
        return roleCode;
    }

    public String getRoleName() {
        return roleName;
    }

    public boolean isEnabled() {
        return enabled;
    }

    /** 修改角色名称。 */
    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    /** 修改角色启用状态。 */
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
