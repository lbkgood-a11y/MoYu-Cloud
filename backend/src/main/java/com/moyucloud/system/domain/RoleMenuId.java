package com.moyucloud.system.domain;

import java.io.Serializable;
import java.util.Objects;
import jakarta.persistence.Embeddable;

/** 角色菜单关联复合主键。 */
@Embeddable
public class RoleMenuId implements Serializable {
    private Long roleId;
    private Long menuId;
    protected RoleMenuId() { }
    public RoleMenuId(Long roleId, Long menuId) { this.roleId = roleId; this.menuId = menuId; }
    public Long getMenuId() { return menuId; }

    /** 复合主键相等判断。 */
    @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof RoleMenuId that)) return false;
        return Objects.equals(roleId, that.roleId) && Objects.equals(menuId, that.menuId);
    }

    /** 复合主键哈希计算。 */
    @Override
    public int hashCode() { return Objects.hash(roleId, menuId); }
}
