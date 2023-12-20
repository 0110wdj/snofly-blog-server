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
      await clearEffect()
      console.log('complete clearEffect');
      const data = await getUrlList(+range.start, +range.end)
      console.log('complete getUrlList');
      const array = data.toString().split('\n').filter(i => i)
      await getDetial(array)
      console.log('complete getDetial');
      const res = await getZipStream(response)
      return res;
    } catch {
      return 'api error'
    } finally {
    }
  }

  clear() {
    clearEffect()
    return '清理完成'
  }
}
