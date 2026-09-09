package com.moyucloud.dictionary.dto;

import jakarta.validation.constraints.NotBlank;

public record DictionaryItemRequest(
        @NotBlank String itemValue, @NotBlank String itemLabel, int sortOrder) {}
