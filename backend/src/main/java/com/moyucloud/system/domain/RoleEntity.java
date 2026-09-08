package com.moyucloud.system.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** 系统角色实体。 */
@Entity
@Table(name = "sys_role")
public class RoleEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String roleCode;
    private String roleName;
    private boolean enabled;
    protected RoleEntity() { }
    public RoleEntity(String roleCode, String roleName) { this.roleCode = roleCode; this.roleName = roleName; this.enabled = true; }
    public Long getId() { return id; }
    public String getRoleCode() { return roleCode; }
    public String getRoleName() { return roleName; }
    public boolean isEnabled() { return enabled; }
}
