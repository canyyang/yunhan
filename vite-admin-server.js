const server = require('pushstate-server');
// const fs = require('fs');

// 读取证书文件
// const options = {
//   key: fs.readFileSync('/etc/letsencrypt/live/canyyang.xyz/privkey.pem'),
//   cert: fs.readFileSync('/etc/letsencrypt/live/canyyang.xyz/fullchain.pem')
// };

server.start({
  port: 7002,
  directory: './dist'
})

