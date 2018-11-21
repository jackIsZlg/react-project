<template>
  <div class="category-wrap">
    <zy-line>
      <span class="all-category" @mousedown="selectCategory('全部品类')" >全部品类</span>
    </zy-line>
    <zy-line v-for="(item ,key) in category" :key="key">
      <div class="first-category" @mousedown="selectCategory('',key)">{{ key }}</div>
      <div class="line"/>
      <div class="second-category-wrap">
        <span @mousedown="selectCategory(second,key)" class="second-category" v-for="(second,index) in item.split('#')" :key="'second'+index">{{ second }}</span>
      </div>
    </zy-line>
  </div>
</template>
<script>
export default {
  inject: ['selectItem'],
  props: {
    category: Object,
    index: Number
  },
  data () {
    return (
      {
        placeholder: '请选择',
        visible: false,
        value: ''
      }
    )
  },
  mounted () {
    console.log(this.title)
  },
  methods: {
    selectCategory: function (category, rootCategory) {
      this.selectItem(category)
      this.$emit('selectCategory', category, rootCategory, this.index)
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.all-category {
  font-size: 12px;
  margin:10px 20px;
  background-color: #f5f5f5;
  border: solid 1px #ebebeb;
  color: #666666;
  padding: 4px 5px;
}
.category-wrap{
    width: 450px;
    max-height: 250px;
    padding: 10px;
    overflow-x: auto;
    background-color: #ffffff;
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.2);
    z-index: 3
}
.line{
    height: 8px;
    margin-top: 11px;
    margin-right: 10px;
    background-color: #d9d9d9;
    width: 1px;
}
.first-category{
    font-size: 12px;
    color: #111;
    height: 17px;
    width: 40px;
    text-align: right;
    padding: 7px 10px;
    line-height: 17px;
}
.second-category-wrap{
    display: flex;
    flex-wrap: wrap;
    flex:1;
}
.second-category{
    cursor: pointer;
    font-size: 12px;
    padding: 7px;
    color: #666666;
    &:hover{
        color: #1890ff
    }
}
</style>
