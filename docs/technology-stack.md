# MoYu-Cloud 技术栈与框架选型

## 选型结论

MoYu-Cloud 采用“Spring Boot 单体起步、模块化演进、按需引入 Spring Cloud”的路线。

## 当前 MVP

| 层次 | 技术选择 | 说明 |
| --- | --- | --- |
| 后端核心 | Java 17 + Spring Boot 3.x | 构建可运行的企业级业务后端 |
| 项目构建 | Maven | 统一依赖、构建和插件管理 |
| API 风格 | RESTful API | 便于前后端分离和第三方集成 |
| 认证授权 | JWT + Spring Security 演进 | 当前先验证登录与权限闭环 |
| 前端控制台 | RuoYi-Vue3 | 基于 Vue 3、TypeScript、Vite 和 Element Plus 的管理端基础框架 |
| 数据访问 | Spring Data / MyBatis 按场景选择 | 简单模块优先约定，复杂查询保留灵活性 |
| 数据库 | MySQL 8.x | 作为 MVP 默认关系型数据库 |
| 部署 | Docker | 保证本地和服务器环境一致 |

## 前端框架选择

在 `vue-vben-admin`、`SoybeanAdmin`、`pure-admin` 和 RuoYi-Vue 系列中，MoYu-Cloud 选择 **RuoYi-Vue3** 作为管理端基础框架。

选择依据：

- 与 Java/Spring Boot 后端路线匹配
- 登录、权限、菜单、用户和字典等企业后台能力成熟
- Element Plus 适合表格、表单和配置型页面
- 国内企业项目使用广泛，便于团队上手和维护
- 能够快速支撑 MoYu-Cloud 的第一个可运行管理端

使用边界：

- 复用登录、布局、动态菜单、权限路由和组件体系
- 重新整理 MoYu-Cloud 的 API、目录、权限模型和代码生成模板
- 不直接绑定 RuoYi 自带后端、数据库表结构或业务约定
- 生成代码必须保持独立、清晰、可维护

## 架构路线

### 阶段一：Spring Boot 单体

先以一个应用完成登录、权限、用户、日志和业务 CRUD，目标是快速验证产品闭环和开发体验。

### 阶段二：模块化单体

保持单一部署单元，但按领域清晰隔离：

```text
com.moyucloud
├─ auth
├─ system
├─ audit
├─ customer
└─ shared
```

### 阶段三：按需引入 Spring Cloud

当服务需要独立扩缩容、独立发布或统一治理时，再引入：

- Spring Cloud Gateway
- 服务注册与配置中心
- 服务间调用和容错组件
- 链路追踪与统一监控

Spring Cloud 是演进能力，不是 MVP 的默认复杂度。

## AI 与自动化服务

代码生成、智能建模、文档生成和数据处理等 AI 能力使用 Python 独立服务承载，与 Java 核心业务通过 HTTP 或消息协议集成。Python 不作为核心业务后端框架。

## 选型原则

- 优先保证开箱即用和本地启动速度
- 先验证业务闭环，再引入分布式基础设施
- 模块边界先于服务拆分
- 核心业务使用稳定、成熟、易维护的企业级技术
- 每次引入新框架都必须对应明确的用户价值或工程收益
