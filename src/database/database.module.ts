import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { MigrationService } from './migration.service';

@Module({
  controllers: [DatabaseController],
  providers: [DatabaseService, MigrationService],
  exports: [DatabaseService, MigrationService],
})
export class DatabaseModule {} 