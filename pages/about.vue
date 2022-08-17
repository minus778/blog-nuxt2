<template>
    <div class="about">
        <div class="content markdown-body" v-html="content.htmlContent">
        </div>
    </div>
</template>

<script>
// 高亮显示md内容样式
import "@/assets/css/github-markdown.css"
//引入highlight代码高亮文件
import "@/assets/css/atom-one-light.min.css"
import "@/assets/js/highlight.js"
export default {
    name: 'about',
    async asyncData({ app }) {
        let res = await app.$getAbout()
        if (res.code === 200) {
            return {
                content: res.data
            }
        } else {
            console.error(res.msg)
        }
    }
}
</script>

<style scoped lang='scss'>
.about {
    @include commonSizeArticle;

    .content {
        margin: 50px;
    }
}
</style>