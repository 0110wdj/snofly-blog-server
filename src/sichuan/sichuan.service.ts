import { Injectable } from '@nestjs/common';
import { QueryMessageDto } from './dto/message.dto';
import getUrlList from './kits/getUrlList'
import getDetial from './kits/getDetial'
import clearEffect from './kits/clearEffect'
import getZipStream from './kits/getZipStream'
import { Response } from 'express';

@Injectable()
export class SichuanService {
  constructor() { }

  async downLoad(range: QueryMessageDto, response: Response) {
    try {
      await getUrlList(+range.start, +range.end)
      console.log('complete getUrlList');
      await getDetial()
      console.log('complete getDetial');
      const res = await getZipStream(response)
      return res;
    } catch {
      return 'api error'
    } finally {
      // 可以由前端完成主动清理，这里自动清理
      setTimeout(() => {
        clearEffect()
      }, 60000);
    }
  }


  clear() {
    clearEffect()
    return '清理完成'
  }
}
