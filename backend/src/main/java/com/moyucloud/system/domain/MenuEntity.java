package com.moyucloud.system.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** 系统菜单和权限实体。 */
@Entity
@Table(name = "sys_menu")
public class MenuEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long parentId;
    private String menuName;
    private String permission;
    private String menuType;
    private boolean enabled;
    protected MenuEntity() { }
    public Long getId() { return id; }
    public Long getParentId() { return parentId; }
    public String getMenuName() { return menuName; }
    public String getPermission() { return permission; }
    public String getMenuType() { return menuType; }
    public boolean isEnabled() { return enabled; }
}
