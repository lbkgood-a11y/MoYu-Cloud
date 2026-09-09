package com.moyucloud.shared;

import java.util.List;

/** 对现有列表服务提供统一分页切片，后续可替换为数据库分页。 */
public final class PageSupport {
    private PageSupport() {}

    public static <T> PageResponse<T> slice(List<T> source, int page, int size) {
        int safePage = Math.max(page, 1), safeSize = Math.min(Math.max(size, 1), 100);
        int start = Math.min((safePage - 1) * safeSize, source.size());
        int end = Math.min(start + safeSize, source.size());
        return new PageResponse<>(source.subList(start, end), source.size(), safePage, safeSize);
    }
}
