package com.moyucloud.audit.controller;

import java.util.List;
import com.moyucloud.audit.domain.OperationLogEntity;
import com.moyucloud.audit.dto.OperationLogResponse;
import com.moyucloud.audit.repository.OperationLogRepository;
import com.moyucloud.auth.service.RequiresPermission;
import com.moyucloud.shared.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;
import com.moyucloud.shared.PageResponse;
import com.moyucloud.shared.PageSupport;

/** 操作日志查询接口。 */
@RestController
@RequestMapping("/api/audit/logs")
public class OperationLogController {
    private final OperationLogRepository repository;
    public OperationLogController(OperationLogRepository repository) { this.repository = repository; }

    /** 查询最新操作日志。 */
    @GetMapping
    @RequiresPermission("system:user:read")
    public ApiResponse<List<OperationLogResponse>> findAll() {
        List<OperationLogResponse> logs = repository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toResponse).toList();
        return ApiResponse.success(logs);
    }

    @GetMapping("/page")
    @RequiresPermission("system:user:read")
    public ApiResponse<PageResponse<OperationLogResponse>> findPage(
            @RequestParam(defaultValue = "1") int page, @RequestParam(defaultValue = "10") int size) {
        var pageable = org.springframework.data.domain.PageRequest.of(Math.max(page, 1) - 1, Math.min(Math.max(size, 1), 100));
        var result = repository.findAllByOrderByCreatedAtDesc(pageable).map(this::toResponse);
        return ApiResponse.success(new PageResponse<>(result.getContent(), result.getTotalElements(), pageable.getPageNumber() + 1, pageable.getPageSize()));
    }

    /** 将数据库实体转换为接口响应。 */
    private OperationLogResponse toResponse(OperationLogEntity log) {
        return new OperationLogResponse(log.getId(), log.getUsername(), log.getAction(),
                log.getResource(), log.getDetail(), log.getCreatedAt());
    }
}
