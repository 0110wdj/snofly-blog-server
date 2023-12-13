import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { CreateMessageDto, QueryMessageDto } from './message.dto';

@Controller('/blog/talkBoard')
export class TalkController {

  @Get('/getInfo')
  findAll(@Query() query: QueryMessageDto) {
    console.log({ query });
    return 'called getInfo';
  }

  @Post('/addInfo')
  create(@Body() createCatDto: CreateMessageDto) {
    console.log({ createCatDto });
    return 'called addInfo';
  }

}
