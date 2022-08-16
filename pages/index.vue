<template>
  <div class="index">
    <div class="avatar" @mouseenter="mouseAction" @mouseleave="mouseAction"
      :class="{ avatarUp: isAnm, avatarDown: !isAnm && isFirst === -1 }">
      <div class="circles">
        <img :src="`${blogMes.websiteAddress}${blogMes.avatar}`" />
      </div>
    </div>
    <p class="name">{{ blogMes.name }}</p>
    <p class="introduce">{{ blogMes.introduce }}</p>
    <p class="desc">{{ blogMes.desc }}</p>
    <div class="tags">
      <ul>
        <li>
          <nuxt-link to="/articles" title="文章"><i class="iconfont icon-navicon-wzgl"></i></nuxt-link>
        </li>
        <li>
          <nuxt-link to="/categories" title="分类"><i class="iconfont icon-sort"></i></nuxt-link>
        </li>
        <li>
          <nuxt-link to="/tags" title="标签"><i class="iconfont icon-24gl-tags3"></i></nuxt-link>
        </li>
        <li>
          <nuxt-link to="/messages" title="留言板"><i class="iconfont icon-liuyan"></i></nuxt-link>
        </li>
        <li>
          <a :href="blogMes.github" target="_blank" title="github"><i class="iconfont icon-github"></i>
          </a>
        </li>
        <li>
          <a :href="blogMes.gitee" target="_blank" title="gitee"><i class="iconfont icon-gitee-fill-round"></i>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      isAnm: false,
      isFirst: 0
      //baseUrl: process.env.baseUrl
    }
  },
  methods: {
    mouseAction() {
      this.isFirst = -1
      this.isAnm = !this.isAnm
    }
  },
  computed: {
    blogMes() {
      return this.$store.state.blogMes
    }
  }
  // async asyncData({ app }) {
  //   const res = await app.$getHome()
  //   if (res.code === 200) {
  //     return {
  //       mess: res.data
  //     }
  //   } else {
  //     console.log('error:', res.msg);
  //   }
  // }
}
</script>

<style scoped lang='scss'>
.index {
  width: 100%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 30px;

  @keyframes avatarUp {
    0% {
      transform: translateY(0);
    }

    100% {
      transform: translateY(-10px);
    }
  }

  @keyframes avatarDown {
    0% {
      transform: translateY(-10px);
    }

    100% {
      transform: translateY(0);
    }
  }

  .avatarUp {
    animation: avatarUp 0.3s linear forwards;
  }

  .avatarDown {
    animation: avatarDown 0.3s linear forwards;
  }

  .avatar {
    position: relative;
    width: 135px;
    height: 135px;
    border-radius: 50%;
    background-color: gainsboro;

    .circles {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 125px;
      height: 125px;
      border-radius: 50%;
      overflow: hidden;

      img {
        width: 100%;
      }
    }


  }

  .name {
    font-size: 35px;
    padding: 10px 0;
  }

  .introduce {
    font-size: 15px;
  }

  .desc {
    font-size: 15px;
  }

  .tags {
    ul {
      display: flex;
      justify-content: center;

      li {
        padding: 10px;

        i {
          font-size: 25px;
        }
      }
    }
  }
}
</style>