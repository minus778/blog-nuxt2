<template>
    <div class="comment">
        <div class="input">
            <div class="input-name">
                <input type="text" placeholder="Name" v-model="submitForm.froms">
                <input type="text" placeholder="Email" v-model="submitForm.email">
            </div>
            <div class="replyTo" v-if="submitForm.tos != ''">
                <span class="replay-name">@{{ submitForm.tos }}</span>
                <span class="delete" @click="cancleReply">×</span>
            </div>
            <div class="input-text">
                <textarea placeholder="What do you want to say..." v-model="submitForm.content"></textarea>
            </div>
            <div class="authorCode input-name" v-if="submitForm.froms === name">
                <span>输入授权码：</span>
                <input type="text" placeholder="Authorization code" v-model="submitForm.authorCode">
            </div>
            <div class="submit">
                <div class="button" @click="submit">SUBMIT</div>
                <span class="iconfont icon-chacha" :style="{ color: textcolor, fontSize: '14px' }"
                    v-if="textcolor === 'red'"></span>
                <span class="iconfont icon-gou" :style="{ color: textcolor, top: '-1px' }"
                    v-if="textcolor === 'green'"></span>
                <span :style="{ color: textcolor }">{{ text }}</span>
                <span v-if="submitForm.froms === name" class="authorTip">(是作者本人吗？需要授权码哦~)</span>
            </div>
        </div>
        <div class="comment-list">
            <div class="title">
                <span>Comment List</span>
                <span>({{ length }})</span>
            </div>
            <div class="list">
                <div class="list-item" v-for="(item, i) in parentList" :key="item.id">
                    <div class="parent">
                        <div class="namedate">
                            <div class="left">
                                <div class="avatar">
                                    <!-- 10张头像随机挑一张 -->
                                    <img :src="url + item.avatar">
                                </div>
                                <span class="name">{{ item.froms }}</span>
                                <span class="author" v-if="item.froms === name">作者</span>
                            </div>
                            <div class="right">
                                <span class="reply" @click="reply(item, item.id, i)">回复</span>
                                <span class="date">{{ item.date }}</span>
                            </div>
                        </div>
                        <div class="message">
                            <span>{{ item.content }}</span>
                        </div>
                    </div>
                    <div class="child" v-for="child in childList[i]" :key="child.id">
                        <div class="namedate">
                            <div class="left">
                                <div class="avatar">
                                    <!-- 10张头像随机挑一张 -->
                                    <img :src="url + child.avatar">
                                </div>
                                <span class="name">{{ child.froms }}</span>
                                <span class="author" v-if="child.froms === name">作者</span>
                            </div>
                            <div class="right">
                                <span class="reply" @click="reply(child, item.id, i)">回复</span>
                                <span class="date">{{ child.date }}</span>
                            </div>
                        </div>
                        <div class="message">
                            <span class="to" v-if="child.toId != item.id">@{{ child.tos }}</span>
                            <span>{{ child.content }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'Comment',
    data() {
        return {
            parentList: [],
            childList: [],
            submitForm: {
                tos: '',
                froms: '',
                email: '',
                content: '',
                date: '',
                articleId: null,
                parentId: null,
                toId: null,
                authorCode: ''
            },
            childListIndex: -1,
            text: '~认真和用心是一种态度, 感谢支持~',
            textcolor: 'gray'
        }
    },
    props: {
        commentList: {
            type: Array,
            default: () => []
        },
        articleId: {
            type: Number,
            default: null
        },
        length: {
            type: Number,
            default: 0
        }
    },
    computed: {
        name() {
            return this.$store.getters['getName']
        },
        //获取后端url
        url() {
            return this.$store.getters['getWebsiteUrl']
        },
        //获取密码
        password() {
            return this.$store.getters['getPassword']
        }
    },
    methods: {
        //提交评论
        async submit() {
            //正则验证邮箱
            const re = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
            if (!this.submitForm.froms) {
                this.text = '名字是你的第一印象哦~'
                this.textcolor = 'red'
            } else if (this.submitForm.email && !re.test(this.submitForm.email)) {
                this.text = '再检查检查邮箱格式吧~'
                this.textcolor = 'red'
            } else if (!this.submitForm.content) {
                this.text = '留下你要说的话~'
                this.textcolor = 'red'
            } else if (this.submitForm.froms === this.name && this.submitForm.authorCode != this.password) {
                this.text = '授权码有点问题，再想想~'
                this.textcolor = 'red'
            } else {
                this.submitForm.articleId = this.articleId
                this.submitForm.date = +new Date()
                //提交表单数据
                let res = await this.$submitComment(this.submitForm)
                if (res.code === 200) {
                    // //触发父组件刷新评论列表
                    // this.$emit('refresh')
                    //新增评论
                    this.addReply()
                    this.text = res.msg
                    this.textcolor = 'green'
                    setTimeout(() => {
                        this.text = '~善语结善缘，恶语伤人心~'
                        this.textcolor = 'gray'
                    }, 3000)
                }
            }
        },
        //新增评论
        //思路：新增评论后发请求获取数据库最新一条评论，最新评论则为新增的评论
        //判断最新评论是一级评论还是二级评论，一级评论就添加到一级评论列表中，二级评论通过提前获取的索引添加到二级评论数组的对应数组中
        //这样做相比于通过emit触发父组件更新整个列表数组包括排序等操作性能更好
        async addReply() {
            this.$emit('refreshLength')
            //获取最新评论
            let { data } = await this.$getLatestComment()
            data.date = this.$typeTimes(data.date)
            if (!data.parentId) {
                this.parentList.push(data)
            } else {
                if (!this.childList[this.childListIndex]) {
                    this.childList[this.childListIndex] = []
                }
                this.childList[this.childListIndex].push(data)
            }

            //重置表单数据
            this.submitForm.tos = ''
            this.submitForm.froms = ''
            this.submitForm.email = ''
            this.submitForm.content = ''
            this.submitForm.date = ''
            this.submitForm.articleId = null
            this.submitForm.parentId = null
            this.submitForm.toId = null
            //重置授权码
            this.submitForm.authorCode = ''
            this.childListIndex = -1
        },
        //点击回复按钮（item是当前评论，id为一级评论id，i为当前评论对应一级评论的索引-用于确定一级评论对应的二级评论数组）
        reply(item, id, i) {
            this.submitForm.tos = item.froms
            this.submitForm.parentId = id
            this.submitForm.toId = item.id
            this.childListIndex = i
        },
        //取消回复
        cancleReply() {
            this.submitForm.tos = ''
            this.submitForm.parentId = null
            this.submitForm.toId = null
            this.childListIndex = -1
        },
        getTime(list) {
            //根据总毫秒将评论排序
            list.sort(this.compare('date'))
            //将总毫秒转换为正常时间格式
            list.forEach(item => {
                item.date = this.$typeTimes(item.date)
            })
            return list
        },
        //将数组以数组中的某个元素排序
        compare(property) {
            return function (a, b) {
                var value1 = a[property];
                var value2 = b[property];
                return value1 - value2;
            }
        },
        //格式化评论列表
        typeCommentList() {
            //找出一级评论
            this.parentList = this.commentList.filter(item => {
                return item.parentId === null
            })
            //将一级评论按时间排序并转换时间格式
            this.parentList = this.getTime(this.parentList)
            //按排序后的一级评论的顺序将每个一级评论对应的二级评论转换为二维数组（二维数组索引号和一级评论一一对应）
            this.parentList.forEach(item => {
                let list = this.commentList.filter(child => {
                    return child.parentId === item.id
                })
                //将找出来的二级评论数组按时间排序并将时间格式化
                list = this.getTime(list)
                this.childList.push(list)
            })
        }
    },
    //注意这里不能使用created，nuxt的created会先在服务端执行然后再在客户端执行
    mounted() {
        this.typeCommentList()
    }
    // watch: {
    //     //解决提交评论不更新评论列表问题（监听父组件传递过来的评论列表的变化）
    //     commentList() {
    //         this.typeCommentList()
    //     }
    // }
}
</script>

<style scoped lang='scss'>
.comment {
    margin: 40px;

    .input {
        width: 100%;
        padding: 15px;
        border-radius: 10px;
        border: 1px solid $comment-border;

        .replyTo {
            display: inline-block;
            padding: 2px 6px;
            background-color: $textColor;
            color: white;
            border-radius: 20px;
            margin-bottom: 10px;
            font-size: 14px;

            .replay-name {
                margin-right: 1px;
            }

            .delete {
                cursor: pointer;
            }
        }

        .input-name {
            display: flex;
            justify-content: space-between;

            input {
                width: 49%;
                height: 30px;
                margin: 10px 0;
                border: none;
                border-bottom: 1px dashed $comment-border;
                padding: 5px;
                font-size: 14px;
                transition: border 0.2s linear;

                &:focus {
                    outline: none;
                    border: none;
                    border-bottom: 1px dashed gray;
                }
            }
        }

        .input-text {
            textarea {
                width: 100%;
                height: 230px;
                resize: none;
                padding: 10px;
                border-radius: 10px;
                font-size: 14px;
                border: 1px dashed $comment-border;
                background: url('@/assets/imgs/comment.png') no-repeat right bottom;
                background-size: 165px;
                transition: border 0.2s linear;

                &:focus {
                    outline: none;
                    border: 1px dashed gray;
                }
            }
        }

        .authorCode {
            display: flex;
            align-items: center;
            justify-content: left;

            span {
                font-size: 14px;
                color: $textColor;
            }
        }

        .submit {
            display: flex;
            align-items: center;
            margin-top: 10px;

            .button {
                background-color: $comment-border;
                padding: 0px 17px;
                border-radius: 20px;
                text-align: center;
                line-height: 30px;
                font-size: 13px;
                color: gray;
                transition: all 0.2s linear;
                cursor: pointer;
                margin-right: 10px;

                &:hover {
                    color: white;
                    background-color: $textColor;
                }
            }


            span {
                position: relative;
                font-size: 13px;
                transition: all 0.2s linear;
            }

            .authorTip {
                margin-left: 10px;
                color: $textColor;
            }
        }
    }

    .comment-list {
        margin-top: 40px;

        .title {
            span {
                &:nth-child(1) {
                    border-bottom: 1px solid gray;
                    font-size: 16px;
                    margin-right: 5px;
                }

                &:nth-child(2) {
                    color: gray;
                    font-size: 14px;
                }
            }
        }

        .list {
            padding: 20px 0;

            .list-item {
                border-bottom: 1px solid $comment-border;

                .namedate {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 20px;

                    &:hover {
                        .right {
                            .reply {
                                display: block;
                            }
                        }

                    }

                    .left {
                        display: flex;
                        align-items: center;

                        .avatar {
                            width: 40px;
                            height: 40px;
                            border-radius: 50%;
                            overflow: hidden;
                            border: 1px solid $textColor;
                            margin-right: 10px;

                            img {
                                width: 100%;
                                height: 100%;
                            }
                        }

                        .name {
                            color: $textColor;
                            font-size: 17px;
                            font-weight: 600;
                        }

                        .author {
                            margin-left: 2px;
                            padding: 1px 1px;
                            color: white;
                            font-size: 12px;
                            background-color: $authorColor;
                        }
                    }

                    .right {
                        font-size: 12px;
                        display: flex;
                        align-items: center;

                        .reply {
                            display: none;
                            padding: 2px 8px;
                            border-radius: 5px;
                            background-color: $textColor;
                            color: white;
                            margin-right: 5px;
                            cursor: pointer;
                        }

                        .date {
                            color: gray;
                        }
                    }

                }

                .message {
                    padding: 10px 30px 20px 50px;
                    font-size: 14px;
                }

                .child {
                    margin-left: 40px;
                    border-top: 1px solid $comment-border;

                    .message {
                        .to {
                            padding: 2px 6px;
                            background-color: $textColor;
                            color: white;
                            border-radius: 20px;
                        }
                    }
                }
            }
        }
    }
}
</style>