# MoYu-Cloud 本地部署

## 构建并启动

可先复制根目录的 `.env.example` 为 `deploy/.env` 并修改敏感配置；不要将真实密码提交到 Git。

在 `deploy` 目录执行：

```powershell
$env:MYSQL_ROOT_PASSWORD="123456"
$env:MOYU_JWT_SECRET="<32字节以上随机密钥>"
$env:MOYU_ADMIN_USERNAME="admin"
$env:MOYU_ADMIN_PASSWORD="<强密码>"
mvn -f ..\backend\pom.xml clean package -DskipTests
docker compose up -d --build
```

必填环境变量：

| 变量 | 说明 |
| --- | --- |
| MYSQL_ROOT_PASSWORD | MySQL root 密码 |
| MOYU_JWT_SECRET | JWT 签名密钥（至少 32 字节） |
| MOYU_ADMIN_USERNAME | 初始管理员用户名（未设置则不创建） |
| MOYU_ADMIN_PASSWORD | 初始管理员密码 |

健康检查地址：`http://localhost:8080/api/health`。

MySQL 和后端端口仅绑定到本机回环地址，不对局域网公开。

数据库结构脚本位于 `deploy/db/schema.sql`，演示数据位于 `deploy/db/seed.sql`。开发环境可在容器启动后执行这两个脚本进行初始化。

## 停止服务

```powershell
docker compose down
```

数据库数据保存在 Docker Volume 中。删除数据卷会导致本地数据丢失，请谨慎操作。
