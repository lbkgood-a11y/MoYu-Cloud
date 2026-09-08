package com.moyucloud.audit.dto;

import java.time.LocalDateTime;

/** 操作日志接口响应对象。 */
public record OperationLogResponse(Long id, String username, String action, String resource,
                                   String detail, LocalDateTime createdAt) { }
