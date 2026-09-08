package com.moyucloud.customer.controller;

import java.util.List;

import com.moyucloud.auth.service.AuthService;
import com.moyucloud.customer.domain.Customer;
import com.moyucloud.customer.dto.CustomerRequest;
import com.moyucloud.customer.service.CustomerService;
import com.moyucloud.shared.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

/** 客户管理接口。 */
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;
    private final AuthService authService;

    public CustomerController(CustomerService customerService, AuthService authService) {
        this.customerService = customerService;
        this.authService = authService;
    }

    /** 查询客户列表。 */
    @GetMapping
    public ApiResponse<List<Customer>> findAll(@RequestHeader(value = "Authorization", required = false) String authorization,
                                  @RequestParam(required = false) String keyword) {
        authService.requirePermission(authorization, "customer:read");
        return ApiResponse.success(customerService.findAll(keyword));
    }

    /** 新增客户。 */
    @PostMapping
    public ApiResponse<Customer> create(@RequestHeader(value = "Authorization", required = false) String authorization,
                           @Valid @RequestBody CustomerRequest request) {
        authService.requirePermission(authorization, "customer:write");
        return ApiResponse.success(customerService.create(request));
    }

    /** 修改客户。 */
    @PutMapping("/{id}")
    public ApiResponse<Customer> update(@RequestHeader(value = "Authorization", required = false) String authorization,
                           @PathVariable Long id, @Valid @RequestBody CustomerRequest request) {
        authService.requirePermission(authorization, "customer:write");
        Customer customer = customerService.update(id, request);
        if (customer == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "客户不存在");
        }
        return ApiResponse.success(customer);
    }

    /** 删除客户。 */
    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@RequestHeader(value = "Authorization", required = false) String authorization,
                       @PathVariable Long id) {
        authService.requirePermission(authorization, "customer:write");
        if (!customerService.delete(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "客户不存在");
        }
        return ApiResponse.success(null);
    }
}
