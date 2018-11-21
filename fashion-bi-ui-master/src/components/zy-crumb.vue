<template>
  <div class="zy-crumb">
    <div v-for="(item,index) in menu" :key="index" class="zy-crumb-item">
      <span v-if="item.to"><router-link tag="span" :to="item.to">{{ item.name }}</router-link></span>
      <span v-else>{{ item.name }}</span>
      <span class="separator"> {{ index === menu.length-1?'': separator }}</span>
    </div>
    <div v-if="needBack" class="zy-crumb-item zy-crumb-back" @click="back">
      <span>
      <i class="iconfont  icon-back" /> 返回</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    menu: Array,
    separator: {
      type: String,
      default: '—'
    },
    needBack: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    console.log(this.menu)
  },
  methods: {
    back: function () {
      this.$router.back()
    }
  }
}
</script>

<style scoped>
.zy-crumb{
  display: flex;
  font-size: 20px;
  color: #333333;
  margin-bottom: 15px;
}
.zy-crumb-item{
  font-weight: 500;
}
.zy-crumb-back{
    cursor: pointer;
    margin-left: 20px;
    margin-top: 3px;
    font-size: 12px;
    height: 22px;
    line-height: 22px;
    background-color: rgba(24,144,255,0.15);
    padding: 0px 10px;
}
.separator{
  display: inline-block;
  margin: 0 2px;
}
.icon-back{
  font-size: 12px;
}
</style>
