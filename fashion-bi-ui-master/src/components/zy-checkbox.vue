<template>
  <label>
    <input type="checkbox"
           :checked="value"
           hidden
           @change="$emit('change', $event.target.checked)"><i/>
    <slot/>
  </label>
</template>
<script>
export default {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: Boolean
  }
}
</script>
<style lang="scss" scoped>
input[type="checkbox"] {
  display: none;
  & + i {
    margin-right: 0.5em;
  }
  & + i::before {
    font-family: "iconfont" !important;
    font-size: 20px;
    font-style: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    content: "\e74a";
    display: inline-block;
    vertical-align: middle;
  }
  &:checked + i::before {
    content: "\e74b";
  }
}
</style>
