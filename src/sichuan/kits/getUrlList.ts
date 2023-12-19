var rp = require('request-promise');
var fs = require('fs');

const getOption = (page: number) => {
  const url = 'https://www.sczwfw.gov.cn/cns-bmfw-websdt/rest/cnspublic/scwebsitecaseinfoaction/getInteractCaseInfoListByCondition'
  const requestData = { "pageSize": 20, "currentPageIndex": page, "title": "", "rqstType": "10", "webrqsttime": "", "areaCode": "510000000000" }
  const option = {
    url: url,//请求路径
    method: "POST",//请求方式，默认为get
    headers: {//设置请求头
      "content-type": "application/json",
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    },
    body: JSON.stringify(requestData) //post参数字符串
  }
  return option
}

/* 获取某页数据 */
const getUrlList = async (start = 1, end = 3) => {
  try {
    for (let i = start; i <= end; i++) {
      await rp(getOption(i)).then((parsedBody) => {
        const obj = JSON.parse(parsedBody)
        if (obj.status.code == 1) {
          obj.custom.infoList.forEach((item) => {
            fs.appendFileSync("./urlList.txt", item.handleurl + '\n')
          });
        }
      })
    }
    return Promise.resolve()
  } catch (error) {
    console.error(error);
    return Promise.reject()
  }
}

export default getUrlList
