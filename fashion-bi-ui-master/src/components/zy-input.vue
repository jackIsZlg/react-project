<template>
  <div>
    <div class="zy-input">
      <i class="iconfont zy-input-icon" v-if="suffixIcon" :class="'icon-'+suffixIcon"/>
      <input class="zy-input-inner" :value="value" @keyup="handleOnChange" :style="newStyle" autocomplete="off" :placeholder="placeholder" >
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: String,
    newStyle: String,
    title: String,
    suffixIcon: String,
    placeholder: {
      type: String,
      default: '请输入关键词'
    },
    readonly: {
      type: String,
      default: 'readonly'
    }
  },
  model: {
    prop: 'value',
    event: 'updateModel'
  },
  data () {
    return ({
    })
  },
  mounted () {
    console.log(this.options)
  },
  methods: {
    back: function () {
      this.$router.back()
    },
    handleOnChange: function (event) {
      this.$emit('updateModel', event.target.value)
    }
  }
}
</script>

<style scoped>
  .zy-input{
    position: relative;
    display: flex;
    color: #666;
    width: 200px;
    font-size: 12px;
    border-radius: 0px;
    border: 1px solid #d9d9d9;
    box-sizing: border-box;
    background-color: #fff;
  }
  .zy-input-title{
    line-height: 32px;
    margin-left: 15px;
  }
  .zy-input-icon{
    line-height: 32px;
    margin:0  15px;
  }
  .zy-input-inner{
    border: 0;
    flex:1;
    background-color: #fff;
    background-image: none;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 32px;
    line-height: 32px;
    outline: none;
    width: 100%;
    padding: 0 5px;
  }
</style>
