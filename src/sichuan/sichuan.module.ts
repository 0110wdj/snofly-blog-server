import { Module } from '@nestjs/common';
import { SichuanService } from './sichuan.service';
import { SichuanController } from './sichuan.controller';

@Module({
  controllers: [SichuanController],
  providers: [SichuanService],
})
export class SichuanModule { }
