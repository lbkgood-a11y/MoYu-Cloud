package com.moyucloud.modeling.repository;

import com.moyucloud.modeling.domain.DataTableEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DataTableRepository extends JpaRepository<DataTableEntity, String> {
    boolean existsByTableCode(String code);
}
