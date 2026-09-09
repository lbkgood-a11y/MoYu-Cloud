package com.moyucloud.auth.service;

/** 平台统一权限编码，避免业务模块散落魔法字符串。 */
public final class PermissionCodes {
    public static final String SYSTEM_USER_READ = "system:user:read";
    public static final String SYSTEM_USER_WRITE = "system:user:write";
    public static final String SYSTEM_ROLE_READ = "system:role:read";
    public static final String SYSTEM_ROLE_WRITE = "system:role:write";
    public static final String CUSTOMER_READ = "customer:read";
    public static final String CUSTOMER_WRITE = "customer:write";
    public static final String AUDIT_READ = "audit:read";

    private PermissionCodes() {}
}
