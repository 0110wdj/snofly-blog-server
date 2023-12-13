import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TalkModule } from './talk/talk.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '47.97.71.176',
      port: 3306,
      username: 'snofly',
      password: 'snofly0110',
      database: 'blog',
      entities: ['dist/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TalkModule
  ],
})

export class AppModule { }
