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
    return this.TalkRepository.save(talk)
  }

  findAll(query: QueryMessageDto) {
    return this.TalkRepository.find();
  }
}
