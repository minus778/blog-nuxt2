FROM nginx
#将项目下的nginx配置文件放在nginx子配置文件夹目录下
COPY ./nginx/blog-nuxt2.conf /etc/nginx/conf.d/
COPY ./nginx/gzip.conf /etc/nginx/conf.d/
# node服务器
FROM node:16.14.2
LABEL name="blog-nuxt2"
LABEL version="latest"
RUN mkdir -p /usr/src
COPY . /usr/src
WORKDIR /usr/src
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm","start"]