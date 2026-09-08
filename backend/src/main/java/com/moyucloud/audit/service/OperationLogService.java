package com.moyucloud.audit.service;

import com.moyucloud.audit.domain.OperationLogEntity;
import com.moyucloud.audit.repository.OperationLogRepository;
import org.springframework.stereotype.Service;

/** 操作审计日志服务。 */
@Service
public class OperationLogService {

    private final OperationLogRepository operationLogRepository;

    public OperationLogService(OperationLogRepository operationLogRepository) {
        this.operationLogRepository = operationLogRepository;
    }

    /** 记录一次业务操作。 */
    public void record(String username, String action, String resource, String detail) {
        operationLogRepository.save(new OperationLogEntity(username, action, resource, detail));
    }
}
