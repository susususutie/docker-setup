# 使用官方 Node.js 基础镜像
FROM node:lts-alpine

# 设置工作目录
WORKDIR /usr/src/app

# 将 package.json 和 package-lock.json 复制到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 将项目文件复制到工作目录
COPY . .

# 暴露容器的 3000 端口（根据你的服务配置，这个端口可能需要更改）
EXPOSE 3000

# CMD node index.js
# 启动服务
CMD ["node", "server.js"]