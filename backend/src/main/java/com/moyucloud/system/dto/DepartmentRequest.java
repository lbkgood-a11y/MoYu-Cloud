package com.moyucloud.system.dto;

import jakarta.validation.constraints.NotBlank;

public record DepartmentRequest(@NotBlank String name, String parentId, int sortOrder) {}
