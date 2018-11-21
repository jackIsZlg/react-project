<template>
  <div class="zy-line"
       :style="{
         'justify-content':justify,
         'flex-direction':direction,
         'align-items':align,
         'flex-wrap':wrap
       }"
  >
    <slot/>
  </div>
</template>
<script>
export default {
  props: {
    justify: {
      type: String,
      default: 'flex-start'
    },
    direction: {
      type: String,
      default: 'row'
    },
    align: {
      type: String,
      default: 'flex-start'
    },
    wrap: {
      type: String,
      default: 'nowrap'
    }
  }
}
</script>

<style lang="scss" scoped>
.zy-line{
  display: flex
}
</style>
