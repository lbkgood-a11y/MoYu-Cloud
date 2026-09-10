package com.moyucloud.modeling.repository;

import com.moyucloud.modeling.domain.DataTableEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface DataTableRepository extends JpaRepository<DataTableEntity, String> {
    boolean existsByTableCode(String code);

    Optional<DataTableEntity> findByTableCode(String code);
}
