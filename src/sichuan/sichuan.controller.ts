import { Controller, Get, Query, Res } from '@nestjs/common';
import { QueryMessageDto } from './dto/message.dto';
import { SichuanService } from './sichuan.service';
import { Response } from 'express';

@Controller('/crawler/sichuan')
export class SichuanController {
  constructor(private readonly SichuanService: SichuanService) { }

  @Get('/downLoad')
  async downLoad(@Query() query: QueryMessageDto, @Res() response: Response): Promise<any> {
    return this.SichuanService.downLoad(query, response)
  }
  @Get('/clear')
  clear() {
    return this.SichuanService.clear()
  }
}
