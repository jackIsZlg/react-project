<template>
  <transition
    name="dialog-fade"
    @after-enter="afterEnter"
    @after-leave="afterLeave"
  >
    <div v-if="visible" class="zy-dialog-wrap" @click.self="handleWrapperClick">
      <div class="zy-dialog" :style="'width:'+modalWidth[size]">
        <slot name="title">
          <div class="zy-dialog-header">
            {{ title }}
          </div>
        </slot>
        <div class="zy-dialog-body">
          <slot name="body" />
        </div>
        <div v-if="$slots.footer" class="zy-dialog-footer">
          <slot name="footer"/>
        </div>
      </div>
    </div>
  </transition>
</template>

<script >
export default {
  props: {
    size: {
      type: String,
      default: 'small'
    },
    title: String,
    visible: Boolean,
    closeOnClickModal: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      modalWidth: {
        small: '30%',
        medium: '50',
        big: '70%'
      },
      closed: false,
      id: Math.random().toString(36).substring(7).split('').join('.')
    }
  },
  mounted () {
    if (this.visible) {
      this.$createModal(this.id)
    };
  },
  watch: {
    visible: function (newValue) {
      this.visible ? this.$createModal(this.id) : this.$removeModal(this.id)
    }
  },
  methods: {
    handleWrapperClick () {
      if (!this.closeOnClickModal) return
      this.handleClose()
    },
    handleClose () {
      if (typeof this.beforeClose === 'function') {
        this.beforeClose(this.hide)
      } else {
        this.hide()
      }
    },
    hide (cancel) {
      if (cancel !== false) {
        this.$emit('update:visible', false)
        this.$emit('close')
        this.closed = true
      }
    },
    afterEnter () {
      this.$emit('opened')
    },
    afterLeave () {
      this.$emit('closed')
    }

  },
  destroyed () {
    console.log(1312313)
    if (this.appendToBody && this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  }
}
</script>

<style lang="scss" scoped>
.zy-dialog-wrap{
  z-index: 2002;
  bottom: 0;
  left: 0;
  margin: 0;
  overflow: auto;
  position: fixed;
  right: 0;
  top: 20vh;
}
.zy-dialog{
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0,0,0,.3);
  box-sizing: border-box;
  margin: 0 auto 50px;
  position: relative;
  width: 50%;
}
.zy-dialog-header{
  padding: 20px 20px 10px;
  color: #303133;
  font-size: 18px;
  line-height: 24px;
  text-align: left
}
.zy-dialog-footer{
    box-sizing: border-box;
    padding: 10px 20px 20px;
    text-align: right;
}
</style>
