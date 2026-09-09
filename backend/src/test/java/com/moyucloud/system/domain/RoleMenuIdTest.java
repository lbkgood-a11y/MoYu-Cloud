package com.moyucloud.system.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class RoleMenuIdTest {
    @Test
    void equalRoleMenuIdsHaveSameHashCode() {
        var first = new RoleMenuId("01TESTROLE0000000000000000", "01TESTMENU00000000000000000");
        var second = new RoleMenuId("01TESTROLE0000000000000000", "01TESTMENU00000000000000000");
        assertThat(first).isEqualTo(second);
        assertThat(first.hashCode()).isEqualTo(second.hashCode());
    }
}
