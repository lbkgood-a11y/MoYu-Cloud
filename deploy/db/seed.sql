-- MoYu-Cloud MVP 演示数据
USE moyu_cloud;

INSERT INTO customer (name, contact, phone, status)
SELECT '示例客户', '张三', '13800138000', 'ACTIVE'
WHERE NOT EXISTS (SELECT 1 FROM customer WHERE name = '示例客户');
