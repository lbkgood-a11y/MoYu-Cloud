package com.moyucloud.customer.controller;

import com.moyucloud.auth.service.AuthService;
import com.moyucloud.auth.service.PermissionCodes;
import com.moyucloud.auth.service.RequiresPermission;
import com.moyucloud.customer.domain.Customer;
import com.moyucloud.customer.dto.CustomerRequest;
import com.moyucloud.customer.service.CustomerFieldPermissionService;
import com.moyucloud.customer.service.CustomerService;
import com.moyucloud.shared.ApiResponse;
import com.moyucloud.shared.PageResponse;
import jakarta.validation.Valid;
import java.util.List;
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
    private final CustomerFieldPermissionService fieldPermissionService;

    public CustomerController(
            CustomerService customerService,
            AuthService authService,
            CustomerFieldPermissionService fieldPermissionService) {
        this.customerService = customerService;
        this.authService = authService;
        this.fieldPermissionService = fieldPermissionService;
    }

    /** 查询客户列表。 */
    @GetMapping
    public ApiResponse<List<?>> findAll(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestParam(required = false) String keyword) {
        authService.requirePermission(authorization, PermissionCodes.CUSTOMER_READ);
        var user = authService.currentUser(authorization);
        return ApiResponse.success(
                customerService.findAll(keyword).stream()
                        .map(c -> fieldPermissionService.toResponse(c, user.roles()))
                        .toList());
    }

    @GetMapping("/page")
    @RequiresPermission(PermissionCodes.CUSTOMER_READ)
    public ApiResponse<PageResponse<?>> findPage(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        authService.requirePermission(authorization, PermissionCodes.CUSTOMER_READ);
        var user = authService.currentUser(authorization);
        var result = customerService.findPage(keyword, page, size);
        var items =
                result.items().stream()
                        .map(c -> fieldPermissionService.toResponse(c, user.roles()))
                        .toList();
        return ApiResponse.success(
                new PageResponse<>(items, result.total(), result.page(), result.size()));
    }

    /** 查询客户详情，统一经过列级脱敏。 */
    @GetMapping("/{id}")
    @RequiresPermission(PermissionCodes.CUSTOMER_READ)
    public ApiResponse<?> findOne(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable String id) {
        authService.requirePermission(authorization, PermissionCodes.CUSTOMER_READ);
        var user = authService.currentUser(authorization);
        var customer =
                customerService.findAll(null).stream()
                        .filter(c -> c.id().equals(id))
                        .findFirst()
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "客户不存在"));
        return ApiResponse.success(fieldPermissionService.toResponse(customer, user.roles()));
    }

    /** 新增客户。 */
    @PostMapping
    @RequiresPermission(PermissionCodes.CUSTOMER_WRITE)
    public ApiResponse<Customer> create(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @Valid @RequestBody CustomerRequest request) {
        var user = authService.currentUser(authorization);
        if (!user.permissions().contains(PermissionCodes.CUSTOMER_WRITE)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "无权执行该操作");
        }
        var safeRequest =
                "admin".equals(user.username())
                        ? request
                        : new CustomerRequest(
                                request.name(),
                                request.contact(),
                                request.phone(),
                                request.status(),
                                user.departmentId());
        return ApiResponse.success(customerService.create(user.username(), safeRequest));
    }

    /** 修改客户。 */
    @PutMapping("/{id}")
    @RequiresPermission(PermissionCodes.CUSTOMER_WRITE)
    public ApiResponse<Customer> update(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable String id,
            @Valid @RequestBody CustomerRequest request) {
        var user = authService.currentUser(authorization);
        if (!user.permissions().contains(PermissionCodes.CUSTOMER_WRITE)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "无权执行该操作");
        }
        String role = user.roles().stream().findFirst().orElse("unknown");
        var existing =
                customerService.findAll(null).stream()
                        .filter(c -> c.id().equals(id))
                        .findFirst()
                        .orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "客户不存在"));
        if (!fieldPermissionService.canWrite(role, "contact")
                && !java.util.Objects.equals(existing.contact(), request.contact()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "无权修改联系人");
        if (!fieldPermissionService.canWrite(role, "phone")
                && !java.util.Objects.equals(existing.phone(), request.phone()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "无权修改手机号");
        if (!fieldPermissionService.canWrite(role, "name")
                && !java.util.Objects.equals(existing.name(), request.name()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "无权修改客户名称");
        if (!fieldPermissionService.canWrite(role, "status")
                && !java.util.Objects.equals(existing.status(), request.status()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "无权修改客户状态");
        if (!fieldPermissionService.canWrite(role, "department")
                && !java.util.Objects.equals(existing.departmentId(), request.departmentId()))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "无权修改客户部门");
        Customer customer = customerService.update(user.username(), id, request);
        if (customer == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "客户不存在");
        }
        return ApiResponse.success(customer);
    }

    /** 删除客户。 */
    @DeleteMapping("/{id}")
    @RequiresPermission(PermissionCodes.CUSTOMER_WRITE)
    public ApiResponse<Void> delete(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @PathVariable String id) {
        var user = authService.currentUser(authorization);
        if (!user.permissions().contains(PermissionCodes.CUSTOMER_WRITE)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "无权执行该操作");
        }
        if (!customerService.canAccess(id, user.departmentId(), "admin".equals(user.username())))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "无权访问其他部门客户");
        if (!customerService.delete(user.username(), id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "客户不存在");
        }
        return ApiResponse.success(null);
    }

    @GetMapping(value = "/export", produces = "text/csv")
    public String export(
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        authService.requirePermission(authorization, PermissionCodes.CUSTOMER_READ);
        var user = authService.currentUser(authorization);
        String role = user.roles().stream().findFirst().orElse("unknown");
        StringBuilder csv = new StringBuilder("id,name,contact,phone,status,departmentId\n");
        customerService.findAll(null).stream()
                .map(c -> fieldPermissionService.toResponse(c, role))
                .forEach(
                        c ->
                                csv.append(
                                                String.join(
                                                        ",",
                                                        esc(c.id()),
                                                        esc(c.name()),
                                                        esc(c.contact()),
                                                        esc(c.phone()),
                                                        esc(c.status()),
                                                        esc(c.departmentId())))
                                        .append('\n'));
        return csv.toString();
    }

    private String esc(String value) {
        return value == null ? "" : "\"" + value.replace("\"", "\"\"") + "\"";
    }
}
