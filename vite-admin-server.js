const server = require('pushstate-server')
const https = require('https')
const fs = require('fs')

// 读取证书文件
const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/canyyang.xyz/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/canyyang.xyz/fullchain.pem')
}

// 启动 https 服务
const app = server.start({
  port: 7002,
  directory: './dist'
})

https.createServer(options, app).listen(7002, () => {
  console.log('Server running at https://canyyang.xyz:7002')
})