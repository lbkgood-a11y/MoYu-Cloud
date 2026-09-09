package com.moyucloud.auth.dto;

/** 登录成功后的令牌响应。 */
public record LoginResponse(String accessToken, String tokenType, int expiresIn) {}
