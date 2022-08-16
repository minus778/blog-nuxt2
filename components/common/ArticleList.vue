<template>
    <div class="article">
        <h2 v-if="name != ''">-&nbsp;{{ name }}&nbsp;·&nbsp;{{ tag }}&nbsp;-</h2>
        <div class="articleList">
            <div v-for="(item, i) in article" :key="i" class="time-article">
                <!-- 时间标题 -->
                <h3>{{ item[0].date.split('-')[0] }}</h3>
                <!-- 当前时间分类下的文章列表 -->
                <div class="article-all">
                    <div v-for="child in item" :key="child.id" class="article-one">
                        <div class="text" @click="toArticle(child.id)">
                            <span>{{ child.title }}</span>
                            <div class="underline"></div>
                        </div>
                        <span class="time">{{ child.date }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ArticleList',
    data() {
        return {
            article: []
        }
    },
    props: {
        name: {
            type: String,
            default: ''
        },
        tag: {
            type: String,
            default: ""
        },
        articleList: {
            type: Array,
            default: () => [],
            required: true
        }
    },
    mounted() {
        this.article = this.articles()
    },
    methods: {
        getTime(list) {
            list.forEach(item => {
                //根据总毫秒将文章排序
                item.sort(this.compare('date'))
                //将总毫秒转换为正常时间格式
                item.forEach(itemss => {
                    if (itemss.date) {
                        itemss.date = this.$typeTime(itemss.date)
                    }
                })
            })
            return list
        },
        //将数组以数组中的某个元素排序
        compare(property) {
            return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value2 - value1;
            }
        },
        //跳转到文章详情页
        toArticle(id) {
            this.$router.push({
                path: '/article',
                query: { articleId: id }
            })
        },
        //这个方法原本是作为computed计算属性用的，但是计算属性服务端和客户端都会执行一次，最终以客户端的为最终结果，由于执行了两次所以结果会出问题，就只能变为method方法在mounted中调用，以此只在客户端调用一次
        //将文章列表分类并排序
        articles() {
            let yearList = []
            this.articleList.forEach(item => {
                let year = new Date(item.date).getFullYear()
                yearList.push(year)
            })
            //所有文章所包含的时间数组（不重复）
            yearList = Array.from(new Set(yearList)).sort().reverse()
            let article = []
            //将所有文章按不同时间存放到单独的数组中（整体是二维数组格式）
            for (let i = 0; i < yearList.length; i++) {
                let list = this.articleList.filter(item => {
                    let year = new Date(item.date).getFullYear()
                    //隐藏的文章不展示
                    return yearList[i] === year && item.isshow === 'true'
                })
                article.push(list)
            }
            //文章按时间先后排序+时间格式化
            let result = this.getTime(article)
            return result
        }
    }
}
</script>

<style scoped lang='scss'>
.article {
    @include commonSizeTag;

    .articleList {
        margin-top: 50px;

        .time-article {
            .article-all {
                padding: 10px 0 10px 20px;

                .article-one {
                    margin: 15px 0 15px 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    .text {
                        @include textNowrap;

                        .underline {
                            width: 0px;
                            height: 2px;
                            background-color: $textColor;
                            transition: width 0.2s linear;
                        }

                        &:hover {
                            .underline {
                                width: 100%;
                            }
                        }
                    }

                    span {

                        &:nth-child(1) {
                            cursor: pointer;
                            font-size: 15px;

                            &:hover {
                                color: $textColor;
                            }
                        }

                        &:nth-child(2) {
                            @media (max-width: 768px) {
                                display: none;
                            }

                            color: gray;
                            font-size: 14px;
                        }
                    }
                }
            }

        }
    }
}
</style>