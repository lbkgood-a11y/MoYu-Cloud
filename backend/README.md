# MoYu-Cloud Java 后端

## 本地启动

```bash
mvn spring-boot:run
```

要求：JDK 17+、Maven 3.9+。演示账号：`admin / admin123`，仅用于本地开发。

接口：`GET /api/health`、`POST /api/auth/login`、`GET /api/auth/me`；客户 CRUD：`GET/POST /api/customers`、`PUT/DELETE /api/customers/{id}`；用户管理：`GET/POST /api/system/users`、`PUT/DELETE /api/system/users/{id}`、`POST /api/system/users/{id}/reset-password`、`PUT /api/system/users/{id}/role`；角色管理：`GET/POST/PUT/DELETE /api/system/roles`。后端代码按认证、系统、客户、审计和共享基础设施进行模块化组织。
