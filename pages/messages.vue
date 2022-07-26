<template>
    <div class="messages">
        <h2>-&nbsp;Leave a message&nbsp;-</h2>
        <Comment :commentList="commentList" @refreshLength="refreshLength" :length="length"></Comment>
    </div>
</template>

<script>
export default {
    name: "message",
    async asyncData({ app }) {
        let res = await app.$getMessage()
        if (res.code === 200) {
            return {
                commentList: res.data,
                length: res.data.length
            }
        } else {
            console.error(res.msg)
        }
    },
    methods: {
        refreshLength() {
            this.length += 1
        }
    }
}
</script>

<style scoped lang='scss'>
.messages {
    @include commonSizeArticle;
}
</style>