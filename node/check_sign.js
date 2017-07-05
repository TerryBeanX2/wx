const sign = require('./sign.js');

// console.log(sign('kgt8ON7yVITDhtdwci0qecUJXGm-N1ELtryr-spQlM4G5PMCEM0AD7PaplqDQuIqPBe-UZYdJWXrYWMeRzCOTQ', 'http://172.16.218.67:8888/article/:58eee565a92d341e48cfe7fc'));
/*
 *something like this
 *{
 *  jsapi_ticket: 'jsapi_ticket',
 *  nonceStr: '82zklqj7ycoywrk',
 *  timestamp: '1415171822',
 *  url: 'http://example.com',
 *  signature: '1316ed92e0827786cfda3ae355f33760c4f70c1f'
 *}
 */
let jsapi_ticket = '';
const express = require('express');
const app = express();
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.get('/getWxInfo',function (req,res) {
    console.log(req.query)
    const data = sign(jsapi_ticket,req.query.url);
    res.send(data);
});
app.listen(80);



function refresh_api_ticket() {
    const qs = require('querystring');
    const data = {
        appid: 'wx09f6fa083bce803d',
        secret: '44fd91eb0670e54eb5913f6a5f9f306d',
        grant_type:'client_credential'
    };
    const content = qs.stringify(data);//这是需要提交的数据

    const https = require('https');
    https.get(`https://api.weixin.qq.com/cgi-bin/token?${content}`, (res) => {
        res.on('data', (d) => {
            // process.stdout.write(d);
            const access_token =  JSON.parse(d).access_token;
            //用拿到的token请求jsapi_ticket
            https.get(`https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=${access_token}&type=jsapi`, (res) => {
                res.on('data', (f) => {
                    // process.stdout.write(f);
                    jsapi_ticket = JSON.parse(f).ticket;
                    console.log(jsapi_ticket)
                })
            }).on('error', (e) => {
                console.error(e);
            });
        });
    }).on('error', (e) => {
        console.error(e);
    });
}

refresh_api_ticket();
setInterval(refresh_api_ticket,7200*1000);