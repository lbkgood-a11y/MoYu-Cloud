package com.moyucloud.system.repository;

import com.moyucloud.system.domain.DepartmentEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<DepartmentEntity, String> {
    List<DepartmentEntity> findAllByOrderBySortOrderAscNameAsc();

    boolean existsByParentId(String parentId);
}
