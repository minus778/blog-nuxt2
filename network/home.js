export default ({ $axios }, inject) => {
    //使用inject将axios请求函数同时挂载到客户端和服务端
    //在客户端使用this.$方法名()，服务端使用app.$方法名()

    // 获取网站信息
    inject('getBlogMes', () => $axios.$get('/getBlogMes'))

    // //获取网站首页信息
    // inject('getHome', () => $axios.$get('/getHome'))
}