package com.moyucloud.dictionary.repository;

import com.moyucloud.dictionary.domain.DictionaryTypeEntity;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DictionaryTypeRepository extends JpaRepository<DictionaryTypeEntity, String> {
    Optional<DictionaryTypeEntity> findByDictCode(String code);
}
