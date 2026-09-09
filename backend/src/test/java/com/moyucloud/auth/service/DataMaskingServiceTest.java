package com.moyucloud.auth.service;

import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

class DataMaskingServiceTest {
    private final DataMaskingService service = new DataMaskingService();

    @Test
    void masksCommonFields() {
        assertEquals("138****5678", service.mask("PHONE", "13812345678"));
        assertEquals("张**", service.mask("NAME", "张三丰"));
        assertEquals("a***@example.com", service.mask("EMAIL", "alice@example.com"));
        assertEquals("**** **** **** 7890", service.mask("BANK_CARD", "6222021234567890"));
    }

    @Test
    void supportsCustomMask() {
        assertEquals("ab********yz", service.mask("abcdefghijyz", 2, 2));
    }
}
