# 指定基础镜像，这是构建新镜像的起点
FROM node:lts-alpine

# 设置工作目录，即容器内部的当前目录
WORKDIR /app

# 这行将当前目录（.）下的所有文件复制到容器的 /app 目录
COPY . /app

# 类似于 COPY，但还可以处理 tar 压缩文件
# ADD archive.tar.gz /app

# 设置环境变量, 等号两侧不能有空格
ENV COREPACK_NPM_REGISTRY=https://mirrors.tencent.com/npm/
ENV npm_config_registry=https://mirrors.tencent.com/npm/

# 在构建镜像时执行命令
RUN corepack enable && \
    pnpm install

# 暴露容器的 3000 端口（根据你的服务配置，这个端口可能需要更改）
EXPOSE 3000

# 容器启动时执行的命令，是容器的默认执行命令
CMD ["node", "server.js"]

