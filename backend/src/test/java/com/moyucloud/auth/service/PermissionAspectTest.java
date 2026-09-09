package com.moyucloud.auth.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.junit.jupiter.api.Test;

class PermissionAspectTest {
    @Test
    void deniesWhenAuthServiceRejectsPermission() throws Throwable {
        var auth = mock(AuthService.class);
        var request = mock(HttpServletRequest.class);
        when(request.getHeader("Authorization")).thenReturn(null);
        doThrow(new RuntimeException("denied")).when(auth).requirePermission(null, "customer:read");
        var aspect = new PermissionAspect(auth, request);
        var joinPoint = mock(ProceedingJoinPoint.class);
        var annotation = mock(RequiresPermission.class);
        when(annotation.value()).thenReturn("customer:read");
        assertThatThrownBy(() -> aspect.check(joinPoint, annotation)).hasMessage("denied");
        verifyNoInteractions(joinPoint);
    }

    @Test
    void proceedsWhenAuthServiceAcceptsPermission() throws Throwable {
        var auth = mock(AuthService.class);
        var request = mock(HttpServletRequest.class);
        when(request.getHeader("Authorization")).thenReturn("Bearer token");
        var aspect = new PermissionAspect(auth, request);
        var joinPoint = mock(ProceedingJoinPoint.class);
        when(joinPoint.proceed()).thenReturn("ok");
        var annotation = mock(RequiresPermission.class);
        when(annotation.value()).thenReturn("customer:read");
        assertThat(aspect.check(joinPoint, annotation)).isEqualTo("ok");
        verify(joinPoint).proceed();
    }
}
