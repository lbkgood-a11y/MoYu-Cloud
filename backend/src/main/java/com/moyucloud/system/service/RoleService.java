package com.moyucloud.system.service;

import java.util.List;
import com.moyucloud.system.domain.RoleEntity;
import com.moyucloud.system.dto.CreateRoleRequest;
import com.moyucloud.system.dto.RoleResponse;
import com.moyucloud.system.repository.RoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/** 角色管理业务服务。 */
@Service
public class RoleService {
    private final RoleRepository roleRepository;
    public RoleService(RoleRepository roleRepository) { this.roleRepository = roleRepository; }
    /** 查询角色列表。 */
    @Transactional(readOnly = true)
    public List<RoleResponse> findAll() { return roleRepository.findAll().stream().map(this::toResponse).toList(); }
    @Transactional(readOnly = true)
    public Page<RoleResponse> findPage(Pageable pageable) { return roleRepository.findAllByOrderByIdAsc(pageable).map(this::toResponse); }
    /** 创建角色。 */
    @Transactional
    public RoleResponse create(CreateRoleRequest request) { return toResponse(roleRepository.save(new RoleEntity(request.roleCode(), request.roleName()))); }
    private RoleResponse toResponse(RoleEntity role) { return new RoleResponse(role.getId(), role.getRoleCode(), role.getRoleName(), role.isEnabled()); }
}
