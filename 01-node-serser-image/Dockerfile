# node-server

# 使用官方的Alpine Linux基础镜像
FROM alpine:latest

# 设置环境变量，比如设置时区为中国上海
ENV NODE_ENV=production
ENV TZ=Asia/Shanghai

# 安装必要的包和Node.js
RUN apk update && \
    apk upgrade && \
    apk add --no-cache nodejs npm

# 创建应用的目录
WORKDIR /usr/src/app

# 创建package.json文件
RUN echo '{ \
  "name": "my-node-app", \
  "version": "1.0.0", \
  "description": "A simple Node.js app", \
  "main": "server.js", \
  "scripts": { \
    "start": "node server.js" \
  }, \
  "dependencies": {} \
}' > package.json && \
  echo 'const http = require("http"); \
const server = http.createServer((req, res) => { \
  res.statusCode = 200; \
  res.setHeader("Content-Type", "text/plain"); \
  res.end("Hello World"); \
}); \
server.listen(3000, () => { \
  console.log("server start at port 3000"); \
})' > server.js && \
  npm install

# 暴露容器的端口，以便外部可以访问
EXPOSE 3000

# 启动Node.js服务
CMD ["node", "server.js"]