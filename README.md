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

## 01-node-server-image

简单的 docker image 示例.

在`01-node-server-image`文件夹下, 执行:

```bash
docker build -t my-image-test:latest .
```

根据当前 `Dockerfile`打包镜像, 其中`my-image-test`为指定的镜像名称, `:`后的 `latest` 为镜像 tag, 可以不输入, 默认为 `latest`. 打包完成后执行`docker image ls`查看打包好的镜像列表, 里面就有`my-image-test`. 因为基于`alpine linux`的基础镜像, 可以发现该自定义镜像体积很小, 只有不到 80MB.

```bash
docker run -d --name my-container-test -p 80:3000 my-image-test

curl http://localhost
# Hello World
```

由`my-image-test`镜像生成一个容器, 命名为`my-container-test`, 并将主机 80 端口映射到容器 3000 端口上, 因为镜像中 node 服务跑在 3000 端口. 然后打开`http://localhost/`即可访问容器的 node 服务.


## 02-node-server-npm

使用`node:lts-alpine`作为基础镜像构建, 将代码COPY进镜像里.