<template>
  <div :class="`zy-alert zy-alert-${type} ${show?'show':''}`" >
    <i>{{ icon }}</i>
    <span><slot/></span>
    <i class="close"/>
  </div>
</template>
<script>
export default {
  name: 'ZyAlert',
  props: {
    show: Boolean,
    type: {
      type: String,
      default: 'error'
    }
  },
  data () {
    return {
      icon: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.zy-alert {
  display: none;
}
.zy-alert.show {
  display: inline-block;
}
.zy-alert-error {
  font-size: 14px;
  color:#B43b3b;
}
.zy-alert-success {
}
.zy-alert-warning {
}
.zy-alert-info {
}
</style>
