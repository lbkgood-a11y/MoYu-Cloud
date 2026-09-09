package com.moyucloud.modeling.dto;

import jakarta.validation.constraints.NotBlank;

public record ProjectWizardRequest(
        @NotBlank String projectName, @NotBlank String packageName, String databaseUrl) {}
