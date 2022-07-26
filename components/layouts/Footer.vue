<!-- 布局底部区域 -->
<template>
    <div id="footer">
        <p class="front">{{ recode.recodeOne }}</p>
        <p class="back" v-if="recode.recodeTwo && recode.recodeThree">{{ recode.recodeTwo }}&nbsp;&nbsp;|&nbsp;&nbsp;{{
                recode.recodeThree
        }}</p>
    </div>
</template>

<script>
export default {
    name: "Footer",
    props: {
        recode: {
            type: Object,
            default: () => { }
        }
    }
}
</script>

<style scoped lang='scss'>
#footer {
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;

    .front {
        font-size: 14px;
        padding-right: 10px;
    }

    .back {
        padding-left: 10px;
        font-size: 13px;
        color: gray;
    }
}
</style>