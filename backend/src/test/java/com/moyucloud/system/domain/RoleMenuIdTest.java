package com.moyucloud.system.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class RoleMenuIdTest {
    @Test
    void equalRoleMenuIdsHaveSameHashCode() {
        var first = new RoleMenuId(1L, 2L);
        var second = new RoleMenuId(1L, 2L);
        assertThat(first).isEqualTo(second);
        assertThat(first.hashCode()).isEqualTo(second.hashCode());
    }
}
