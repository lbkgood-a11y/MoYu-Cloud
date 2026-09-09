package com.moyucloud.auth.dto;

import java.util.List;

/** 当前登录用户信息。 */
public record CurrentUserResponse(
        String id,
        String username,
        List<String> roles,
        List<String> permissions,
        String departmentId) {
    public CurrentUserResponse(
            String id, String username, List<String> roles, List<String> permissions) {
        this(id, username, roles, permissions, null);
    }
}
