package com.moyucloud.system.domain;

import com.moyucloud.shared.Ulid;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

/** 系统用户数据库实体。 */
@Entity
@Table(name = "sys_user")
public class UserEntity {
    @Id
    @jakarta.persistence.Column(length = 26, columnDefinition = "char(26)")
    private String id;

    private String username;
    private String passwordHash;
    private boolean enabled;
    private String roleCode;

    @jakarta.persistence.Column(length = 26, columnDefinition = "char(26)")
    private String departmentId;

    protected UserEntity() {}

    @PrePersist
    void assignId() {
        if (id == null) id = Ulid.next();
    }

    /** 创建系统用户。 */
    public UserEntity(String username, String passwordHash) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.enabled = true;
        this.roleCode = "admin";
    }

    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public String getRoleCode() {
        return roleCode;
    }

    /** 修改用户角色编码。 */
    public void setRoleCode(String roleCode) {
        this.roleCode = roleCode;
    }

    /** 修改用户启用状态。 */
    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    /** 修改用户名。 */
    public void setUsername(String username) {
        this.username = username;
    }

    /** 修改密码哈希。 */
    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(String departmentId) {
        this.departmentId = departmentId;
    }
}
