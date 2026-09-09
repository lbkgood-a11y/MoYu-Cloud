package com.moyucloud.audit.repository;

import com.moyucloud.audit.domain.OperationLogEntity;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/** 操作日志数据访问接口。 */
public interface OperationLogRepository extends JpaRepository<OperationLogEntity, String> {
    Page<OperationLogEntity> findAllByOrderByCreatedAtDesc(Pageable pageable);

    /** 按创建时间倒序查询日志。 */
    List<OperationLogEntity> findAllByOrderByCreatedAtDesc();
}
