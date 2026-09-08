package com.moyucloud.auth.controller;

import com.moyucloud.auth.dto.CurrentUserResponse;
import com.moyucloud.auth.dto.LoginRequest;
import com.moyucloud.auth.dto.LoginResponse;
import com.moyucloud.auth.service.AuthService;
import com.moyucloud.shared.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 认证接口控制器。 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /** 用户登录。 */
    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ApiResponse.success(authService.login(request));
    }

    /** 获取当前登录用户。 */
    @GetMapping("/me")
    public ApiResponse<CurrentUserResponse> me(@RequestHeader(value = "Authorization", required = false) String authorization) {
        return ApiResponse.success(authService.currentUser(authorization));
    }
}
