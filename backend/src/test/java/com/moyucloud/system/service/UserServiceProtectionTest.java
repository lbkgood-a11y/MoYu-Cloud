package com.moyucloud.system.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import com.moyucloud.system.domain.UserEntity;
import com.moyucloud.system.repository.RoleRepository;
import com.moyucloud.system.repository.UserRepository;
import com.moyucloud.system.repository.UserRoleRepository;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

/** 验证系统管理员保护规则。 */
class UserServiceProtectionTest {
    @Test
    void administratorCannotBeDisabled() {
        UserRepository users = mock(UserRepository.class);
        RoleRepository roles = mock(RoleRepository.class);
        UserRoleRepository userRoles = mock(UserRoleRepository.class);
        UserEntity admin = new UserEntity("admin", "hash");
        when(users.findById("01TESTUSER0000000000000000")).thenReturn(Optional.of(admin));
        UserService service = new UserService(users, roles, userRoles);
        assertThatThrownBy(() -> service.setEnabled("01TESTUSER0000000000000000", false))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("系统管理员账号不可禁用");
    }
}
