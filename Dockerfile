# FROM nginx
# #将项目下的nginx配置文件放在nginx子配置文件夹目录下
# COPY ./nginx/blog-nuxt2.conf /etc/nginx/conf.d/
# COPY ./nginx/gzip.conf /etc/nginx/conf.d/
# node服务器
FROM node:16.14.2
LABEL name="blog-nuxt2"
LABEL version="latest"
RUN mkdir -p /usr/src
COPY . /usr/src
# 安装nginx(由于action使用的ubuntu系统，所以安装的镜像内部也是ubuntu镜像，安装命令为apt而不是yum)
RUN apt install nginx
COPY ./nginx/blog-nuxt2.conf /etc/nginx/conf.d/
COPY ./nginx/gzip.conf /etc/nginx/conf.d/
WORKDIR /usr/src
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm","start"]