<template>
  <button
    class="zy-button"
    @click="handleClick"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :class="[
      type ? 'zy-button-' + type : '',
      buttonSize ? 'zy-button-' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle
      }
    ]"
  >
    <span v-if="$slots.default"><slot/></span>
  </button>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: String,
    loading: Boolean,
    disabled: Boolean,
    plain: Boolean,
    autofocus: Boolean,
    round: Boolean,
    circle: Boolean
  },
  computed: {
    buttonSize () {
      return this.size
    },
    buttonDisabled () {
      return this.disabled
    }
  },
  methods: {
    handleClick (evt) {
      this.$emit('click', evt)
    }
  }
}
</script>
<style lang="scss">
  .zy-button{
    background: #fff;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    margin: 0;
    outline: 0;
    padding: 7px 15px;
    text-align: center;
    transition: .3s;
    white-space: nowrap;
    &:focus,&:hover{
      background-color: #ecf5ff;
      border-color: #c6e2ff;
      color: #409eff;
    }
  }
  .zy-button+.zy-button {
    margin-left: 10px;
  }
  .zy-button-primary {
    background-color: #409eff;
    border-color: #409eff;
    color: #fff;
    &:focus,&:hover{
      background: #66b1ff;
      border-color: #66b1ff;
      color: #fff;
    }
  }
.zy-button-gray {
    background-color: #f0f0f0;
    border: 0;
    color: #666666;
    &:focus,&:hover{
      background: #66b1ff;
      border-color: #66b1ff;
      color: #fff;
    }
  }
  .zy-button-disabled{
      color: #c0c4cc;
      cursor: not-allowed;
      background-image: none;
      background-color: #fff;
      border-color: #ebeef5;
      &:focus,&:hover{
        background: #fff;
        border-color: #ebeef5;
        color: #c0c4cc;
      }
  }
</style>
