package com.moyucloud.system.domain;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

/** 用户与角色的授权关联实体。 */
@Entity
@Table(name = "sys_user_role")
public class UserRoleEntity {
    @EmbeddedId private UserRoleId id;

    protected UserRoleEntity() {}

    public UserRoleEntity(String userId, String roleId) {
        this.id = new UserRoleId(userId, roleId);
    }

    public UserRoleId getId() {
        return id;
    }
}
