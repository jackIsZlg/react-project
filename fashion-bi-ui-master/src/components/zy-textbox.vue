<template>
  <div class="zy-textbox">
    <input :type="type">
  </div>
</template>
<script>
export default {
  props: {
    type: String,
    rules: Array
  },
  data () {
    return {
      val: ''
    }
  },
  methods: {
    vaildate (rule) {
      if (rule instanceof RegExp) {
        /a/.test()
      }
    }
  }
}
</script>
