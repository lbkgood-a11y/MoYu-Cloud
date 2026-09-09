package com.moyucloud.dictionary.repository;

import com.moyucloud.dictionary.domain.DictionaryItemEntity;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DictionaryItemRepository extends JpaRepository<DictionaryItemEntity, String> {
    List<DictionaryItemEntity> findByTypeIdOrderBySortOrderAsc(String typeId);
}
