package com.moyucloud.dictionary.service;

import com.moyucloud.dictionary.domain.*;
import com.moyucloud.dictionary.repository.*;
import com.moyucloud.modeling.repository.DataFieldRepository;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DictionaryService {
    private final DictionaryTypeRepository types;
    private final DictionaryItemRepository items;
    private final DataFieldRepository fields;
    private final Map<String, DictionaryTypeEntity> cache = new ConcurrentHashMap<>();

    public DictionaryService(
            DictionaryTypeRepository t, DictionaryItemRepository i, DataFieldRepository f) {
        types = t;
        items = i;
        fields = f;
    }

    @Transactional(readOnly = true)
    public DictionaryTypeEntity get(String code) {
        return cache.computeIfAbsent(code, c -> types.findByDictCode(c).orElseThrow());
    }

    public void evict(String code) {
        cache.remove(code);
    }

    public boolean referenced(String code) {
        return fields.existsByDictionaryCode(code);
    }
}
