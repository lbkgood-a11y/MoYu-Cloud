package com.moyucloud.auth.dto;

import java.util.List;

/** 当前登录用户信息。 */
public record CurrentUserResponse(Long id, String username, List<String> roles, List<String> permissions) {
}
