<template>
  <i id="totop" class="zy-totop iconfont icon-totop" @click="toTop"/>
</template>
<script>
export default {
  mounted () {
    window.onscroll = function () {
      const tmpDom = document.getElementById('totop');
      (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) ? tmpDom.style.display = 'block' : tmpDom.style.display = 'none'
    }
  },
  methods: {
    toTop () {
      const distance = document.documentElement.scrollTop || document.body.scrollTop
      this.easeUp(distance)
    },
    easeUp (distance, step = 10) {
      if (distance > 0) {
        document.body.scrollTop -= step
        document.documentElement.scrollTop -= step
        setTimeout(() => this.easeUp(distance - step, step + 1), 10)
      }
    }
  }
}
</script>
<style >
.zy-totop {
    cursor: pointer;
    display: none;
    width: 40px;
    height: 40px;
    line-height: 40px;
    background-color: #f0f0f0;
    box-shadow: 0px 2px 4px 0px rgba(86, 86, 86, 0.5);
    border-radius: 20px;
    position: fixed;
    right: 10px;
    bottom: 100px;
    z-index: 9;
}
</style>
