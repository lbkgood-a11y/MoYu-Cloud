# MVP 产品化任务清单

## 已完成

- 用户编辑、删除、启用/禁用和重置密码
- 角色编辑、删除、启用/禁用
- 系统管理员账号和角色保护规则
- 菜单树展示与角色批量授权
- Controller 使用统一权限常量和声明式权限注解
- 后端接口契约测试、权限保护测试和 JPA 复合主键测试
- Testcontainers MySQL 集成测试（通过 `RUN_MYSQL_TESTS=true` 启用）
- Docker Compose 数据库与后端健康检查
- Docker CI、后端镜像构建和 Trivy 高危漏洞扫描
- Flyway V1 基线和 V2 默认权限脚本
- 前端 TypeScript、请求拦截、空数据提示、排序入口
- ESLint、Prettier 和 Vitest 组件测试配置

## 验证命令

```powershell
# 后端
mvn -f backend/pom.xml test

# 启用真实 MySQL 容器测试（需要 Docker）
$env:RUN_MYSQL_TESTS="true"
mvn -f backend/pom.xml verify

# 前端
cd frontend
npm run test
npm run lint
npm run format:check
npm run build
```

## 后续建议

- 将用户角色从单个 `roleCode` 迁移为完整多角色关联模型
- 将菜单树授权回显和数据权限继续细化
- 对生产数据库执行 Flyway 升级演练和回滚演练
- 将前端页面从现有组件集成到 RuoYi-Vue3 的正式布局体系

