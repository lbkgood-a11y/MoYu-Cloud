package com.moyucloud.customer.service;

import com.moyucloud.auth.service.DataMaskingService;
import com.moyucloud.auth.service.RoleFieldPermissionEvaluator;
import com.moyucloud.customer.domain.Customer;
import com.moyucloud.customer.dto.CustomerResponse;
import org.springframework.stereotype.Service;

/** 客户列级权限的统一响应裁剪入口；后续可替换为角色配置查询。 */
@Service
public class CustomerFieldPermissionService {
    private final DataMaskingService masking;
    private final RoleFieldPermissionEvaluator evaluator;

    public CustomerFieldPermissionService(
            DataMaskingService masking, RoleFieldPermissionEvaluator evaluator) {
        this.masking = masking;
        this.evaluator = evaluator;
    }

    public CustomerResponse toResponse(Customer customer, boolean fullAccess) {
        String contact = fullAccess ? customer.contact() : masking.mask("NAME", customer.contact());
        String phone = fullAccess ? customer.phone() : masking.mask("PHONE", customer.phone());
        return new CustomerResponse(
                customer.id(),
                customer.name(),
                contact,
                phone,
                customer.status(),
                customer.departmentId());
    }

    public CustomerResponse toResponse(Customer customer, String roleId) {
        String contact =
                evaluator.canRead(roleId, "customer", "contact")
                        ? masking.mask(
                                evaluator.maskStrategy(roleId, "customer", "contact"),
                                customer.contact())
                        : null;
        String phone =
                evaluator.canRead(roleId, "customer", "phone")
                        ? masking.mask(
                                evaluator.maskStrategy(roleId, "customer", "phone"),
                                customer.phone())
                        : null;
        return new CustomerResponse(
                customer.id(),
                customer.name(),
                contact,
                phone,
                customer.status(),
                customer.departmentId());
    }

    public boolean canWrite(String roleId, String field) {
        return evaluator.canWrite(roleId, "customer", field);
    }

    public CustomerResponse toResponse(Customer customer, java.util.Collection<String> roles) {
        String contact =
                evaluator.canRead(roles, "customer", "contact")
                        ? masking.mask(
                                evaluator.maskStrategy(roles, "customer", "contact"),
                                customer.contact())
                        : null;
        String phone =
                evaluator.canRead(roles, "customer", "phone")
                        ? masking.mask(
                                evaluator.maskStrategy(roles, "customer", "phone"),
                                customer.phone())
                        : null;
        return new CustomerResponse(
                customer.id(),
                customer.name(),
                contact,
                phone,
                customer.status(),
                customer.departmentId());
    }
}
