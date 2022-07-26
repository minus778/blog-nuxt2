<template>
    <div>
        <ArticleList name="Categories" :tag="$route.params.name" :articleList="articleList"></ArticleList>
    </div>
</template>

<script>
export default {
    name: "CategoryArticleList",
    async asyncData({ app, route }) {
        let res = await app.$getArticleList('categoryId', route.query.id)
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