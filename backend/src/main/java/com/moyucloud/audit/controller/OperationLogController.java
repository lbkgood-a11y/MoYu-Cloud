package com.moyucloud.audit.controller;

import java.util.List;
import com.moyucloud.audit.domain.OperationLogEntity;
import com.moyucloud.audit.dto.OperationLogResponse;
import com.moyucloud.audit.repository.OperationLogRepository;
import com.moyucloud.auth.service.AuthService;
import com.moyucloud.shared.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 操作日志查询接口。 */
@RestController
@RequestMapping("/api/audit/logs")
public class OperationLogController {
    private final OperationLogRepository repository;
    private final AuthService authService;

    public OperationLogController(OperationLogRepository repository, AuthService authService) {
        this.repository = repository;
        this.authService = authService;
    }

    /** 查询最新操作日志。 */
    @GetMapping
    public ApiResponse<List<OperationLogResponse>> findAll(
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        authService.requirePermission(authorization, "system:user:read");
        List<OperationLogResponse> logs = repository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse).toList();
        return ApiResponse.success(logs);
    }

    /** 将数据库实体转换为接口响应。 */
    private OperationLogResponse toResponse(OperationLogEntity log) {
        return new OperationLogResponse(log.getId(), log.getUsername(), log.getAction(),
                log.getResource(), log.getDetail(), log.getCreatedAt());
    }
}
