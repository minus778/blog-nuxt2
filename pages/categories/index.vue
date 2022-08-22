<template>
    <div class="categories">
        <h2>-&nbsp;Categories&nbsp;-</h2>
        <!-- 利用flex实现瀑布流效果 -->
        <div class="allList">
            <div class="left">
                <template v-for="(item, i) in articleList">
                    <div v-if="i % 2 === 0" class="artilce-item">
                        <div class="title" @click="toCategoryDetail(item)">
                            <i class="iconfont icon-wj-wjj"></i>
                            <span>{{ item[0].name }}</span>
                        </div>
                        <ul class="list">
                            <template v-for="(article, index) in item">
                                <li v-if="article.title && index < 11">
                                    <span @click="toArticle(article.id)">{{ article.title }}</span>
                                </li>
                            </template>
                        </ul>
                        <!-- 超出10条隐藏 -->
                        <p v-if="item.length > 10" class="more" @click="toCategoryDetail(item)">More >></p>
                    </div>
                </template>
            </div>
            <div class="right">
                <template v-for="(item, i) in articleList">
                    <div v-if="i % 2 !== 0" class="artilce-item">
                        <div class="title" @click="toCategoryDetail(item)">
                            <i class="iconfont icon-wj-wjj"></i>
                            <span>{{ item[0].name }}</span>
                        </div>
                        <ul class="list">
                            <template v-for="(article, index) in item">
                                <li v-if="article.title && index < 11">
                                    <span @click="toArticle(article.id)">{{ article.title }}</span>
                                </li>
                            </template>
                        </ul>
                        <!-- 超出10条隐藏 -->
                        <p v-if="item.length > 10" class="more" @click="toCategoryDetail(item)">More >></p>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "categories",
    data() {
        return {
        }
    },
    methods: {
        toCategoryDetail(list) {
            this.$router.push({
                path: `/categories/${list[0].name}`,
                query: { id: list[0].id }
            })
        },
        toArticle(id) {
            this.$router.push({
                path: '/article',
                query: { articleId: id }
            })
        }
    },
    async asyncData({ app, store }) {
        //从仓库获取分类列表
        let categoryList = store.state.categoryList
        //获取所有文章列表
        let res = await app.$getAllArticleList()
        if (res.code === 200) {
            let list = []
            //将文章列表按各自的分类id划分为二维数组
            categoryList.forEach(val => {
                let typeList = []
                typeList = res.data.filter(item => {
                    return item.categoryId === val.id && item.isshow === 'true'
                })
                //将分类名及id组成的对象放在所属分类文章数组最前面
                typeList.unshift({ id: val.id, name: val.name })
                list.push(typeList)
            })
            return {
                categoryList: categoryList,
                articleList: list
            }
        } else {
            console.log('error:', res.msg);
        }
    }
}
</script>

<style scoped lang='scss'>
.categories {
    @include commonSizeArticle;

    .allList {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-left: 30px;

        .left,
        .right {
            @media (max-width: 768px) {
                width: 100%;
            }

            width: 50%;
            display: flex;
            flex-direction: column;
            margin-top: 30px;

            .artilce-item {
                margin: 20px;

                .more {
                    cursor: pointer;
                    font-size: 15px;
                    @include categoryChoose;
                }

                .title {
                    font-size: 17px;
                    font-weight: 600;
                    cursor: pointer;
                    @include categoryChoose;
                }

                .list {
                    padding: 10px 20px;

                    li {
                        margin: 10px;
                        font-size: 15px;
                        cursor: pointer;
                        @include categoryChoose;
                        @include textNowrap;
                    }
                }
            }
        }

    }
}
</style>