package com.moyucloud.shared;

import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

/** 统一处理接口异常。 */
@RestControllerAdvice
public class GlobalExceptionHandler {
    /** 处理参数校验失败。 */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiResponse<Void> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage()).collect(Collectors.joining("；"));
        return ApiResponse.failure(message);
    }
    /** 处理主动抛出的 HTTP 异常。 */
    @ExceptionHandler(ResponseStatusException.class)
    public ApiResponse<Void> handleResponseStatus(ResponseStatusException exception) {
        return ApiResponse.failure(exception.getReason() == null ? "请求失败" : exception.getReason());
    }
    /** 处理未预期异常。 */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<Void> handleUnexpected(Exception exception) {
        return ApiResponse.failure("服务器内部错误");
    }
}
