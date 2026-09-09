package com.moyucloud.audit.domain;

import com.moyucloud.shared.Ulid;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

/** 操作审计日志实体。 */
@Entity
@Table(name = "operation_log")
public class OperationLogEntity {

    @Id
    @jakarta.persistence.Column(length = 26, columnDefinition = "char(26)")
    private String id;

    private String username;
    private String action;
    private String resource;
    private String detail;
    private LocalDateTime createdAt;

    protected OperationLogEntity() {}

    @PrePersist
    void assignId() {
        if (id == null) id = Ulid.next();
    }

    /** 创建操作日志。 */
    public OperationLogEntity(String username, String action, String resource, String detail) {
        this.username = username;
        this.action = action;
        this.resource = resource;
        this.detail = detail;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getAction() {
        return action;
    }

    public String getResource() {
        return resource;
    }

    public String getDetail() {
        return detail;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
