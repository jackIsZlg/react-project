<template>
  <router-view/>
</template>

<script>
export default {
  data () {
    return {}
  }
}
</script>

<style lang="scss">
body,html {
  margin: 0;
  padding: 0;
  height: 100%;
}
a {
  text-decoration: none;
}
.zy-modal {
  background: #000;
  height: 100%;
  left: 0;
  opacity: 0.5;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 101;
}
.disabled {
  color: #c0c4cc;
  cursor: not-allowed !important;
  background-image: none;
  background-color: #fff;
  border-color: #ebeef5;
}
</style>
