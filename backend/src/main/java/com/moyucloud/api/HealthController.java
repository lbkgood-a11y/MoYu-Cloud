package com.moyucloud.api;

import com.moyucloud.shared.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** 提供应用健康检查接口。 */
@RestController
@RequestMapping("/api")
public class HealthController {

    /** 返回应用当前运行状态。 */
    @GetMapping("/health")
    public ApiResponse<HealthResponse> health() {
        return ApiResponse.success(new HealthResponse("ok", "moyu-cloud-backend"));
    }

    /** 健康检查响应。 */
    public record HealthResponse(String status, String service) {
    }
}
