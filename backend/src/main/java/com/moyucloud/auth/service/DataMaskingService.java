package com.moyucloud.auth.service;

import org.springframework.stereotype.Service;

/** 统一敏感数据脱敏规则；脱敏在服务端完成，前端不可绕过。 */
@Service
public class DataMaskingService {
    public String mask(String strategy, String value) {
        if (value == null
                || value.isBlank()
                || strategy == null
                || "NONE".equalsIgnoreCase(strategy)) return value;
        return switch (strategy.toUpperCase()) {
            case "PHONE" ->
                    value.length() >= 7
                            ? value.substring(0, 3) + "****" + value.substring(value.length() - 4)
                            : "****";
            case "NAME" ->
                    value.length() <= 1
                            ? "*"
                            : value.substring(0, 1) + "*".repeat(Math.min(value.length() - 1, 2));
            case "EMAIL" -> {
                int at = value.indexOf('@');
                yield at <= 1
                        ? "***" + (at < 0 ? "" : "@" + value.substring(at + 1))
                        : value.charAt(0) + "***" + value.substring(at);
            }
            case "ID_CARD" ->
                    value.length() <= 8
                            ? "********"
                            : value.substring(0, 3)
                                    + "***********"
                                    + value.substring(value.length() - 4);
            case "BANK_CARD" ->
                    value.length() <= 4
                            ? "****"
                            : "**** **** **** " + value.substring(value.length() - 4);
            case "ADDRESS" ->
                    value.length() <= 6
                            ? "***"
                            : value.substring(0, Math.min(6, value.length())) + "***";
            case "FULL" -> "***";
            default -> "***";
        };
    }

    /** 自定义保留首尾字符数，例如 prefix=2,suffix=2。 */
    public String mask(String value, int prefix, int suffix) {
        if (value == null || value.length() <= prefix + suffix) return "***";
        return value.substring(0, Math.max(0, prefix))
                + "*".repeat(value.length() - prefix - suffix)
                + value.substring(value.length() - Math.max(0, suffix));
    }
}
