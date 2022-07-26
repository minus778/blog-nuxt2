//格式化时间
export default (context, inject) => {
    let typeTimes = function (time) {
        let date = new Date(time)
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() + '-';
        let H = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        let MS = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
        return Y + M + D + H + MS
    }
    let typeTime = function (time) {
        let date = new Date(time)
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate();
        return Y + M + D
    }
    // 格式化时间：年-月-日
    inject('typeTime', typeTime)
    //格式化时间：年-月-日-时:分
    inject('typeTimes', typeTimes)
}