package com.moyucloud.modeling.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.util.*;

public record DataTableRequest(
        @NotBlank String tableCode,
        @NotBlank String tableName,
        @Valid List<DataFieldRequest> fields) {
    public record DataFieldRequest(
            @NotBlank String fieldCode,
            @NotBlank String fieldType,
            boolean required,
            int sortOrder, String dictionaryCode) { public DataFieldRequest(String c,String t,boolean r,int s){this(c,t,r,s,null);} }
}
