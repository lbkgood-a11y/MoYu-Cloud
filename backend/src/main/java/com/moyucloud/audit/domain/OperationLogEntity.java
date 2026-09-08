package com.moyucloud.audit.domain;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** 操作审计日志实体。 */
@Entity
@Table(name = "operation_log")
public class OperationLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String action;
    private String resource;
    private String detail;
    private LocalDateTime createdAt;

    protected OperationLogEntity() {
    }

    /** 创建操作日志。 */
    public OperationLogEntity(String username, String action, String resource, String detail) {
        this.username = username;
        this.action = action;
        this.resource = resource;
        this.detail = detail;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getAction() { return action; }
    public String getResource() { return resource; }
    public String getDetail() { return detail; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
