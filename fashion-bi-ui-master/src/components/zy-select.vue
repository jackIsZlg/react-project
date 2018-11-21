<template>
  <div class="zy-select">
    <div class="zy-input" >
      <span v-if="title" class="zy-input-title">{{ title }}:</span>
      <input
        class="zy-input-inner"
        autocomplete="off"
        readonly
        @mousedown="visible=!visible"
        :placeholder="placeholder"
        :value="selectedValue"
        ref="input"
      >
      <i @click="clearItem" v-if="this.selectedValue"
         class="iconfont zy-input-icon icon-close"
         ref="close"
      />
      <i @mousedown="visible = !visible"
         ref="down"
         class="iconfont zy-input-icon icon-down"
         :class="visible ? 'transform-up' : 'transform-down'" />
    </div>
    <transition name="fade">
      <div v-show="visible" @mousedown.stop="noneFunc" class="zy-select-item-panel" :class="{right:direction==='right'}">
        <slot>
          <ul class="zy-select-item-wrap">
            <li v-for="(item,index) in options" :key="index" class="zy-select-item" @mousedown="selectItem(item,index)">
              {{ item }}
            </li>
          </ul>
        </slot>
      </div>
    </transition>
  </div>
</template>
<script>
export default {
  props: {
    options: Array,
    fourceVisible: Boolean,
    selectedValue: String,
    title: {
      type: String,
      default: ''
    },
    direction: String
  },
  model: {
    prop: 'selectedValue',
    event: 'updateModel'
  },
  provide () {
    return {
      selectItem: this.selectItem
    }
  },
  watch: {
    fourceVisible: function (n, o) {
      console.log(111, n, o)
      this.visible = n
    }
  },
  data () {
    return {
      placeholder: '请选择',
      visible: false,
      value: ''
    }
  },
  methods: {
    noneFunc () {
      console.log('nonefunc')
    },
    clearItem () {
      console.log(this.value)
      this.value = '';
      this.$emit('updateModel', '')
    },
    // toggleItem: function () {
    //   this.visible = !this.visible
    // },
    selectItem: function (item, index) {
      this.value = item
      this.visible = false
      this.$emit('updateModel', this.value)
    }
  },
  mounted () {
    this.bodyClick = e => {
      console.log(e)
      if (
        e.target !== this.$refs.input &&
        e.target !== this.$refs.down &&
        e.target !== this.$refs.close
      ) {
        this.visible = false
      }
    }
    document.body.addEventListener('mousedown', this.bodyClick)
  },
  destroyed () {
    document.body.removeEventListener('mousedown', this.bodyClick)
  }
}
</script>

<style lang="scss" scoped>
ul {
  padding: 0;
  margin: 0;
  height: auto;
  li {
    list-style: none;
  }
}
.zy-select {
  cursor: pointer;
  position: relative;
  width: 190px;
}
.zy-select-item-panel {
  position: absolute;
  top: 100%;
  z-index: 9;
  min-width: 100%;
  &.right {
    right: 0;
  }
}
.zy-select-item-wrap {
  width: 100%;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  border-radius: 0;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin: 0;
  z-index: 9;
}
.zy-select-item {
  text-align: center;
  font-size: 14px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #606266;
  height: 32px;
  line-height: 32px;
  box-sizing: border-box;
  cursor: pointer;
  transition: 0.5s;
  &:hover {
    background-color: #f5f7fa;
  }
}
.transform-up {
  transform: rotate(-180deg);
}
.transform-down {
  transform: rotate(0deg);
}
.zy-input {
  position: relative;
  cursor: pointer;
  display: flex;
  color: #666;
  width: 190px;
  font-size: 12px;
  border-radius: 0px;
  border: 1px solid #d9d9d9;
  box-sizing: border-box;
  background-color: #fff;
}
.zy-input:hover {
  .icon-close {
    display: inline-block;
  }
}
.zy-input-title {
  cursor: default;
  line-height: 32px;
  margin-left: 15px;
}
.zy-input-icon {
  cursor: pointer;
  transition: transform 0.5s;
  line-height: 32px;
  margin-right: 15px;
  font-size: 12px;
  color: #999;
}
.zy-input-inner {
  cursor: pointer;
  border: 0;
  flex: 1;
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
.icon-close {
  display: none;
  font-size: 12px;
  color: #000;
  margin-right: 5px;
  transform: scale(0.6);
}
.fade-enter-active,
.fade-leave-active {
}
.fade-enter,
.fade-leave-to {
}
</style>
