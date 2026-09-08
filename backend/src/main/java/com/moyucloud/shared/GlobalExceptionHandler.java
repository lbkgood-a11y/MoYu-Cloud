package com.moyucloud.shared;

import java.util.stream.Collectors;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getDefaultMessage()).collect(Collectors.joining("；"));
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ApiResponse<>(false, null, message, "VALIDATION_ERROR"));
    }
    /** 处理主动抛出的 HTTP 异常。 */
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiResponse<Void>> handleResponseStatus(ResponseStatusException exception) {
        HttpStatus status = HttpStatus.resolve(exception.getStatusCode().value());
        if (status == null) status = HttpStatus.INTERNAL_SERVER_ERROR;
        String code = switch (status) {
            case UNAUTHORIZED -> "AUTH_REQUIRED";
            case FORBIDDEN -> "PERMISSION_DENIED";
            case NOT_FOUND -> "RESOURCE_NOT_FOUND";
            case BAD_REQUEST -> "VALIDATION_ERROR";
            case CONFLICT -> "DUPLICATE_RESOURCE";
            default -> "INTERNAL_ERROR";
        };
        return ResponseEntity.status(status).body(new ApiResponse<>(false, null,
                exception.getReason() == null ? "请求失败" : exception.getReason(), code));
    }
    /** 处理未预期异常。 */
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ApiResponse<Void> handleUnexpected(Exception exception) {
        return new ApiResponse<>(false, null, "服务器内部错误", "INTERNAL_ERROR");
    }
}
