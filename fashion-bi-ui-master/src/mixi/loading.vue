<template>
  <div class="loading-mask">
    <div class="loading-content">{{ text||'努力加载中……' }}</div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      text: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.loading-mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255,255,255,.8);
  .loading-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
