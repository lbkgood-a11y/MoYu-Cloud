package com.moyucloud.customer.repository;

import java.util.List;
import com.moyucloud.customer.domain.CustomerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

/** 客户数据访问接口。 */
public interface CustomerRepository extends JpaRepository<CustomerEntity, Long> {
    /** 按名称模糊查询客户。 */
    List<CustomerEntity> findByNameContaining(String keyword);
}
