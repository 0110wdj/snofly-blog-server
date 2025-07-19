import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { DatabaseService } from './database/database.service';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly databaseService: DatabaseService) {}

  async onModuleInit() {
    this.logger.log('🚀 应用启动，开始初始化数据库...');
    
    try {
      await this.databaseService.initializeDatabase();
      this.logger.log('✅ 数据库初始化完成');
    } catch (error) {
      this.logger.error('❌ 数据库初始化失败:', error);
      // 不抛出错误，让应用继续启动
    }
  }

  getHello(): string {
    return 'Hello World!';
  }
}
