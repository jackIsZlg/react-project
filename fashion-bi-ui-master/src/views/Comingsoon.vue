<template>
  <div class="comingsoon">
    <div class="comingsoon-left">
      <div>敬请期待</div>
      <div class="comingsoon-tip">
        COMING SOON
      </div>
    </div>
    <div class="comingsoon-right">
      <span>{{ title }}</span>
      <ul>
        <li :key="i" v-for="(item,i) in info"><span class="comingsoon-info-index">{{ i+1 }}</span>{{ item }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  props: { title: String, info: Array }
}
</script>
<style lang="scss" scoped>
.comingsoon {
  display: flex;
  position: fixed;
  top:40%;
  width:100%;
  justify-content: center;
  align-items: center;
  .comingsoon-left {
    width: 180px;
    height: 146px;
    background-color: #efefef;
    text-align: center;
    font-family: PingFangSC-Medium, "微软雅黑";
    font-size: 24px;
    color: #666666;
    flex-direction: column;
    justify-content: center;
    .comingsoon-tip {
      font-family: PingFangSC-Regular;
      font-size: 12px;
    }
    display: flex;
  }
  .comingsoon-right {
    width:600px;
    text-align: left;
    margin-left: 70px;
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #999999;
    ul {
      list-style: none;
      padding: 0;
      line-height: 1.8em;
      .comingsoon-info-index {
        margin: 0;
        background: rgb(163, 211, 255);
        color: #fff;
        border-radius: 50%;
        height: 20px;
        width: 20px;
        text-align: center;
        line-height: 20px;
        display: inline-block;
        font-size: 14px;
        margin-right: 10px;
      }
    }
  }
}
</style>
