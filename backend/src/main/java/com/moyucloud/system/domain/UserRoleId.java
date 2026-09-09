package com.moyucloud.system.domain;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

/** 用户角色关联复合主键。 */
@Embeddable
public class UserRoleId implements Serializable {
    @jakarta.persistence.Column(length = 26, columnDefinition = "char(26)")
    private String userId;

    @jakarta.persistence.Column(length = 26, columnDefinition = "char(26)")
    private String roleId;

    protected UserRoleId() {}

    public UserRoleId(String userId, String roleId) {
        this.userId = userId;
        this.roleId = roleId;
    }

    public String getUserId() {
        return userId;
    }

    public String getRoleId() {
        return roleId;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) return true;
        if (!(other instanceof UserRoleId that)) return false;
        return Objects.equals(userId, that.userId) && Objects.equals(roleId, that.roleId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(userId, roleId);
    }
}
