const server = require('pushstate-server');
const fs = require('fs');
const https = require('https'); // 引入 https 模块

// 读取证书文件
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/canyyang.xyz/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/canyyang.xyz/fullchain.pem')
};

// 使用 https 创建服务器
https.createServer(options, (req, res) => {
  server.serve(req, res, { directory: './dist' });
}).listen(7002, () => {
  console.log('Server running on https://your-domain.com:7002');
});