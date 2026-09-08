package com.moyucloud.system.domain;

import java.io.Serializable;
import jakarta.persistence.Embeddable;

/** 角色菜单关联复合主键。 */
@Embeddable
public class RoleMenuId implements Serializable {
    private Long roleId;
    private Long menuId;
    protected RoleMenuId() { }
    public RoleMenuId(Long roleId, Long menuId) { this.roleId = roleId; this.menuId = menuId; }
}
