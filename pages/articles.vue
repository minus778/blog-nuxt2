<template>
    <div>
        <ArticleList :articleList="articleList"></ArticleList>
    </div>
</template>

<script>
export default {
    name: "articles",
    async asyncData({ app, route }) {
        let res = await app.$getAllArticleList()
        if (res.code === 200) {
            return {
                articleList: res.data
            }
        } else {
            console.error(res.msg)
        }
    }
}
</script>

<style scoped lang='scss'>
</style>