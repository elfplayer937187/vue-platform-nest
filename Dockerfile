# 拉取镜像
FROM node:20-alpine AS builder

# 设置工作路径
WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制源码
COPY . .

# 编译并清理 dev 依赖（减小生产镜像体积）
RUN npm run build && npm prune --production

# ========================================
# Stage 2: 生产运行阶段
# ========================================
FROM node:20-alpine AS runner

WORKDIR /app

# 只复制运行时需要的文件
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# 创建上传目录
RUN mkdir -p uploads

# 暴露端口
EXPOSE 10086

# 启动
CMD ["node", "dist/main.js"]