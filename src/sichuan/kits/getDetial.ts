var request = require('request');
var rp = require('request-promise');
const fs = require('fs')

var UrlListFile = './urllist.txt';

const list = []

const getOption = (index: number) => {
  const url = 'https://www.sczwfw.gov.cn/cns-bmfw-websdt/rest/cnspublic/scwebsitecaseinfoaction/getCaseInfoDeatil'
  const requestData = { "token": "", "params": { "caseguid": list[index] } }

  const option = {
    url: url,//请求路径
    method: "POST",//请求方式，默认为get
    headers: {//设置请求头
      "content-type": "application/json",
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    },
    body: JSON.stringify(requestData)//post参数字符串
  }

  return option
}


/* 获取某页数据 */
const getDetil = async () => {
  for (let i = 0; i < list.length; i++) {
    await rp(getOption(i)).then(async (parsedBody) => {
      const obj = JSON.parse(parsedBody)
      if (obj.status.code == 1) {
        const custom = obj.custom
        fs.appendFileSync('./咨询标题.txt', custom.rqsttitle + '\n')
        const str = custom.answercontent?.replaceAll('\n', '').replaceAll('\r', '').replaceAll(' ', '')
        fs.appendFileSync('./咨询内容答复.txt', (str || '空') + '\n')
        fs.appendFileSync('./答复单位.txt', custom.answerou + '\n')
        fs.appendFileSync('./公开时间.txt', custom.finishtime + '\n')
      }
    })
  }
}

const run = async () => {
  try {
    const data = fs.readFileSync(UrlListFile, { encoding: 'utf8', flag: 'r' });
    const array = data.toString().split('\n')
    array.forEach((item) => {
      if (item) {
        list.push(item.split('cguid=')[1])
      }
    })
    await getDetil()
    return Promise.resolve()
  } catch (error) {
    return Promise.reject()
  }
}

export default run
