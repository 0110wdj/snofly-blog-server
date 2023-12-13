import { Module } from '@nestjs/common';
import { TalkController } from './talk/talk.controller';

@Module({
  controllers: [TalkController],
})
export class AppModule { }
