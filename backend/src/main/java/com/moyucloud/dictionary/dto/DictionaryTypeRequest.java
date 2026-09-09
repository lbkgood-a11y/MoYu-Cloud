package com.moyucloud.dictionary.dto;

import jakarta.validation.constraints.NotBlank;

public record DictionaryTypeRequest(@NotBlank String dictCode, @NotBlank String dictName) {}
