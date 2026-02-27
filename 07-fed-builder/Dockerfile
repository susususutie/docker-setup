# 使用Node.js 22作为基础镜像
FROM node:22

# 安装必要的系统依赖（Git、curl等）
RUN apt-get update && \
    apt-get install -y --no-install-recommends git curl ca-certificates && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 创建非root用户（提高安全性）
RUN useradd -m -u 1001 gitlab-runner

# 设置环境变量
ENV TZ=Asia/Shanghai
ENV COREPACK_NPM_REGISTRY=https://mirrors.tencent.com/npm/
ENV npm_config_registry=https://mirrors.tencent.com/npm/
ENV HOME=/home/gitlab-runner

# 启用corepack（需要root权限）
RUN corepack enable

# 设置pnpm版本为10.12.1
RUN corepack prepare pnpm@10.12.1 --activate

# 切换到非root用户
USER gitlab-runner

# 验证pnpm版本
RUN pnpm --version

# 设置工作目录
WORKDIR /home/gitlab-runner/builds

# 配置Git（可选，根据需要调整）
RUN git config --global --add safe.directory /home/gitlab-runner/builds

# 确保构建目录可写
USER root
RUN chown -R gitlab-runner:gitlab-runner /home/gitlab-runner/builds
USER gitlab-runner

# GitLab Runner默认使用entrypoint来执行作业，所以不需要CMD