package com.moyucloud.customer.repository;

import com.moyucloud.customer.domain.CustomerEntity;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

/** 客户数据访问接口。 */
public interface CustomerRepository extends JpaRepository<CustomerEntity, String> {
    /** 按名称模糊查询客户。 */
    List<CustomerEntity> findByNameContaining(String keyword);

    Page<CustomerEntity> findByNameContainingOrContactContainingOrPhoneContaining(
            String name, String contact, String phone, Pageable pageable);
}
