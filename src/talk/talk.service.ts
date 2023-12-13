import { Injectable } from '@nestjs/common';
import { CreateMessageDto, QueryMessageDto } from './dto/message.dto';

@Injectable()
export class TalkService {

  create(params: CreateMessageDto) {
    console.log({ params });
    return 'This action adds a new message';
  }

  findAll(query: QueryMessageDto) {
    console.log({ query });
    return `This action returns all list`;
  }
}
