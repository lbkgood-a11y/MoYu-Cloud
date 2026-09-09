package com.moyucloud.dictionary;

import static org.junit.jupiter.api.Assertions.*;

import com.moyucloud.dictionary.repository.*;
import com.moyucloud.dictionary.service.DictionaryService;
import com.moyucloud.modeling.repository.DataFieldRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class DictionaryServiceTest {
    @Test
    void referencedDelegatesToModelingFields() {
        var f = Mockito.mock(DataFieldRepository.class);
        Mockito.when(f.existsByDictionaryCode("customer_status")).thenReturn(true);
        var s =
                new DictionaryService(
                        Mockito.mock(DictionaryTypeRepository.class),
                        Mockito.mock(DictionaryItemRepository.class),
                        f);
        assertTrue(s.referenced("customer_status"));
    }
}
