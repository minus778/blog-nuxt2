# FROM nginx
# #将项目下的nginx配置文件放在nginx子配置文件夹目录下
# COPY ./nginx/blog-nuxt2.conf /etc/nginx/conf.d/
# COPY ./nginx/gzip.conf /etc/nginx/conf.d/
#node服务器
FROM node:16
LABEL name="blog-nuxt2"
LABEL version="latest"
RUN mkdir -p /usr/src
COPY ./.nuxt /usr/src
COPY ./static /usr/src
COPY ./nuxt.config.js /usr/src
COPY ./package.json /usr/src
WORKDIR /usr/src
RUN npm install
EXPOSE 3000
CMD ["npm","start"]