import { Injectable } from '@nestjs/common';
import { QueryMessageDto } from './dto/message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Talk } from './entities/talk.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TalkService {
  constructor(
    @InjectRepository(Talk)
    private readonly TalkRepository: Repository<Talk>,
  ) { }

  async create(talk: Talk) {
    // 自动设置创建时间（毫秒时间戳）
    talk.createTime = Date.now();
    return this.TalkRepository.save(talk);
  }

  findAll(query: QueryMessageDto) {
    return this.TalkRepository.find({
      order: {
        id: 'DESC' // 按ID倒序排列，最新的在最上面
      }
    });
  }
}
