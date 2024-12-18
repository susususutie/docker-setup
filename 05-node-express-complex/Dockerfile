# 指定基础镜像，这是构建新镜像的起点
FROM node:lts-alpine

# 设置工作目录，即容器内部的当前目录
WORKDIR /app

# 将 package.json 和 package-lock.json 复制到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 将项目文件复制到工作目录
COPY . .

# 暴露容器的 3000 端口（根据你的服务配置，这个端口可能需要更改）
EXPOSE 3000

# 容器启动时执行的命令，是容器的默认执行命令
CMD ["node", "app.js"]

