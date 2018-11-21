<template>
  <div class="brand-wrap">

    <zy-line justify="space-between" class="letter-wrap" align="center">
      <span class="all-brand" @mousedown="selectBrand('全部品牌')" >全部品牌</span> <span :class="brandLetter === item ?'brand-letter-active':''" v-for="item in letter" :key="item" @mousedown.stop="selectBrandLetter(item)">{{ item }}</span>
    </zy-line>
    <zy-line direction="column">
      <div class="line"/>
      <div class="input-wrap">
        <input placeholder="请输入需要搜索的品牌名" v-model="inputValue" class="brand-input" @mousedown.stop="$emit('update:fourceVisible', true)" @focus="$emit('update:fourceVisible', true)" @keyup="search()">
      </div>
    </zy-line>
    <zy-line class="brand-item-wrap" wrap="wrap">
      <span v-if="empty" class="empty">暂无此品牌</span>
      <span v-else @mousedown="selectBrand(item)" class="brand-item" v-for="(item ,index) in selfBrands" :key="index">{{ item }}</span>
    </zy-line>
  </div>
</template>
<script>
export default {
  props: {
    brand: Array,
    index: Number
  },
  inject: ['selectItem'],
  data () {
    return {
      letter: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#',
      selfBrands: this.brand,
      inputValue: '',
      brandLetter: '',
      placeholder: '请选择',
      visible: false,
      value: '',
      empty: false
    }
  },
  watch: {
    brand () {
      this.selfBrands = this.brand
    }
  },
  methods: {
    search: function () {
      this.selfBrands = this.brand.filter((brand, index) => {
        const testLetter =
          String(brand).startsWith(this.brandLetter) ||
          String(brand).startsWith(this.brandLetter.toLocaleLowerCase()) ||
          String(brand).startsWith(this.brandLetter.toLocaleUpperCase())
        const testBrand =
          String(brand).includes(this.inputValue) ||
          String(brand).includes(this.inputValue.toLocaleLowerCase()) ||
          String(brand).includes(this.inputValue.toLocaleUpperCase())
        return this.brandLetter
          ? this.brandLetter !== '#'
            ? testBrand && testLetter
            : testBrand && /^(?![a-zA-Z])/.test(String(brand))
          : testBrand
      })
      this.empty = !this.selfBrands.length
    },
    selectBrandLetter: function (value) {
      console.log(131232312)
      this.$emit('update:fourceVisible', true)
      if (value === this.brandLetter) {
        this.brandLetter = ''
      } else {
        this.brandLetter = value
      }
      this.search()
    },
    selectBrand: function (brand) {
      this.selectItem(brand)
      this.$emit('selectBrand', brand, this.index)
      this.$emit('update:fourceVisible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.all-brand {
  font-size: 12px;
  background-color: #f5f5f5;
  border: solid 1px #ebebeb;
  color: #666666;
  padding: 4px 5px;
}
.brand-wrap {
  padding: 13px 20px;
  overflow: hidden;
  width: 700px;
  max-height: 400px;
  overflow-x: auto;
  background-color: #ffffff;
  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.2);
  z-index: 3;
}
.letter-wrap {
  height: 45px;
}
.brand-letter {
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  color: #666;
  font-size: 12px;
  transition: all 0.3s;
  background-color: #fff;
  &:hover {
    color: #fff;
    background-color: #1890ff;
  }
}
.brand-letter-active {
  width: 20px;
  height: 20px;
  color: #fff;
  background-color: #1890ff;
}
.line {
  height: 1px;
  width: 100%;
  margin-bottom: 9px;
  background-color: #e6e6e6;
}
.input-wrap {
  border: 1px solid #d9d9d9;
  height: 28px;
  width: 100%;
  margin-bottom: 5px;
}
.brand-input {
  width: 100%;
  height: 28px;
  line-height: 28px;
  background-color: #ffffff;
  box-sizing: border-box;
  border: 0;
  color: #606266;
  outline: none;
  padding: 0 5px;
}
.brand-item-wrap {
  flex-wrap: wrap;
  max-height: 325px;
  margin-top: 15px;
  overflow-y: auto;
  overflow-x: hidden;
}
.brand-item {
  width: 25%;
  font-size: 12px;
  margin-bottom: 15px;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  color: #666;
  &:hover {
    color: #1890ff;
  }
}
.empty {
  text-align: center;
  width: 100%;
  padding: 10px;
  font-size: 13px;
  color: #555;
}
</style>
