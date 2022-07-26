export default ({ $axios }) => {
    //请求拦截
    $axios.onRequest(config => {
        return config
    })
    //响应拦截
    $axios.onResponse(response => {
        return response
    })
    //错误响应
    $axios.onError(error => {
        console.log('响应异常：', error.response.status)
        return Promise.reject('响应异常')
    })
}