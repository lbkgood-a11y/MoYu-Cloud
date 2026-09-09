package com.moyucloud.system.service;

import com.moyucloud.system.domain.RoleEntity;
import com.moyucloud.system.dto.CreateRoleRequest;
import com.moyucloud.system.dto.RoleResponse;
import com.moyucloud.system.dto.UpdateRoleRequest;
import com.moyucloud.system.repository.RoleRepository;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

/** 角色管理业务服务。 */
@Service
public class RoleService {
    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    /** 查询角色列表。 */
    @Transactional(readOnly = true)
    public List<RoleResponse> findAll() {
        return roleRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public Page<RoleResponse> findPage(Pageable pageable) {
        return roleRepository.findAllByOrderByIdAsc(pageable).map(this::toResponse);
    }

    /** 创建角色。 */
    @Transactional
    public RoleResponse create(CreateRoleRequest request) {
        if (roleRepository.findByRoleCode(request.roleCode()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "角色编码已存在");
        }
        return toResponse(
                roleRepository.save(new RoleEntity(request.roleCode(), request.roleName())));
    }

    /** 修改角色名称。 */
    @Transactional
    public RoleResponse update(String id, UpdateRoleRequest request) {
        RoleEntity role =
                roleRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "角色不存在"));
        role.setRoleName(request.roleName());
        return toResponse(role);
    }

    /** 修改角色启用状态，系统管理员角色不可禁用。 */
    @Transactional
    public RoleResponse setEnabled(String id, boolean enabled) {
        RoleEntity role =
                roleRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "角色不存在"));
        if ("admin".equals(role.getRoleCode()) && !enabled)
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "系统管理员角色不可禁用");
        role.setEnabled(enabled);
        return toResponse(role);
    }

    /** 删除角色，系统管理员角色不可删除。 */
    @Transactional
    public void delete(String id) {
        RoleEntity role =
                roleRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "角色不存在"));
        if ("admin".equals(role.getRoleCode()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "系统管理员角色不可删除");
        roleRepository.delete(role);
    }

    private RoleResponse toResponse(RoleEntity role) {
        return new RoleResponse(
                role.getId(), role.getRoleCode(), role.getRoleName(), role.isEnabled());
    }
}
