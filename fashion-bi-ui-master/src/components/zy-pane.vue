<template>
  <router-link tag="div" class="pane" :to="link||''">
    <div class="pane-img"><slot/></div>
    <div class="pane-title">{{ title }}</div>
    <div class="sub-title">{{ subTitle }}</div>
  </router-link>
</template>

<script >
export default {
  props: { title: String, icon: String, link: String, subTitle: String }
}
</script>

<style lang="scss" scoped >
.pane {
  background: #fff;
  flex-direction: column;
  border: 1px solid #e6e6e6;
  border-radius: 6px;
  color: #999;
  cursor: pointer;
  transition: all 0.6s;
  height: 250px;
  width: 266px;
  display: flex;
  justify-content: center;
  align-items: center;
  .pane-title {
    font-size: 18px;
    transition: all 0.6s;
    margin-top: 44px;
  }
  &:hover{
    box-shadow: 0px 0px 5px #ddd;
  }
  &.disabled {
    background-color: #f5f5f5;
    box-shadow: 0;

  }
  &.disabled:hover {
    box-shadow: 0 0 0 0 #f5f5f5;
  }
  .sub-title {
    font-family: PingFangSC-Regular;
    font-size: 12px;
  }
  .img {
    width: 80px;
  }
}
</style>
