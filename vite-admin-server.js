const server = require('pushstate-server')

server.start({
  port: 7002,
  directory: './dist'
})
