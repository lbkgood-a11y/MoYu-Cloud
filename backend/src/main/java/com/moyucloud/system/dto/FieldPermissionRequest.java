package com.moyucloud.system.dto;

public record FieldPermissionRequest(
        String fieldCode, boolean readable, boolean writable, String maskStrategy) {}
