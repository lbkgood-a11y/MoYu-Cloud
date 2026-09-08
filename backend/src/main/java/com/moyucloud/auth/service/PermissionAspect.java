package com.moyucloud.auth.service;

import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

/** 统一读取 Authorization 请求头并执行声明式权限校验。 */
@Aspect
@Component
public class PermissionAspect {
    private final AuthService authService;
    private final HttpServletRequest request;

    public PermissionAspect(AuthService authService, HttpServletRequest request) {
        this.authService = authService;
        this.request = request;
    }

    @Around("@annotation(requiresPermission)")
    public Object check(ProceedingJoinPoint joinPoint, RequiresPermission requiresPermission) throws Throwable {
        authService.requirePermission(request.getHeader("Authorization"), requiresPermission.value());
        return joinPoint.proceed();
    }
}
