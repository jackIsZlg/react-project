<template>
  <div class="Trend">
    <div class="chart-wrap" v-if="!showEmpty">
      <div class="chart-pane" >
        <div class="chart-wrap chart">
          <div class="chart-title-wrap"/>
          <div id="sexChart" class="chart-content" />
        </div>
        <div class="line" />
        <div class="chart-wrap chart">
          <div class="chart-title-wrap"/>
          <div id="categoryChart" class="chart-content" />
        </div>
      </div>
      <div class="chart-pane">
        <div class="chart-wrap chart">
          <div class="chart-title-wrap"/>
          <div id="colorChart" class="chart-content" />
        </div>
        <div class="line" />
        <div class="chart-wrap chart">
          <div class="chart-title-wrap"/>
          <div id="styleChart" class="chart-content" />
        </div>
      </div>
      <div class="chart-pane">
        <div class="chart-wrap chart">
          <div class="chart-title-wrap"/>
          <div id="imgChart" class="chart-content" />
        </div>
        <div class="line" />
        <div class="chart-wrap chart">
          <div class="chart-title-wrap"/>
          <div id="fabricChart" class="chart-content" />
        </div>
      </div>
      <div class="chart-pane">
        <div class="chart-wrap chart">
          <div class="chart-title-wrap"/>
          <div id="craftsChart" class="chart-content" />
        </div>
        <div class="line" />
        <div class="chart-wrap chart">
          <div class="chart-title-wrap"/>
          <div id="contourChart" class="chart-content" />
        </div>
      </div>
      <div class="chart-pane">
        <div class="chart-wrap chart">
          <div class="chart-title-wrap"/>
          <div id="popularChart" class="chart-content" />
        </div>
        <div class="line" />
        <div class="nothing" />
      </div>
    </div>
    <div v-else class="no-filter-wrap">
      <div class="no-filter-title">请选择查询条件</div>
      <div class="no-filter-msg">1、选择筛选条件开始查询</div>
      <div class="no-filter-msg">2、筛选条件可以叠加、复制、删除</div>
    </div>
  </div>
</template>
<script>
import category from '../common/category.vue'
import brand from '../common/brand.vue'
export default {
  props: {
    filters: Array
  },
  components: { category, brand },
  data: function () {
    return {
      showEmpty:
        this.filters.length === 1 && JSON.stringify(this.filters[0]) === '{}',
      currentChart: '',
      content: '',
      secondCategory: '',
      secondPattern: '',
      secondColor: '',
      sexOptions: [],
      seasonOptions: [],
      showOptions: [],
      menu: [{ name: '流行趋势分析', to: '/trend' }, { name: '发布会' }],
      brand: [],
      isNoFilter: true,
      showCharts: false,
      category: {},
      fourceVisible: false,
      selectCategoryValue: '',
      selectBrandValue: '',
      currentIndex: '',
      visible: false,
      detailBigChart: {},
      chartsData: {},
      optionBack: {
        type: 'pie',
        radius: [0, '30%'],
        center: ['40%', '50%'],
        animation: false,
        tooltip: { show: false },
        label: {
          normal: {
            show: true,
            position: 'center',
            textStyle: {
              color: '#666666',
              fontSize: '16'
            }
          },
          emphasis: {
            show: true,
            position: 'center',
            textStyle: {
              color: '#666666',
              fontSize: '16'
            }
          }
        },
        data: [
          {
            value: 1,
            name: '返回',
            itemStyle: { color: '#f0f0f0', emphasis: { color: '#f0f0f0' } }
          }
        ]
      },
      option: {
        color: [
          '#1890FF',
          '#9ACC66',
          '#3EB27E',
          '#F7CB4A',
          '#F78D48',
          '#F35451',
          '#CE62D6',
          '#8954D4',
          '#5155B8',
          '#50B4F1'
        ],
        title: {
          text: '',
          x: 'left'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        toolbox: {
          right: 20,
          feature: {
            myTool1: {
              show: true,
              title: '查看详情',
              icon: 'image://https://i.loli.net/2018/09/25/5baa088c083bc.png'
            }
          }
        },
        legend: {
          orient: 'vertical',
          padding: [5, 50, 5, 5],
          x: 'right',
          y: 'center',
          data: []
        },
        series: [
          {
            type: 'pie',
            center: ['40%', '50%'],
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            data: []
          }
        ]
      }
    }
  },
  mounted () {
    this.getData(this.filters)
    this.$watch('filters', n => this.getData(n), { deep: true })
  },
  methods: {
    openDetail (name, type, option) {
      localStorage.detailBigChart = JSON.stringify(option)
      this.$router.push({
        path: '/trend/detail',
        query: { type: type, name: name, content: this.content }
      })
    },
    // 渲染图表
    renderCharts (loading) {
      this.showCharts = true
      const charts = [
        {
          name: '性别分析',
          detailType: 1,
          type: 'sex',
          dom: this.$echarts.init(document.getElementById('sexChart'))
        },
        {
          name: `${this.secondCategory}品类分析`,
          detailType: 2,
          type: 'root_category',
          dom: this.$echarts.init(document.getElementById('categoryChart'))
        },
        {
          name: `${this.secondColor}色彩分析`,
          detailType: 14,
          type: 'root_color',
          dom: this.$echarts.init(document.getElementById('colorChart'))
        },
        {
          name: '风格分析',
          detailType: 5,
          type: 'style',
          dom: this.$echarts.init(document.getElementById('styleChart'))
        },
        {
          name: `${this.secondPattern}图案分析`,
          detailType: 16,
          type: 'root_pattern',
          dom: this.$echarts.init(document.getElementById('imgChart'))
        },
        {
          name: '面料分析',
          detailType: 7,
          type: 'fabric',
          dom: this.$echarts.init(document.getElementById('fabricChart'))
        },
        {
          name: '工艺分析',
          detailType: 8,
          type: 'process',
          dom: this.$echarts.init(document.getElementById('craftsChart'))
        },
        {
          name: '廓形分析',
          detailType: 9,
          type: 'contour',
          dom: this.$echarts.init(document.getElementById('contourChart'))
        },
        {
          name: '辅料分析',
          detailType: 10,
          type: 'accessories',
          dom: this.$echarts.init(document.getElementById('popularChart'))
        }
      ]
      if (loading) {
        charts.map((item, index) => {
          item.dom.showLoading()
        })
        return
      }
      // 数据处理
      charts.map((item, index) => {
        if (JSON.stringify(this.chartsData[item.type]) === '{}') {
          item.dom.showLoading({ text: '暂无数据' })
        } else {
          item.dom.hideLoading()
        }
        const tmpOption = JSON.parse(JSON.stringify(this.option))
        tmpOption.legend.data = this.dealLegendData(item.type)
        tmpOption.legend.type = 'scroll'
        tmpOption.series[0].data = this.dealSeriseData(item.type, name)
        tmpOption.toolbox.feature.myTool1.onclick = type => {
          this.openDetail(item.name, item.detailType, tmpOption)
        }
        let chartTitle = document.getElementsByClassName('chart-title-wrap')[index]
        chartTitle.innerHTML = `<div style='font-weight:500;font-size: 14px;color: #333333'>${item.name}
        ${(item.detailType === 2 && !this.secondCategory) ||
            (item.detailType === 14 && !this.secondColor) ||
            (item.detailType === 16 && !this.secondPattern) ? "<span style='color: #666666;'>(可钻取)<span>" : ''}</div>`
        // 品类分析
        if (item.detailType === 2) {
          this.secondCategory && item.dom.hideLoading()
          if (this.chartsData.secondCategory) {
            tmpOption.series[1] = this.optionBack
          } else {
            tmpOption.series[1] = { type: 'pie', data: [] }
            item.dom.off('click')
            item.dom.on('click', params => {
              if (params.componentType === 'series') {
                this.secondCategory = this.chartsData.secondCategory
                  ? this.secondCategory
                  : params.name
                if (params.name === '返回') {
                  this.content = ''
                  this.secondCategory = ''
                  this.getDetailData(2, item.type, '', 'secondCategory', false)
                } else {
                  if (this.chartsData.secondCategory) return
                  this.content = params.name
                  this.getDetailData(
                    2,
                    item.type,
                    params.name,
                    'secondCategory',
                    true
                  )
                }
              }
            })
          }
        }

        // 色彩分析
        if (item.detailType === 14) {
          tmpOption.legend.data = this.dealColorLegendData(item.type)
          tmpOption.legend.type = 'scroll'
          tmpOption.series[0].data = this.dealColorSeriseData(item.type, name)
          this.secondColor && item.dom.hideLoading()
          if (this.chartsData.secondColor) {
            tmpOption.series[1] = this.optionBack
          } else {
            tmpOption.series[1] = { type: 'pie', data: [] }
            item.dom.off('click')
            item.dom.on('click', params => {
              if (params.componentType === 'series') {
                this.secondColor = this.chartsData.secondColor
                  ? this.secondColor
                  : params.name
                if (params.name === '返回') {
                  this.content = ''
                  this.secondCategory = ''
                  this.getDetailData(14, item.type, '', 'secondColor', false)
                } else {
                  if (this.chartsData.secondColor) return
                  this.content = params.name
                  this.getDetailData(
                    14,
                    item.type,
                    params.name,
                    'secondColor',
                    true
                  )
                }
              }
            })
          }
        }

        // 图案分析
        if (item.detailType === 16) {
          this.secondPattern && item.dom.hideLoading()
          if (this.chartsData.secondPattern) {
            tmpOption.series[1] = this.optionBack
          } else {
            tmpOption.series[1] = { type: 'pie', data: [] }
            item.dom.off('click')
            item.dom.on('click', params => {
              if (params.componentType === 'series') {
                this.secondPattern = this.chartsData.secondPattern
                  ? this.secondPattern
                  : params.name
                if (params.name === '返回') {
                  this.content = ''
                  this.secondCategory = ''
                  this.getDetailData(16, item.type, '', 'secondPattern', false)
                } else {
                  if (this.chartsData.secondPattern) return
                  this.content = params.name
                  this.getDetailData(
                    16,
                    item.type,
                    params.name,
                    'secondPattern',
                    true
                  )
                }
              }
            })
          }
        }
        item.dom.setOption(tmpOption)
      })
    },

    // 处理图表的legend
    dealLegendData (type) {
      return Object.keys(this.chartsData[type])
    },
    //  处理图表的数据
    dealSeriseData (type, name) {
      return Object.keys(this.chartsData[type] || {}).map(item => {
        return {
          labelLine: { length: 23 },
          value: this.chartsData[type][item],
          name: item
        }
      })
    },
    // 处理Color图表的legend
    dealColorLegendData (type) {
      return this.chartsData[type].map((item, index) => item.color)
    },
    // 处理Color图表的数据
    dealColorSeriseData (type, name) {
      return this.chartsData[type].map(item => {
        return {
          labelLine: { length: 23 },
          value: item.num,
          name: item.color,
          itemStyle: {
            borderColor: '#ccc',
            color: item.averageHue,
            emphasis: { color: item.averageHue }
          }
        }
      })
    },
    // 获取多条件指定标签的详细分析数据
    async getDetailData (level, type, content, mark, markValue) {
      let result = await this.$axios.post('/bi-api/trend/detail/list', {
        paramList: this.filters,
        type: level,
        content: content
      })
      this.chartsData[type] = result.result
      this.chartsData[mark] = markValue
      this.renderCharts()
    },
    // 查询数据
    async getData (n, o) {
      this.secondCategory = ''
      this.secondPattern = ''
      this.secondColor = ''
      let params = this.filters.filter(m => {
        for (let key in m) {
          if (m[key]) {
            return true
          }
        }
        return false
      })
      if (params.length <= 0) {
        this.showEmpty = true
        return
      }
      // if (n.length === 1 && JSON.stringify(n[0]) === '{}') {
      //   this.showEmpty = true
      //   return
      // }
      this.showEmpty = false
      setTimeout(() => this.renderCharts(true), 0)

      let result = await this.$axios.post(`/bi-api/trend/list`, {
        paramList: params
      })
      result.map((item, index) => {
        switch (item.name) {
          case 'sex': // 性别分析
            this.chartsData.sex = item.result
            break
          case 'root_category': // 类别分析
            this.chartsData.root_category = item.result
            break
          case 'category': // 类别分析
            this.chartsData.category = item.result
            break
          case 'root_color': // 色彩分析
            this.chartsData.root_color = item.result
            break
          case 'color': // 色彩分析
            this.chartsData.color = item.result
            break
          case 'style': // 风格分析
            this.chartsData.style = item.result
            break
          case 'root_pattern': // 图案分析
            this.chartsData.root_pattern = item.result
            break
          case 'pattern': // 图案分析
            this.chartsData.pattern = item.result
            break
          case 'fabric': // 布料分析
            this.chartsData.fabric = item.result
            break
          case 'process': // 工艺分析
            this.chartsData.process = item.result
            break
          case 'contour': // 轮廓分析
            this.chartsData.contour = item.result
            break
          case 'accessories': // 辅料分析
            this.chartsData.accessories = item.result
            break
          case 'brand': // 品牌分析
            this.chartsData.brand = item.result
            break
          case 'season': // 季度分析
            this.chartsData.season = item.result
            break
        }
      })
      this.renderCharts(false)
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
    display: flex;
    align-items: center;
    height: 62px;
  }
}
.chart-pane {
  padding: 0 50px;
  display: flex;
}
.chart-wrap {
  position: relative;
}
.chart-content {
  height: 345px;
}
.chart {
  margin-top: 20px;
  border: solid 1px #d9d9d9;
  padding: 15px;
  padding-right: 0;
  flex: 1;
  height: 345px;
  transition: 0.3s;
  &:hover {
    box-shadow: 0 0px 6px 0px rgba(36, 36, 36, 0.3);
    background-color: #fff;
  }
}
.nothing {
  flex: 1;
  padding-left: 15px;
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
  padding: 0 5px;
  height: 20px;
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
.chart-title-wrap {
  position: absolute;
  .chart-title {
    font-size: 14px;
    color: #333333;
  }
  .chart-info {
    font-size: 14px;
    color: #666666;
  }
}
.no-filter-wrap {
  .no-filter-title {
    margin-top: 130px;
    margin-bottom: 50px;
    font-size: 20px;
    color: #666;
  }
  .no-filter-msg {
    font-size: 14px;
    margin-bottom: 10px;
    color: #666;
  }
}
</style>
