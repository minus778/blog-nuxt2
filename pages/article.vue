<template>
    <div class="article">
        <div class="articleContent">
            <div class="article-content">
                <h1>{{ articleContent.title }}</h1>
                <div class="top">
                    <div class="item">
                        <span class="left">Author:</span>
                        <span class="right">{{ articleContent.author }}</span>
                    </div>
                    <div class="item">
                        <span class="left">Date:</span>
                        <span class="right">{{ date }}</span>
                    </div>
                    <div class="item">
                        <span class="left">Category:</span>
                        <span class="right link" @click="toCategory(category)">{{ category.name }}</span>
                    </div>
                    <div class="item tags">
                        <span class="left">Tags:</span>
                        <div v-for="(item, i) in tags" :key="item.id">
                            <span class="right link" @click="toTag(item)">{{ item.name }}</span>
                            <span v-if="i != tags.length - 1" style="color:gray">|&nbsp;</span>
                        </div>

                    </div>
                    <div class="item">
                        <span class="left">Read:</span>
                        <span class="right">{{ readNum }}</span>
                    </div>
                    <div class="item">
                        <span class="left">Like:</span>
                        <span class="right">{{ likeNum }}</span>
                    </div>
                </div>

                <div class="content markdown-body" v-html="articleContent.content">
                </div>
            </div>
            <Comment :commentList="commentList" @refreshLength="refreshLength" :length="length"
                :articleId="parseInt($route.query.articleId)"></Comment>
        </div>

        <div :class="{ bottom: isShow, hidden: !isShow }">
            <div class="bottom-content">
                <span class="article-name">{{ articleContent.title }}</span>
                <div class="icons">
                    <div>
                        <i class="iconfont icon-yanjing"></i>
                        <span>{{ readNum }}</span>
                    </div>
                    <div>
                        <i class="iconfont icon-pinglun"></i>
                        <span>{{ length }}</span>
                    </div>
                    <div @click="clickLike">
                        <i class="iconfont icon-aixin" v-if="!isLike"></i>
                        <i class="iconfont icon-aixin1" v-else style="color:red"></i>
                        <span>{{ likeNum }}</span>
                    </div>
                    <div @click="isSun = !isSun">
                        <i class="iconfont icon-taiyang-copy" v-if="isSun"></i>
                        <i class="iconfont icon-yueliang" v-else></i>
                        <span class="sun">skin</span>
                    </div>
                    <div @click="toTop">
                        <i class="iconfont icon-xiangshang"></i>
                    </div>
                </div>
            </div>
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
    name: 'articleContent',
    data() {
        return {
            scroll: 0,
            isShow: false,
            isSun: true,
            isLike: false
        }
    },
    async asyncData({ app, route }) {
        const id = route.query.articleId
        //获取文章内容
        let articles = await app.$getArticleContent(id)
        //获取文章对应评论
        let comment = await app.$getComment(id)
        if (articles.code === 200 && comment.code === 200) {
            return {
                articleContent: articles.data,
                commentList: comment.data,
                length: comment.data.length,
                likeNum: articles.data.likes,
                readNum: articles.data.readNum
            }
        } else {
            console.error(articles.msg, comment.msg)
        }
    },
    mounted() {
        //监听页面滚动事件
        window.addEventListener('scroll', () => {
            if (window.scrollY > this.scroll) {
                this.isShow = true
            } else {
                this.isShow = false
            }
            this.scroll = window.scrollY
        })
        //进入文章时判断文章是否已读或喜欢
        this.checkStorage()
    },
    methods: {
        refreshLength() {
            this.length += 1
        },
        toCategory(item) {
            this.$router.push({
                path: `/categories/${item.name}`,
                query: { id: item.id }
            })
        },
        toTag(item) {
            this.$router.push({
                path: `/tags/${item.name}`,
                query: { id: item.id }
            })
        },
        toTop() {
            //带过渡效果回到顶部
            let top = document.documentElement.scrollTop || document.body.scrollTop
            // 实现滚动效果
            const timeTop = setInterval(() => {
                document.body.scrollTop = document.documentElement.scrollTop = top -= 50
                if (top <= 0) {
                    clearInterval(timeTop)
                }
            }, 10)
        },
        //进入文章时判断文章是否已读或喜欢
        async checkStorage() {
            const id = this.$route.query.articleId
            let readList = JSON.parse(localStorage.getItem('readList')) || []
            let likeList = JSON.parse(localStorage.getItem('likeList')) || []
            //判断是否已读
            if (!readList.includes(id)) {
                //将该文章设为已读并将文章id存入localStorage
                let read = await this.$addReadNum(id)
                if (read.code === 200) {
                    //文章已读加一成功
                    readList.push(id)
                    localStorage.setItem('readList', JSON.stringify(readList))
                    this.readNum++
                }
            }
            //判断是否喜欢
            if (likeList.includes(id)) {
                this.isLike = true
            }
        },
        //点击喜欢
        async clickLike() {
            const id = this.$route.query.articleId
            let likeList = JSON.parse(localStorage.getItem('likeList')) || []
            //判断是否喜欢
            if (!likeList.includes(id)) {
                //将该文章设为喜欢并将文章id存入localStorage
                let like = await this.$addLikeNum(id)
                if (like.code === 200) {
                    //文章喜欢加一成功
                    likeList.push(id)
                    localStorage.setItem('likeList', JSON.stringify(likeList))
                    this.isLike = true
                    this.likeNum++
                }
            } else {
                console.log('已经喜欢过了~');
            }
        }
    },
    computed: {
        categoryList() {
            return this.$store.state.categoryList
        },
        tagList() {
            return this.$store.state.tagList
        },
        category() {
            let temp = this.categoryList.find(item => {
                return item.id === this.articleContent.categoryId
            })
            return temp
        },
        tags() {
            let taglist = this.articleContent.tagId.split('、')
            let temp = this.tagList.filter(item => {
                return taglist.includes(String(item.id))
            })
            return temp
        },
        date() {
            return this.$typeTime(this.articleContent.date)
        }
    }
}
</script>

<style scoped lang='scss'>
.article {
    width: 100%;

    .articleContent {
        @include commonSizeArticle;

        .article-content {
            padding: 0 40px;

            .top {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                margin: 10px 0;

                span {
                    font-size: 16px;
                }


                .item {
                    margin-right: 10px;

                    .right {
                        color: $textColor;
                    }

                    .link {
                        cursor: pointer;

                        &:hover {
                            color: $linkText;
                        }
                    }

                    .left {
                        color: gray;
                    }
                }

                .tags {
                    display: flex;
                    align-items: center;
                }
            }

            .content {
                margin: 40px 0 60px 0;
                padding: 20px;
                font-size: 15px;
                box-shadow: 1px 1px 12px $comment-border;

                ul,
                li {
                    list-style: circle;
                }
            }
        }
    }

    .hidden,
    .bottom {
        position: fixed;
        width: 100%;
        height: 60px;
        line-height: 60px;
        box-shadow: 0 -1px 12px $comment-border;
        z-index: 100;
        background-color: white;
        transition: bottom 0.3s linear;

        .bottom-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 70%;
            margin: 0 auto;
            padding: 0 40px;

            @media (min-width: 992px) and (max-width: 1200px) {
                width: 80%;
            }

            @media (min-width: 1200px) {
                width: 70%;
            }

            .icons {
                display: flex;
                align-items: center;
                justify-content: space-evenly;
                flex-wrap: nowrap;

                div {
                    margin-right: 20px;
                    position: relative;

                    .sun {
                        display: none;
                    }

                    span {
                        display: inline-block;
                        font-size: 13px;
                        position: absolute;
                        top: -14px;
                    }

                    i {
                        font-size: 18px;

                        &:hover {
                            color: $textColor;
                        }
                    }

                    &:nth-child(1),
                    &:nth-child(4) {
                        i {
                            font-size: 20px;
                        }
                    }

                    &:last-child {
                        transition: all 0.2s linear;
                        color: gray;

                        &:hover {
                            transform: translateY(-7px);
                            color: $textColor;
                        }

                        i {
                            font-size: 34px;
                            font-weight: 600;
                        }

                    }

                    &:nth-child(n+2) {
                        cursor: pointer;
                    }
                }
            }

            .article-name {
                color: gray;
                font-weight: 900;
                font-size: 17px;
            }
        }
    }

    .hidden {
        bottom: -60px;
    }

    .bottom {
        bottom: 0px;
    }

    @media (max-width: 992px) {

        .bottom,
        .hidden {
            width: 80%;
            left: 10%;
            box-shadow: 1px 1px 12px $comment-border;
            height: auto;
            line-height: normal;


            .article-name {
                display: none;
            }

            .bottom-content {
                width: 100%;
                display: flex;
                justify-content: space-evenly;
                align-items: center;
                padding: 10px 0;

                .icons {
                    width: 100%;

                    div {
                        height: 100%;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: space-evenly;
                        margin-right: 0;

                        .sun {
                            display: inline-block;
                        }

                        span {
                            position: static;
                        }
                    }
                }
            }

        }

        .bottom {
            bottom: 20px;
        }
    }
}

:deep(#footer) {
    margin-bottom: 60px;
}
</style>