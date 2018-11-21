<template>
  <div id="app">
    <nav class="nav">
      <div class="left-wrap">
        <div class="nav-logo">
          <router-link to="/"><img src="../assets/logo.png" alt=""></router-link>
        </div>
        <div class="nav-tab">
          <router-link to="/discovery">发现</router-link>
          <router-link to="/dashboards">看板</router-link>
          <router-link to="/trend">趋势</router-link>
          <router-link to="/market">市场</router-link>
          <router-link to="/tool">工具</router-link>
        </div>
      </div>
      <div class="right-wrap">
        <div class="connect-us">联系我们:<a href="mailto:fashionBI@zhiyitech.cn">fashionBI@zhiyitech.cn</a></div>
        <a class="logout" @click="logout"><i class="iconfont icon-exit"/>&nbsp;退出</a>
      </div>
    </nav>
    <router-view class="app-content"/>
    <zy-totop/>
    <zy-concat/>
    <footer>杭州知衣科技有限公司  Copyright All Rights Reserved. Hangzhou Zhiyi Technology © 2018</footer>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {
    async logout () {
      try {
        await this.$axios.get('/bi-api/logout')
      } catch (error) {
        console.error(error)
      }
      localStorage.clear()
      sessionStorage.clear()
      this.$router.replace('/login')
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  .app-content{
    flex: 1;
  }
}

nav {
  display: flex;
  font-size: 16px;
  justify-content: space-between;
  background-color: #051d33;
  height: 60px;
  color: #fff;
  padding: 0 50px;
  a {
    text-decoration: none;
  }
  a:link {
    color: #fff;
  }
  a:hover {
    color: #fff;
  }
  a:visited {
    color: #fff;
  }
  div {
    display: flex;
    align-items: center;
  }
  .left-wrap {
    flex: 1;
    .nav-logo {
      img {
        height: 20px;
      }
    }
    .nav-tab {
      margin-left: 120px;
      a {
        cursor: pointer;
        font-weight: 500;
        display: flex;
        margin-right: 30px;
        transition: all 0.5s;
        &:hover {
          color: #1890ff;
        }
      }
      a.active {
        color: #1890ff;
      }
    }
  }
  .right-wrap {
    .connect-us {
      font-size: 14px;
      margin-right: 30px;
    }
  }
}
footer {
  display: flex;
  justify-content: center;
  align-items: center;
  color: #666666;
  padding: 10px;
  font-size: 12px;
  background-color: #efefef;
  z-index:8;
}
.logout {
  cursor: pointer;
  font-size: 14px;
  color: #ddd;
  &:hover {
    color: #ffffff;
  }
}
</style>
