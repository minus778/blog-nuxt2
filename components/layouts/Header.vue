<!-- 布局头部区域 -->
<template>
    <div class="headers">
        <div class="header">
            <div class="left">
                <nuxt-link to="/">
                    <span>haixtx的个人博客</span>
                </nuxt-link>
            </div>
            <!-- pc端 -->
            <div class="right">
                <div class="pc">
                    <ul>
                        <li>
                            <nuxt-link to="/articles">
                                <span>文章</span>
                            </nuxt-link>
                        </li>
                        <li>
                            <nuxt-link to="/categories">
                                <span>分类</span>
                            </nuxt-link>
                        </li>
                        <li>
                            <nuxt-link to="/tags">
                                <span>标签</span>
                            </nuxt-link>
                        </li>
                        <li>
                            <nuxt-link to="/messages">
                                <span>留言板</span>
                            </nuxt-link>
                        </li>
                        <li>
                            <nuxt-link to="/about">
                                <span>关于</span>
                            </nuxt-link>
                        </li>
                    </ul>
                    <div class="phone-menu" @click="isShow = !isShow">
                        <i class="iconfont icon-kuaijiecaidan"></i>
                        <span>Menu</span>
                    </div>
                    <div class="switch" @click="changeBgColor"
                        :style="{ backgroundColor: isOpen ? '#a862ea' : 'gainsboro' }">
                        <div class="circle" :class="{ open: isOpen, close: !isOpen && isFirst === -1 }"> </div>
                    </div>
                </div>
            </div>

        </div>
        <!-- 移动端 -->
        <div :class="{ show: isShow, phone: !isShow }">
            <ul>
                <li>
                    <nuxt-link to="/articles">
                        <span>文章</span>
                    </nuxt-link>
                </li>
                <li>
                    <nuxt-link to="/categories">
                        <span>分类</span>
                    </nuxt-link>
                </li>
                <li>
                    <nuxt-link to="/tags">
                        <span>标签</span>
                    </nuxt-link>
                </li>
                <li>
                    <nuxt-link to="/messages">
                        <span>留言板</span>
                    </nuxt-link>
                </li>
                <li>
                    <nuxt-link to="/about">
                        <span>关于</span>
                    </nuxt-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Header',
    data() {
        return {
            isOpen: false,
            isFirst: 0,
            isShow: false
        }
    },
    methods: {
        //改变背景颜色
        changeBgColor() {
            this.isFirst = -1
            this.isOpen = !this.isOpen
        }
    }
}


</script>

<style scoped lang='scss'>
.headers {
    position: relative;
    padding: 0 20px 20px 20px;

    span {
        font-size: 16px;

        &:hover {
            color: $textColor;
        }
    }

    .header {
        width: 100%;
        height: 80px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: white;

        .right {
            .pc {
                display: flex;
                align-items: center;

                .phone-menu {

                    @media (max-width: 600px) {
                        display: flex;
                    }

                    i {
                        font-size: 20px;
                    }

                    cursor: pointer;
                    display: none;
                    align-items: center;

                    &:hover {
                        color: $textColor;
                    }
                }

                ul {
                    @media (min-width: 600px) {
                        display: flex;
                    }

                    display: none;
                    justify-content: space-around;
                    align-items: center;

                    li {
                        margin: 0 10px;
                    }
                }

                .switch {
                    width: 35px;
                    height: 15px;
                    border-radius: 15px;
                    background-color: gainsboro;
                    margin-left: 10px;
                    box-shadow: 1px 1px 1px gray;

                    .circle {
                        width: 15px;
                        height: 15px;
                        border-radius: 50%;
                        background-color: white;
                    }

                    .open {
                        animation: opens 0.3s linear alternate forwards;
                    }

                    .close {
                        animation: close 0.3s linear alternate forwards;
                    }

                    @keyframes opens {
                        0% {
                            transform: translateX(0);
                        }

                        100% {
                            transform: translateX(20px);
                        }
                    }

                    @keyframes close {
                        0% {
                            transform: translateX(20px);
                        }

                        100% {
                            transform: translateX(0px);
                        }
                    }
                }
            }
        }
    }

    .show {
        width: 100%;
        height: 60px;
        line-height: 60px;
        position: relative;
        top: 0;
        transition: all 0.2s linear;
        box-shadow: 1px 1px 12px $comment-border;

        ul {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
        }
    }

    .phone {
        width: 100%;
        height: 0px;
        line-height: 60px;
        position: relative;
        top: -60px;
        z-index: -1;
        transition: all 0.2s linear;
        float: none;

        ul {
            display: flex;
            justify-content: space-evenly;
            align-items: center;
        }
    }
}
</style>