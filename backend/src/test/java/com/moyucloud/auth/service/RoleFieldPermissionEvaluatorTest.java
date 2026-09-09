package com.moyucloud.auth.service;

import static org.junit.jupiter.api.Assertions.*;

import com.moyucloud.system.repository.RoleFieldPermissionRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class RoleFieldPermissionEvaluatorTest {
    @Test
    void adminHasAllFields() {
        var e = new RoleFieldPermissionEvaluator(Mockito.mock(RoleFieldPermissionRepository.class));
        assertTrue(e.canRead("admin", "customer", "phone"));
        assertTrue(e.canWrite("admin", "customer", "phone"));
        assertEquals("NONE", e.maskStrategy("admin", "customer", "phone"));
    }

    @Test
    void unconfiguredRoleIsHidden() {
        var e = new RoleFieldPermissionEvaluator(Mockito.mock(RoleFieldPermissionRepository.class));
        assertFalse(e.canRead("sales", "customer", "phone"));
        assertFalse(e.canWrite("sales", "customer", "phone"));
        assertEquals("FULL", e.maskStrategy("sales", "customer", "phone"));
    }
}
