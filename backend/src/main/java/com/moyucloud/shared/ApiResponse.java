package com.moyucloud.shared;

/** 统一接口响应结构。 */
public record ApiResponse<T>(boolean success, T data, String message, String code) {
    /** 创建成功响应。 */
    public static <T> ApiResponse<T> success(T data) { return new ApiResponse<>(true, data, "操作成功", "OK"); }
    /** 创建失败响应。 */
    public static <T> ApiResponse<T> failure(String message) { return new ApiResponse<>(false, null, message, "ERROR"); }
}
