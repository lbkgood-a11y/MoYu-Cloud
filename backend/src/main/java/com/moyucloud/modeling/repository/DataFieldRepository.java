package com.moyucloud.modeling.repository;

import com.moyucloud.modeling.domain.DataFieldEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DataFieldRepository extends JpaRepository<DataFieldEntity, String> {
    boolean existsByDictionaryCode(String code);
}
