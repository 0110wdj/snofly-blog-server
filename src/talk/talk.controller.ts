import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { CreateMessageDto, QueryMessageDto } from './dto/message.dto';
import { TalkService } from './talk.service';

@Controller('/blog/talkBoard')
export class TalkController {
  constructor(private readonly TalkService: TalkService) { }

  @Get('/getInfo')
  findAll(@Query() query: QueryMessageDto) {
    return this.TalkService.findAll(query)
  }

  @Post('/addInfo')
  create(@Body() createCatDto: CreateMessageDto) {
    console.log({ createCatDto });
    return this.TalkService.create(createCatDto)

    return 'called addInfo';
  }

}
