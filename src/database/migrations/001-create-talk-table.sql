-- 迁移脚本: 001-create-talk-table.sql
-- 描述: 创建 Talk 表
-- 执行时间: 应用启动时自动执行

-- 检查表是否存在，如果不存在则创建
CREATE TABLE IF NOT EXISTS Talk (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(10) NOT NULL,
  message VARCHAR(500) NOT NULL,
  createTime BIGINT NOT NULL DEFAULT (UNIX_TIMESTAMP() * 1000)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 添加索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_talk_create_time ON Talk(createTime DESC);
CREATE INDEX IF NOT EXISTS idx_talk_name ON Talk(name); 