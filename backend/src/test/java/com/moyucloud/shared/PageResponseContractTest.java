package com.moyucloud.shared;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;
import org.junit.jupiter.api.Test;

class PageResponseContractTest {
    @Test
    void exposesStablePaginationFields() {
        var response = new PageResponse<>(List.of("item"), 11, 2, 10);
        assertThat(response.items()).containsExactly("item");
        assertThat(response.total()).isEqualTo(11);
        assertThat(response.page()).isEqualTo(2);
        assertThat(response.size()).isEqualTo(10);
    }
}
