import { Controller, Get, Post } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MigrationService } from './migration.service';

@Controller('/database')
export class DatabaseController {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly migrationService: MigrationService
  ) {}

  @Get('/status')
  async getStatus() {
    try {
      const status = await this.databaseService.getDatabaseStatus();
      return {
        success: true,
        data: status,
        message: '数据库状态查询成功'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: `数据库状态查询失败: ${error.message}`
      };
    }
  }

  @Get('/migrations')
  async getMigrationStatus() {
    try {
      const status = await this.migrationService.getMigrationStatus();
      return {
        success: true,
        data: status,
        message: '迁移状态查询成功'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: `迁移状态查询失败: ${error.message}`
      };
    }
  }

  @Post('/init')
  async initializeDatabase() {
    try {
      await this.databaseService.initializeDatabase();
      return {
        success: true,
        data: null,
        message: '数据库初始化成功'
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: `数据库初始化失败: ${error.message}`
      };
    }
  }
} 