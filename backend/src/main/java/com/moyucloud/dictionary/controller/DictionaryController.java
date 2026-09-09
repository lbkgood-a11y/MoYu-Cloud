package com.moyucloud.dictionary.controller;

import com.moyucloud.auth.service.*;
import com.moyucloud.dictionary.domain.*;
import com.moyucloud.dictionary.dto.*;
import com.moyucloud.dictionary.repository.*;
import com.moyucloud.dictionary.service.DictionaryService;
import com.moyucloud.shared.ApiResponse;
import jakarta.validation.Valid;
import java.util.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dictionaries")
public class DictionaryController {
    private final DictionaryTypeRepository types;
    private final DictionaryItemRepository items;
    private final AuthService auth;
    private final DictionaryService service;

    public DictionaryController(
            DictionaryTypeRepository t,
            DictionaryItemRepository i,
            AuthService a,
            DictionaryService s) {
        types = t;
        items = i;
        auth = a;
        service = s;
    }

    @GetMapping
    public ApiResponse<List<DictionaryTypeEntity>> list(
            @RequestHeader(value = "Authorization", required = false) String a) {
        auth.requirePermission(a, PermissionCodes.SYSTEM_USER_READ);
        return ApiResponse.success(types.findAll());
    }

    @GetMapping("/{code}")
    public ApiResponse<DictionaryTypeEntity> byCode(
            @RequestHeader(value = "Authorization", required = false) String a,
            @PathVariable String code) {
        auth.requirePermission(a, PermissionCodes.SYSTEM_USER_READ);
        return ApiResponse.success(service.get(code));
    }

    @PostMapping
    @RequiresPermission(PermissionCodes.SYSTEM_USER_WRITE)
    public ApiResponse<DictionaryTypeEntity> create(
            @RequestHeader(value = "Authorization", required = false) String a,
            @Valid @RequestBody DictionaryTypeRequest r) {
        auth.requirePermission(a, PermissionCodes.SYSTEM_USER_WRITE);
        if (types.findByDictCode(r.dictCode()).isPresent())
            throw new IllegalArgumentException("字典编码已存在");
        return ApiResponse.success(
                types.save(new DictionaryTypeEntity(r.dictCode(), r.dictName())));
    }

    @PutMapping("/{code}")
    public ApiResponse<DictionaryTypeEntity> updateType(
            @RequestHeader(value = "Authorization", required = false) String a,
            @PathVariable String code,
            @Valid @RequestBody DictionaryTypeRequest r) {
        auth.requirePermission(a, PermissionCodes.SYSTEM_USER_WRITE);
        var t = types.findByDictCode(code).orElseThrow();
        t.update(r.dictName());
        service.evict(code);
        return ApiResponse.success(types.save(t));
    }

    @PostMapping("/{code}/items")
    public ApiResponse<DictionaryItemEntity> add(
            @RequestHeader(value = "Authorization", required = false) String a,
            @PathVariable String code,
            @Valid @RequestBody DictionaryItemRequest r) {
        auth.requirePermission(a, PermissionCodes.SYSTEM_USER_WRITE);
        var t = types.findByDictCode(code).orElseThrow();
        var i = new DictionaryItemEntity(r.itemValue(), r.itemLabel(), r.sortOrder());
        t.addItem(i);
        service.evict(code);
        types.save(t);
        return ApiResponse.success(i);
    }

    @PutMapping("/{code}/enabled")
    public ApiResponse<Void> enabled(
            @RequestHeader(value = "Authorization", required = false) String a,
            @PathVariable String code,
            @RequestParam boolean value) {
        auth.requirePermission(a, PermissionCodes.SYSTEM_USER_WRITE);
        var t = types.findByDictCode(code).orElseThrow();
        t.setEnabled(value);
        service.evict(code);
        types.save(t);
        return ApiResponse.success(null);
    }

    @PutMapping("/items/{id}")
    public ApiResponse<DictionaryItemEntity> update(
            @RequestHeader(value = "Authorization", required = false) String a,
            @PathVariable String id,
            @Valid @RequestBody DictionaryItemRequest r) {
        auth.requirePermission(a, PermissionCodes.SYSTEM_USER_WRITE);
        var i = items.findById(id).orElseThrow();
        i.update(r.itemValue(), r.itemLabel(), r.sortOrder());
        if (i.getType() != null) service.evict(i.getType().getDictCode());
        return ApiResponse.success(i);
    }

    @PutMapping("/items/{id}/enabled")
    public ApiResponse<Void> itemEnabled(
            @RequestHeader(value = "Authorization", required = false) String a,
            @PathVariable String id,
            @RequestParam boolean value) {
        auth.requirePermission(a, PermissionCodes.SYSTEM_USER_WRITE);
        var i = items.findById(id).orElseThrow();
        i.setEnabled(value);
        if (i.getType() != null) service.evict(i.getType().getDictCode());
        return ApiResponse.success(null);
    }

    @DeleteMapping("/items/{id}")
    public ApiResponse<Void> delete(
            @RequestHeader(value = "Authorization", required = false) String a,
            @PathVariable String id) {
        auth.requirePermission(a, PermissionCodes.SYSTEM_USER_WRITE);
        var i = items.findById(id).orElseThrow();
        String code = i.getType().getDictCode();
        if (service.referenced(code)) throw new IllegalStateException("字典正在被业务字段引用，无法删除");
        items.delete(i);
        service.evict(code);
        return ApiResponse.success(null);
    }
}
