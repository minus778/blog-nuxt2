# blog-nuxt2
基于nuxt2搭建的个人博客前台网站
PART1

关于博客项目：
项目node版本：v16.14.2

前台样式纯手写，偏简洁风，没有使用样式组件库，基于nuxt2开发，原本计划用nuxt3，但是nuxt3还处于rc版本，不可避免的会遇到很多坑，最后还是决定用稳定的nuxt2，前台博客少不了做响应式，这里我用的pxtorem+rem+vw+媒体查询实现响应式及移动端适配
后台管理系统基于vite3+vue3+ts开发，样式组件库使用element-plus，编辑器用的mavon-editor，个人感觉很好用，首页数据可视化用的echarts
后端用的express4版本，数据库使用mysql，使用jsonwebtoken实现token鉴权，上传图片用的busboy库
PART2

优化方面：

前台、后台、后端都结合nginx服务器开启http2、开启gzip、缓存静态资源（图片、js/css文件）进行优化
前台项目由于使用的nuxt服务端渲染框架，本身的首屏加载速度就很快
后台管理系统主要使用vite配置gzip、压缩图片、按需引入第三方依赖、路由懒加载等提升首屏加载速度
PART3

部署方面：

前台+后台+后端都使用的github-action实现自动部署，使用docker启动三个容器分别启动三个项目独立运行，使用nginx反向代理、开启gzip、开启https、开启http2、访问静态资源、静态资源缓存等
