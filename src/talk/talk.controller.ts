import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { CreateMessageDto, QueryMessageDto } from './dto/message.dto';
import { TalkService } from './talk.service';
import { Talk } from './entities/talk.entity';

@Controller('/blog/talkBoard')
export class TalkController {
  constructor(private readonly TalkService: TalkService) { }

  @Get('/getInfo')
  findAll(@Query() query: QueryMessageDto) {
    return this.TalkService.findAll(query);
  }

  @Post('/addInfo')
  async create(@Body() talk: Talk) {
    const result = await this.TalkService.create(talk);
    return {
      success: true,
      data: result,
      message: '留言添加成功'
    };
  }
}
