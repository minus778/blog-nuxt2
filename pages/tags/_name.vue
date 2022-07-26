<template>
    <div>
        <ArticleList name="Tags" :tag="$route.params.name" :articleList="articleList"></ArticleList>
    </div>
</template>

<script>
export default {
    name: "TagArticleList",
    async asyncData({ app, route }) {
        let res = await app.$getArticleList('tagId', route.query.id)
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