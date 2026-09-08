package com.moyucloud.system.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** 系统用户数据库实体。 */
@Entity
@Table(name = "sys_user")
public class UserEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String passwordHash;
    private boolean enabled;
    private String roleCode;

    protected UserEntity() { }

    /** 创建系统用户。 */
    public UserEntity(String username, String passwordHash) {
        this.username = username;
        this.passwordHash = passwordHash;
        this.enabled = true;
        this.roleCode = "admin";
    }
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getPasswordHash() { return passwordHash; }
    public boolean isEnabled() { return enabled; }
    public String getRoleCode() { return roleCode; }
    /** 修改用户角色编码。 */
    public void setRoleCode(String roleCode) { this.roleCode = roleCode; }
    /** 修改用户启用状态。 */
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
}
