package com.moyucloud.shared;

import java.util.List;

/** 分页接口统一返回结构。 */
public record PageResponse<T>(List<T> items, long total, int page, int size) {}
