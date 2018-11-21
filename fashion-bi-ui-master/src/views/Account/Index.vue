<template>
  <main class="main" >
    <router-link class="logo" to="/"><img src="../../assets/logo.png"></router-link>
    <div class="login-content">
      <span class="slogan" :class="{in:animation}">以智能解锁趋势<br>
        用数据预见流行
        <div class="slogan2" :class="{in:animation}">——  让我们帮您打造全方位的时尚资讯视角</div>
      </span>
      <div class="form">
        <router-view/>
        <span class="login-tip">有问题?请联系<a href="mailto:fashionBI@zhiyitech.cn">fashionBI@zhiyitech.cn</a></span>
      </div>
    </div>
    <footer class="login-footer">杭州知衣科技有限公司  Copyright All Rights Reserved. Hangzhou Zhiyi Technology © 2018</footer>
  </main>
</template>
<script>
import './index.scss'
export default {
  data () {
    return {
      animation: false
    }
  },
  mounted () {
    setTimeout(() => {
      this.animation = true
    }, 100)
  }
}
</script>
<style lang="scss" scoped>
  .login-tip{
    position: absolute;
    bottom:-1.8em;
    font-weight: 300;
  }
  a{
    color:#1988ea;
  }
</style>
