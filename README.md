# Docker Setup

Docker 练习仓库

## 00-node-server

原生 node server 示例, `corepack pnpm i`安装依赖，`corepack pnpm dev`启动开发服务，监听`server.js`文件更改，`corepack pnpm start`启动服务。打开浏览器或使用 curl 测试服务：

```bash
curl http://127.0.0.1:3000/api/users
# [{"id":1,"name":"小明","age":23},{"id":2,"name":"小红","age":19}]
curl -X POST http://127.0.0.1:3000/api/users
# [{"id":1,"name":"小明","age":24},{"id":2,"name":"小红","age":19}]
```
