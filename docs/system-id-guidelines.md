# 系统 ID 开发规范

## 统一要求

MoYu-Cloud 全系统业务对象统一使用 ULID 作为唯一标识。ULID 以 26 位 Crockford Base32 字符串表示，禁止在 API、前端状态和消息体中使用 JavaScript number 承载业务 ID。

## 约定

- Java 类型：`String`
- TypeScript 类型：`string`
- MySQL 推荐字段：`CHAR(26) CHARACTER SET ascii COLLATE ascii_bin`
- 主键和外键必须使用相同的 ULID 字符串类型与长度
- ID 由服务端生成，创建后不可修改
- 业务时间必须单独保存 `created_at`，不得依赖 ULID 解析时间
- 禁止使用自增主键、雪花 ID 或 UUID 与 ULID 混用
- 分页、排序使用 `created_at, id` 组合排序，避免仅依赖 ULID 顺序

## API 规范

所有资源 ID 按字符串传输：

```json
{"id":"01J8Z7K6Q4Y4N5W0G8R7D2M3C1"}
```

路径参数、请求体、响应体、关联 ID 和审计日志中的 ID 均遵循此约定。

## 迁移要求

现有 BIGINT 数据迁移必须通过新增 ULID 字段、回填、切换外键和删除旧字段的多阶段 Flyway 迁移完成，禁止直接修改生产表类型。迁移期间必须提供回滚方案。
