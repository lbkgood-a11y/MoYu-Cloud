package com.moyucloud.system.domain;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/** 角色与菜单的授权关联实体。 */
@Entity
@Table(name = "sys_role_menu")
public class RoleMenuEntity {
    @EmbeddedId
    private RoleMenuId id;
    protected RoleMenuEntity() { }
    public RoleMenuEntity(Long roleId, Long menuId) { this.id = new RoleMenuId(roleId, menuId); }
}
