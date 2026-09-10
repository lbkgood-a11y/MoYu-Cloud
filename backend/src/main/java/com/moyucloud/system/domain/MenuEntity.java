package com.moyucloud.system.domain;

import com.moyucloud.shared.Ulid;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

/** 系统菜单和权限实体。 */
@Entity
@Table(name = "sys_menu")
public class MenuEntity {
    @Id
    @jakarta.persistence.Column(length = 26, columnDefinition = "char(26)")
    private String id;

    @jakarta.persistence.Column(length = 26, columnDefinition = "char(26)")
    private String parentId;

    private String menuName;
    private String permission;
    private String icon;

    @jakarta.persistence.Column(length = 1, columnDefinition = "char(1)")
    private String menuType;

    private boolean enabled;

    protected MenuEntity() {}

    @PrePersist
    void assignId() {
        if (id == null) id = Ulid.next();
    }

    /** 创建菜单权限实体。 */
    public MenuEntity(String parentId, String menuName, String permission, String menuType, String icon) {
        this.parentId = parentId;
        this.menuName = menuName;
        this.permission = permission;
        this.menuType = menuType;
        this.icon = icon;
        this.enabled = true;
    }

    public String getId() {
        return id;
    }

    public String getParentId() {
        return parentId;
    }

    public String getMenuName() {
        return menuName;
    }

    public String getPermission() {
        return permission;
    }

    public String getMenuType() {
        return menuType;
    }
    public String getIcon() { return icon; }

    public boolean isEnabled() {
        return enabled;
    }

    public void update(String parentId, String menuName, String permission, String menuType, String icon) {
        this.parentId = parentId;
        this.menuName = menuName;
        this.permission = permission;
        this.menuType = menuType;
        this.icon = icon;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
