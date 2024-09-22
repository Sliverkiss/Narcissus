# 使用官方Node.js 22镜像作为基础镜像
FROM node:22

# 创建并设置工作目录
WORKDIR /funmika

# 复制package.json和package-lock.json到工作目录
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制所有项目文件到工作目录
COPY . .

# 暴露应用程序运行的端口
EXPOSE 9886

# 启动应用程序
CMD ["node", "index.js"]
