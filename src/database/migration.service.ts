import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);

  constructor(private dataSource: DataSource) {}

  /**
   * 执行所有迁移
   */
  async runMigrations(): Promise<void> {
    this.logger.log('🔄 开始执行数据库迁移...');
    
    try {
      // 创建迁移记录表
      await this.createMigrationTable();
      
      // 获取已执行的迁移
      const executedMigrations = await this.getExecutedMigrations();
      
      // 获取迁移文件
      const migrationFiles = this.getMigrationFiles();
      
      // 执行未执行的迁移
      for (const file of migrationFiles) {
        if (!executedMigrations.includes(file)) {
          await this.executeMigration(file);
        }
      }
      
      this.logger.log('✅ 数据库迁移完成');
    } catch (error) {
      this.logger.error('❌ 数据库迁移失败:', error);
      throw error;
    }
  }

  /**
   * 创建迁移记录表
   */
  private async createMigrationTable(): Promise<void> {
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS migrations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        migration_name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `;
    
    await this.dataSource.query(createTableSQL);
  }

  /**
   * 获取已执行的迁移
   */
  private async getExecutedMigrations(): Promise<string[]> {
    try {
      const result = await this.dataSource.query('SELECT migration_name FROM migrations');
      return result.map(row => row.migration_name);
    } catch (error) {
      return [];
    }
  }

  /**
   * 获取迁移文件列表
   */
  private getMigrationFiles(): string[] {
    const migrationsDir = path.join(__dirname, 'migrations');
    
    if (!fs.existsSync(migrationsDir)) {
      return [];
    }
    
    return fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
  }

  /**
   * 执行单个迁移
   */
  private async executeMigration(fileName: string): Promise<void> {
    this.logger.log(`📋 执行迁移: ${fileName}`);
    
    const filePath = path.join(__dirname, 'migrations', fileName);
    const sql = fs.readFileSync(filePath, 'utf8');
    
    // 分割 SQL 语句
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    // 执行每个 SQL 语句
    for (const statement of statements) {
      if (statement.trim()) {
        await this.dataSource.query(statement);
      }
    }
    
    // 记录迁移执行
    await this.dataSource.query(
      'INSERT INTO migrations (migration_name) VALUES (?)',
      [fileName]
    );
    
    this.logger.log(`✅ 迁移完成: ${fileName}`);
  }

  /**
   * 获取迁移状态
   */
  async getMigrationStatus(): Promise<any> {
    try {
      const executedMigrations = await this.getExecutedMigrations();
      const migrationFiles = this.getMigrationFiles();
      
      const pendingMigrations = migrationFiles.filter(
        file => !executedMigrations.includes(file)
      );
      
      return {
        executed: executedMigrations,
        pending: pendingMigrations,
        total: migrationFiles.length,
        executedCount: executedMigrations.length,
        pendingCount: pendingMigrations.length
      };
    } catch (error) {
      this.logger.error('❌ 获取迁移状态失败:', error);
      throw error;
    }
  }
} 