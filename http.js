/** 模块引入 */
const mysql = require('mysql');
const http = require("http");
const url = require("url");
/** 配置信息：监听端口、token、mysql */
const port = 9527;
const TOKEN = 'tokendiyhiahiahiasoeasy';
const connection = mysql.createConnection({
    host: '47.97.71.176',
    user: 'snofly',
    password: 'snofly0110',
    database: 'blog'
});

/** 生成 UUID */
function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

/** 处理请求信息 */
const server = http.createServer((request, response) => {
    try {
        const requestUrl = request.url.split('?')[0];
        const method = request.method;
        /** 获取留言板信息 */
        if (requestUrl === '/blog/talkBoard/getInfo') {
            if (method !== 'GET') {
                response.end("method error");
            } else {
                const { token } = url.parse(request.url, true).query;
                if (token !== TOKEN) {
                    response.end("token error");
                } else {
                    const resultObj = {
                        code: 1,
                        body: [],
                        errMsg: '',
                    };
                    try {
                        connection.query('SELECT * From talk_board ORDER BY create_at DESC Limit 5', (error, results) => {
                            if (error) throw error;
                            resultObj.body = results;
                            response.writeHead(200, 'ok', {
                                "Access-Control-Allow-Origin": "*",
                                'Content-Type': 'application/json; charset = utf8'
                            })
                            response.end(JSON.stringify(resultObj));
                        });
                    } catch (error) {
                        console.log('some error in /blog/talkBoard/getInfo');
                    }
                }
            }
        }
        /** 插入文本 */
        else if (requestUrl === '/blog/talkBoard/addInfo') {
            if (method !== 'POST') {
                response.end("method error");
            } else {
                request.on('data', (postData) => {
                    /** 传入参数 */
                    const info = JSON.parse(postData.toString());
                    if (info.token !== TOKEN) {
                        response.end("token error");
                    } else {
                        const resultObj = {
                            code: 1,
                            body: true,
                            errMsg: '',
                        };
                        try {
                            const reg = /and|select|insert|delete|update|or/;
                            if (info.name.match(reg) || info.message.match(reg)) {
                                resultObj.body = false;
                                response.end(JSON.stringify(resultObj));
                                return;
                            }
                            connection.query('INSERT INTO talk_board(id,name,message,create_at) VALUES(?,?,?,?)',
                                [uuid(), info.name, info.message, new Date()],
                                function (error, results) {
                                    if (error) {
                                        resultObj.body = false;
                                        resultObj.errMsg = 'sql执行异常';
                                    };
                                    response.writeHead(200, 'ok', {
                                        "Access-Control-Allow-Origin": "*",
                                        'Content-Type': 'application/json; charset = utf8'
                                    })
                                    response.end(JSON.stringify(resultObj));
                                });
                        } catch (error) {
                            console.log('some error in /blog/talkBoard/addInfo');
                        }
                    }
                });
            }
        } else {
            response.end("api not found");
        }
    } catch (error) {
        console.log(new Date() + ': something error');
    }
});

server.listen(port, (error) => {
    if (error) {
        console.log('error happend at listen');
    }
    console.log(`server is running at port ${port}`);
});
