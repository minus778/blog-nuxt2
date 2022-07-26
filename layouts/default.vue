<template>
  <div class='body'>
    <!-- 头部区域 -->
    <Header></Header>
    <!-- 内容区域 -->
    <div class="main">
      <nuxt />
    </div>
    <!-- 底部区域 -->
    <Footer :recode="blogMes"></Footer>
  </div>
</template>

<script>
export default {
  name: 'default',
  computed: {
    blogMes() {
      return this.$store.state.blogMes
    }
  },
}
</script>

<style scoped lang='scss'>
.body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .main {
    flex: 1;
  }
}
</style>