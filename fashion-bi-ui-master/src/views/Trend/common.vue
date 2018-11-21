<template>
  <div class="Trend">
    <zy-dialog title="删除查询条件" :visible.sync="visible" size="small">
      <div slot="body">确定删除查询条件?</div>
      <div slot="footer" class="footer">
        <zy-button @click="visible=false">取 消</zy-button>
        <zy-button type="primary" @click="deleteFilter(currentIndex)">确 定</zy-button>
      </div>
    </zy-dialog>
    <zy-dialog title="重置查询条件" :visible.sync="visibleReset" size="small">
      <div slot="body">确定重置查询条件?</div>
      <div slot="footer" class="footer">
        <zy-button @click="visibleReset=false">取 消</zy-button>
        <zy-button type="primary" @click="resetFilter()">确 定</zy-button>
      </div>
    </zy-dialog>
    <div class="filter-wrap">
      <zy-crumb :menu="menu" need-back />
      <div class="filter-line" v-for="(filter,index) in filters" :key="index">
        <div class="mark">{{ index+1 | numberToLetter }}</div>
        <zy-select class="marginLeft15" title="性别" :options="sexOptions" v-model="filters[index].sex" />
        <zy-select class="marginLeft10" title="季度" :options="seasonOptions" v-model="filters[index].season" />
        <zy-select class="marginLeft10" title="秀场" :options="showOptions" v-model="filters[index].show" />
        <zy-select class="marginLeft10" title="品类" v-model="filters[index].searchCategory" :selected-value.sync="selectCategoryValue">
          <category
            @selectCategory="selectCategory"
            :index="index"
            :select-category.sync="selectCategoryValue"
            :category="category"/>
        </zy-select>
        <zy-select class="marginLeft10" direction="right" title="品牌" v-model="filters[index].searchBrand" :selected-value.sync="selectBrandValue" :fource-visible="filters[index].fourceVisible" >
          <brand
            @selectBrand="selectBrand"
            :selected-brand.sync="selectBrandValue"
            :index="index"
            :fource-visible.sync="filters[index].fourceVisible"
            :brand="brand"/>
        </zy-select>
        <zy-input class="marginLeft20" suffix-icon="search" v-model="filters[index].keyWords" />
        <div class="marginLeft20" >
          <i class="iconfont icon-copy" :class="filters.length>9 ? 'disabled':''" @click="copyFilter(index)" />
          <i class="iconfont icon-delete" @click="openModal(index)" v-if="filters.length > 1"/>
        </div>
      </div>
      <zy-line style="margin-top:15px">
        <zy-button @click="addFilter()" :type="filters.length>9 ? 'disabled':'gray'"><i class="iconfont icon-add" style="font-size:14px;margin-right:10px" />添加筛选条件</zy-button>
        <zy-button type="gray" @click="visibleReset=true">重置</zy-button>
      </zy-line>
    </div>
    <router-view :filters="filters" :detail-big-chart.sync="detailBigChart" show-empty-sync="showEmpty"/>
  </div>
</template>
<script>
import category from '../common/category.vue'
import brand from '../common/brand.vue'
export default {
  components: { category, brand },
  data: function () {
    return {
      sexOptions: [],
      seasonOptions: [],
      showOptions: [],
      menu: [{ name: '流行趋势分析', to: '/trend' }, { name: '发布会' }],
      brand: [],
      isNoFilter: true,
      showCharts: false,
      category: {},
      detailBigChart: {},
      fourceVisible: false,
      selectCategoryValue: '',
      selectBrandValue: '',
      filters: localStorage.filters ? JSON.parse(localStorage.filters) : [{}],
      currentIndex: '',
      visible: false,
      visibleReset: false
    }
  },
  beforeRouteUpdate (to, from, next) {
    const name = to.query.name
    if (name) {
      this.menu.push({ name })
    } else {
      this.menu.pop()
    }
    next()
  },
  created () {
    const name = this.$router.currentRoute.query.name
    if (name) {
      this.menu[2] = { name }
    } else {
      this.menu.length = 2
    }
  },
  mounted () {
    this.$watch(
      'filters',
      n => {
        n.map((item, index) => {
          if (item.searchCategory === '' || item.searchCategory === '全部品类') { item.category = item.rootCategory = '' }
          if (item.searchBrand === '' || item.searchBrand === '全部品牌') {
            item.brand = ''
          } else {
            item.brand = item.searchBrand
          }
        })
        localStorage.filters = JSON.stringify(n)
      },
      { deep: true }
    )
    this.getCategory()
    this.getBrand()
  },
  methods: {
    // 确认框
    openModal (index) {
      this.visible = true
      this.currentIndex = index
    },
    // 添加筛选条件
    addFilter () {
      if (this.filters.length > 9) return
      this.filters.push({})
    },
    // 删除筛选条件
    deleteFilter (index) {
      this.visible = false
      this.filters.splice(this.filters.findIndex((item, i) => i === index), 1)
    },
    // 重置筛选条件
    resetFilter () {
      this.filters = [{}]
      this.visibleReset = false
    },
    // 复制筛选条件
    copyFilter (index) {
      if (this.filters.length > 9) return
      const tmp = JSON.parse(JSON.stringify(this.filters[index]))
      this.filters.push(tmp)
    },
    // 选择品牌
    selectBrand (brand, index) {
      this.filters = JSON.parse(JSON.stringify(this.filters))
      this.filters[index].searchBrand = brand
      this.selectBrandValue = brand
    },
    // 选择品类
    selectCategory (category, rootCategory, index) {
      this.filters = JSON.parse(JSON.stringify(this.filters))
      this.filters[index].category = category
      this.filters[index].rootCategory = rootCategory
      this.filters[index].searchCategory = category || rootCategory
      this.selectCategoryValue = category || rootCategory
    },
    // 获取标签
    async getCategory () {
      let result = await this.$axios.get('/bi-api/trend/category')
      this.category = result
    },
    // 获取品牌
    async getBrand () {
      let result = await this.$axios.get('/bi-api/trend/label')
      result.map((item, index) => {
        switch (item.type) {
          case 'sex':
            this.sexOptions = item.result
            break
          case 'season':
            this.seasonOptions = item.result
            break
          case 'brand':
            this.brand = item.result
            break
          case 'show':
            this.showOptions = item.result
            break
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.Trend {
  padding-bottom: 60px;
}
.filter-wrap {
  padding: 40px 50px 30px;
  background-color: #f7f9fa;
  .filter-line {
    flex-wrap: wrap;
    display: flex;
    align-items: center;
    height: 62px;
  }
}
.chart-pane {
  padding: 0 50px;
  display: flex;
}
.chart {
  margin-top: 20px;
  border: solid 1px #d9d9d9;
  padding: 15px;
  flex: 1;
  height: 345px;
  transition: 0.3s;
  &:hover {
    box-shadow: 2px 2px 2px #d9d9d9;
    background-color: #fff;
  }
}
.nothing {
  flex: 1;
  padding: 15px;
}
.line {
  width: 20px;
}
.icon-copy {
  cursor: pointer;
  margin-right: 15px;
  &:hover {
    color: #1890ff;
  }
}
.icon-delete {
  cursor: pointer;
  &:hover {
    color: #ff5555;
  }
}
.mark {
  font-size: 14px;
  height: 20px;
  line-height: 20px;
  display: block;
  width: 20px;
  color: #fff;
  background-color: rgba(24, 144, 255, 0.4);
  border-radius: 16px;
}
.marginLeft10 {
  margin-left: 10px;
}
.marginLeft15 {
  margin-left: 15px;
}
.marginLeft20 {
  margin-left: 20px;
}
.no-filter-wrap {
  .no-filter-title {
    margin-top: 130px;
    font-size: 20px;
    color: #666;
  }
  .no-filter-msg {
    font-size: 14px;
    color: #666;
  }
}
</style>
