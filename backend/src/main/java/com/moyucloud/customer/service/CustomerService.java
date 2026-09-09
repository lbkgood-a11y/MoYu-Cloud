package com.moyucloud.customer.service;

import com.moyucloud.audit.service.OperationLogService;
import com.moyucloud.customer.domain.Customer;
import com.moyucloud.customer.domain.CustomerEntity;
import com.moyucloud.customer.dto.CustomerRequest;
import com.moyucloud.customer.repository.CustomerRepository;
import com.moyucloud.dictionary.service.DictionaryService;
import com.moyucloud.shared.PageResponse;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** 客户业务服务，负责客户数据的持久化和领域转换。 */
@Service
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final OperationLogService operationLogService;
    @Autowired private DictionaryService dictionaryService;

    public CustomerService(
            CustomerRepository customerRepository, OperationLogService operationLogService) {
        this.customerRepository = customerRepository;
        this.operationLogService = operationLogService;
    }

    /** 查询客户列表，可按名称关键词筛选。 */
    @Transactional(readOnly = true)
    public List<Customer> findAll(String keyword) {
        List<CustomerEntity> entities =
                keyword == null || keyword.isBlank()
                        ? customerRepository.findAll()
                        : customerRepository.findByNameContaining(keyword);
        return entities.stream().map(this::toDomain).toList();
    }

    /** 分页查询客户，可按名称、联系人或电话筛选。 */
    @Transactional(readOnly = true)
    public PageResponse<Customer> findPage(String keyword, int page, int size) {
        int safePage = Math.max(page, 1);
        int safeSize = Math.min(Math.max(size, 1), 100);
        Page<CustomerEntity> result =
                keyword == null || keyword.isBlank()
                        ? customerRepository.findAll(PageRequest.of(safePage - 1, safeSize))
                        : customerRepository
                                .findByNameContainingOrContactContainingOrPhoneContaining(
                                        keyword,
                                        keyword,
                                        keyword,
                                        PageRequest.of(safePage - 1, safeSize));
        return new PageResponse<>(
                result.map(this::toDomain).getContent(),
                result.getTotalElements(),
                safePage,
                safeSize);
    }

    /** 新增客户。 */
    @Transactional
    public Customer create(CustomerRequest request) {
        return create("admin", request);
    }

    @Transactional
    public Customer create(String username, CustomerRequest request) {
        validateStatus(request.status());
        CustomerEntity entity =
                new CustomerEntity(
                        request.name(), request.contact(), request.phone(), request.status());
        entity.setDepartmentId(request.departmentId());
        Customer customer = toDomain(customerRepository.save(entity));
        operationLogService.record(username, "CREATE", "customer", "创建客户：" + customer.id());
        return customer;
    }

    /** 修改客户，不存在时返回空。 */
    @Transactional
    public Customer update(String id, CustomerRequest request) {
        return update("admin", id, request);
    }

    @Transactional
    public Customer update(String username, String id, CustomerRequest request) {
        validateStatus(request.status());
        return customerRepository
                .findById(id)
                .map(
                        entity -> {
                            entity.update(
                                    request.name(),
                                    request.contact(),
                                    request.phone(),
                                    request.status());
                            entity.setDepartmentId(request.departmentId());
                            Customer customer = toDomain(entity);
                            operationLogService.record(
                                    username, "UPDATE", "customer", "修改客户：" + customer.id());
                            return customer;
                        })
                .orElse(null);
    }

    /** 删除客户，返回是否删除成功。 */
    @Transactional
    public boolean delete(String id) {
        return delete("admin", id);
    }

    private void validateStatus(String status) {
        try {
            var d = dictionaryService.get("customer_status");
            if (d.isEnabled()
                    && d.getItems().stream()
                            .noneMatch(i -> i.isEnabled() && i.getItemValue().equals(status)))
                throw new IllegalArgumentException("客户状态无效");
        } catch (java.util.NoSuchElementException ignored) {
        }
    }

    @Transactional
    public boolean delete(String username, String id) {
        if (!customerRepository.existsById(id)) {
            return false;
        }
        customerRepository.deleteById(id);
        operationLogService.record(username, "DELETE", "customer", "删除客户：" + id);
        return true;
    }

    /** 校验部门范围，管理员传 null 部门表示全量访问。 */
    @Transactional(readOnly = true)
    public boolean canAccess(String id, String departmentId, boolean fullAccess) {
        if (fullAccess) return customerRepository.existsById(id);
        return customerRepository
                .findById(id)
                .map(c -> java.util.Objects.equals(c.getDepartmentId(), departmentId))
                .orElse(false);
    }

    /** 将数据库实体转换为接口领域对象。 */
    private Customer toDomain(CustomerEntity entity) {
        return new Customer(
                entity.getId(),
                entity.getName(),
                entity.getContact(),
                entity.getPhone(),
                entity.getStatus(),
                entity.getDepartmentId());
    }
}
