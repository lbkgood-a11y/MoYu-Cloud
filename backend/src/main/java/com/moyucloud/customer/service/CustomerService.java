package com.moyucloud.customer.service;

import java.util.List;

import com.moyucloud.customer.domain.Customer;
import com.moyucloud.customer.domain.CustomerEntity;
import com.moyucloud.customer.dto.CustomerRequest;
import com.moyucloud.customer.repository.CustomerRepository;
import com.moyucloud.audit.service.OperationLogService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import com.moyucloud.shared.PageResponse;

/** 客户业务服务，负责客户数据的持久化和领域转换。 */
@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final OperationLogService operationLogService;

    public CustomerService(CustomerRepository customerRepository, OperationLogService operationLogService) {
        this.customerRepository = customerRepository;
        this.operationLogService = operationLogService;
    }

    /** 查询客户列表，可按名称关键词筛选。 */
    @Transactional(readOnly = true)
    public List<Customer> findAll(String keyword) {
        List<CustomerEntity> entities = keyword == null || keyword.isBlank()
                ? customerRepository.findAll()
                : customerRepository.findByNameContaining(keyword);
        return entities.stream().map(this::toDomain).toList();
    }

    /** 分页查询客户，可按名称、联系人或电话筛选。 */
    @Transactional(readOnly = true)
    public PageResponse<Customer> findPage(String keyword, int page, int size) {
        int safePage = Math.max(page, 1);
        int safeSize = Math.min(Math.max(size, 1), 100);
        Page<CustomerEntity> result = keyword == null || keyword.isBlank()
                ? customerRepository.findAll(PageRequest.of(safePage - 1, safeSize))
                : customerRepository.findByNameContainingOrContactContainingOrPhoneContaining(keyword, keyword, keyword,
                        PageRequest.of(safePage - 1, safeSize));
        return new PageResponse<>(result.map(this::toDomain).getContent(), result.getTotalElements(), safePage, safeSize);
    }

    /** 新增客户。 */
    @Transactional
    public Customer create(CustomerRequest request) {
        Customer customer = toDomain(customerRepository.save(new CustomerEntity(
                request.name(), request.contact(), request.phone(), request.status())));
        operationLogService.record("admin", "CREATE", "customer", "创建客户：" + customer.id());
        return customer;
    }

    /** 修改客户，不存在时返回空。 */
    @Transactional
    public Customer update(Long id, CustomerRequest request) {
        return customerRepository.findById(id).map(entity -> {
            entity.update(request.name(), request.contact(), request.phone(), request.status());
            Customer customer = toDomain(entity);
            operationLogService.record("admin", "UPDATE", "customer", "修改客户：" + customer.id());
            return customer;
        }).orElse(null);
    }

    /** 删除客户，返回是否删除成功。 */
    @Transactional
    public boolean delete(Long id) {
        if (!customerRepository.existsById(id)) {
            return false;
        }
        customerRepository.deleteById(id);
        operationLogService.record("admin", "DELETE", "customer", "删除客户：" + id);
        return true;
    }

    /** 将数据库实体转换为接口领域对象。 */
    private Customer toDomain(CustomerEntity entity) {
        return new Customer(entity.getId(), entity.getName(), entity.getContact(), entity.getPhone(), entity.getStatus());
    }
}
