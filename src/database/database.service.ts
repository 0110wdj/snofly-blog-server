import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MigrationService } from './migration.service';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    private dataSource: DataSource,
    private migrationService: MigrationService
  ) {}

  /**
   * 检查并初始化数据库
   */
  async initializeDatabase(): Promise<void> {
    this.logger.log('🔍 开始检查数据库结构...');
    
    try {
      // 检查数据库是否存在
      await this.checkDatabaseExists();
      
      // 执行数据库迁移
      await this.migrationService.runMigrations();
      
      // 检查并创建表
      await this.checkAndCreateTables();
      
      // 检查并创建字段
      await this.checkAndCreateColumns();
      
      this.logger.log('✅ 数据库结构检查完成');
    } catch (error) {
      this.logger.error('❌ 数据库初始化失败:', error);
      throw error;
    }
  }

  /**
   * 检查数据库是否存在
   */
  private async checkDatabaseExists(): Promise<void> {
    try {
      const result = await this.dataSource.query('SELECT DATABASE() as current_db');
      const currentDb = result[0]?.current_db;
      
      if (currentDb !== 'blog') {
        this.logger.warn(`⚠️ 当前数据库不是 'blog'，当前数据库: ${currentDb}`);
      } else {
        this.logger.log('✅ 数据库连接正常');
      }
    } catch (error) {
      this.logger.error('❌ 数据库连接失败:', error);
      throw error;
    }
  }

  /**
   * 检查并创建表
   */
  private async checkAndCreateTables(): Promise<void> {
    try {
      // 检查 Talk 表是否存在
      const tables = await this.dataSource.query(`
        SELECT TABLE_NAME 
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = 'blog' AND TABLE_NAME = 'Talk'
      `);

      if (tables.length === 0) {
        this.logger.log('📋 创建 Talk 表...');
        await this.createTalkTable();
        this.logger.log('✅ Talk 表创建成功');
      } else {
        this.logger.log('✅ Talk 表已存在');
      }
    } catch (error) {
      this.logger.error('❌ 表检查失败:', error);
      throw error;
    }
  }

  /**
   * 创建 Talk 表
   */
  private async createTalkTable(): Promise<void> {
    const createTableSQL = `
      CREATE TABLE Talk (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(10) NOT NULL,
        message VARCHAR(500) NOT NULL,
        createTime BIGINT NOT NULL DEFAULT (UNIX_TIMESTAMP() * 1000)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    await this.dataSource.query(createTableSQL);
  }

  /**
   * 检查并创建字段
   */
  private async checkAndCreateColumns(): Promise<void> {
    try {
      // 检查 Talk 表的字段
      const columns = await this.dataSource.query(`
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = 'blog' AND TABLE_NAME = 'Talk'
        ORDER BY ORDINAL_POSITION
      `);

      const columnNames = columns.map(col => col.COLUMN_NAME);
      this.logger.log('📋 当前字段:', columnNames);

      // 检查必需字段
      const requiredColumns = [
        { name: 'id', type: 'int', nullable: 'NO', default: null },
        { name: 'name', type: 'varchar', nullable: 'NO', default: null },
        { name: 'message', type: 'varchar', nullable: 'NO', default: null },
        { name: 'createTime', type: 'bigint', nullable: 'NO', default: '(unix_timestamp() * 1000)' }
      ];

      for (const requiredCol of requiredColumns) {
        const existingCol = columns.find(col => col.COLUMN_NAME === requiredCol.name);
        
        if (!existingCol) {
          this.logger.log(`📋 添加字段: ${requiredCol.name}`);
          await this.addColumn('Talk', requiredCol);
        } else {
          this.logger.log(`✅ 字段 ${requiredCol.name} 已存在`);
        }
      }
    } catch (error) {
      this.logger.error('❌ 字段检查失败:', error);
      throw error;
    }
  }

  /**
   * 添加字段
   */
  private async addColumn(tableName: string, column: any): Promise<void> {
    let sql = `ALTER TABLE ${tableName} ADD COLUMN ${column.name} `;
    
    switch (column.name) {
      case 'id':
        sql += 'INT AUTO_INCREMENT PRIMARY KEY';
        break;
      case 'name':
        sql += 'VARCHAR(10) NOT NULL';
        break;
      case 'message':
        sql += 'VARCHAR(500) NOT NULL';
        break;
      case 'createTime':
        sql += 'BIGINT NOT NULL DEFAULT (UNIX_TIMESTAMP() * 1000)';
        break;
      default:
        throw new Error(`未知字段类型: ${column.name}`);
    }
    
    await this.dataSource.query(sql);
  }

  /**
   * 获取数据库状态信息
   */
  async getDatabaseStatus(): Promise<any> {
    try {
      const tables = await this.dataSource.query(`
        SELECT TABLE_NAME, TABLE_ROWS, CREATE_TIME, UPDATE_TIME
        FROM information_schema.TABLES 
        WHERE TABLE_SCHEMA = 'blog'
      `);

      const talkColumns = await this.dataSource.query(`
        SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, COLUMN_DEFAULT
        FROM information_schema.COLUMNS 
        WHERE TABLE_SCHEMA = 'blog' AND TABLE_NAME = 'Talk'
        ORDER BY ORDINAL_POSITION
      `);

      return {
        database: 'blog',
        tables,
        talkColumns,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('❌ 获取数据库状态失败:', error);
      throw error;
    }
  }
} 