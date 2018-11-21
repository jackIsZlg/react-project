<template>
  <div>
    <div v-if="isShowBigImg">
      <div class='big-img-wrap' @click.self="changeIndex(0)">
        <div class="big-img-close" @click="changeIndex(0)">
          <i class="iconfont icon-close"/>
        </div>
        <div class="big-img-left" @click="changeIndex(-1)">
          <i class="iconfont icon-left arrow"/>
        </div>
        <div class="big-img-right" @click="changeIndex(1)">
          <i class="iconfont icon-right arrow"/>
        </div>
      </div>
      <div class="big-img-center">
        <div class="download">
          <a className="img-btn-download" :href="(currentImg[currentIndex].mainUrl||currentImg[currentIndex].ossUrl)+'?response-content-type=application/octet-stream'">
            <div class="icon-wrap"><i class="iconfont icon-download"/>下载</div>
          </a>
        </div>
        <img :src="currentImg[currentIndex].mainUrl||currentImg[currentIndex].ossUrl" >
        <!-- <div class="big-img" :style="{
          paddingTop:`${100*scale}%`,
          background: 'url('++') top/contain no-repeat'
        }" /> -->
      </div>
      <div class='big-img-mask' />
    </div>
    <div class="trend-detail" v-if="!showEmpty">
      <div class="chart-wrap">
        <div class="chart-pane">
          <div id="bigChart" class="chart no-border" />
        </div>
        <div class="chart-pane">
          <div style="position:relative;flex:1" class="sale-chart-wrap">
            <div class="chart-title" >{{ searchContent }}流行趋势分析</div>
            <div id="fashionChart" class="chart"/>
            <div v-if="isChangebar" class="chart no-charts fashion-no-charts">
              请选择环形图中的内容进行查看
            </div>
          </div>
          <div class="line" />
          <div style="position:relative;flex:1" class="sale-chart-wrap">
            <div v-if="type===2" class="changeType">
              <zy-select class="marginLeft10" :options="typeOptions" v-model="saleType" />
            </div>
            <div class="chart-title">{{ searchContent }}销售趋势分析</div>
            <div id="salesChart" v-if="type===2" class="chart" />
            <div v-else class="chart no-charts">
              暂不支持该属性的销售趋势分析
            </div>
          </div>
        </div>
        <div class="img-wrap">
          <div class="img-title">{{ searchContent }}流行款式推荐</div>
          <div class="img-content" v-if="fashionImgs.length">
            <div class="img-single-wrap" v-for="(item,index) in fashionImgs" :key="'fashion'+index" v-if="index<10" @click="showBigImg(index,1)">
              <div class="img-border">
                <div class="img-single-item" :style="{
                  'paddingTop':`${100*scale}%`,
                  background: 'url('+item.mainUrl+') top/contain no-repeat'
                }"/>
              </div>
            </div>
          </div>
          <div v-else class="no-imgs">
            暂无数据
          </div>
        </div>
        <div class="img-wrap">
          <div class="img-title">{{ searchContent }}热销爆款推荐
            <div v-if="type===2" class="changeType">
              <zy-select :options="typeOptions" v-model="saleType" />
            </div>
          </div>
          <div class="img-content" v-if="salesImgs.length && (type == 2 ||type == 3)">
            <div class="img-single-wrap" v-for="(item,index) in salesImgs" :key="'fashion'+index" v-if="index<10" @click="showBigImg(index,2)">
              <div class="img-border">
                <div class="img-single-item" :style="{
                  'paddingTop':`${100*scale}%`,
                  background: 'url('+item.ossUrl+') top/contain no-repeat'
                }"/>
              </div>
            </div>
          </div>
          <div v-else class="no-imgs">
            {{ (type === 2 ) ?'暂无数据' : '暂不支持该属性的热销爆款推荐' }}
          </div>
        </div>
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
export default {
  props: {
    filters: Array,
    detailBigChart: Object
  },
  data: function () {
    return {
      saleType: '全网数据',
      isShowBigImg: false,
      isChangebar: true, // 是否需要选择环形图
      currentImg: this.fashionImgs,
      currentIndex: 0,
      scale: 340 / 256,
      typeOptions: [
        '全网数据',
        '淘宝数据',
        '天猫数据'
      ],
      saleTypeObj: {
        '全网数据': '',
        '淘宝数据': 0,
        '天猫数据': 1
      },
      optionBack: {
        type: 'pie',
        radius: [0, '40%'],
        center: ['50%', '45%'],
        animation: false,
        tooltip: { show: false },
        label: {
          normal: { show: true,
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
          { value: 1, name: '返回', itemStyle: { color: '#f0f0f0', emphasis: { color: '#f0f0f0' } } }
        ]
      },
      showBack: false,
      rootName: '',
      searchContent: this.$route.query.content,
      searchType: Number(this.$route.query.type),
      content: this.$route.query.content,
      type: Number(this.$route.query.type),
      name: this.$route.query.name,
      rootType: [2, 14, 16], // 默认可钻去类型2 14 16
      detailChart: '',
      showEmpty: this.filters.length === 1 && JSON.stringify(this.filters[0]) === '{}',
      fashionChart: [],
      salesChart: [],
      fashionImgs: [],
      salesImgs: [],
      fashionDom: '',
      salesDom: '',
      barOption: {
        color: ['#1890FF', '#9ACC66', '#3EB27E', '#F7CB4A', '#F78D48', '#F35451', '#CE62D6', '#8954D4', '#5155B8', '#50B4F1'],
        title: {
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          x: 'center',
          y: 'bottom',
          data: ['2011年', '2012年']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        yAxis: {
          type: 'value'
        },
        xAxis: {
          boundaryGap: false,
          type: 'category',
          data: []
        },
        series: [

        ]
      },
      lineOption: {
        color: ['#1890FF', '#9ACC66', '#3EB27E', '#F7CB4A', '#F78D48', '#F35451', '#CE62D6', '#8954D4', '#5155B8', '#50B4F1'],
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          x: 'center',
          y: 'bottom'
        },
        grid: {
          top: '60',
          left: '0',
          right: '0',
          containLabel: true
        },
        toolbox: {

        },
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: [
          {
            type: 'value'
          },
          {
            type: 'value'
          }
        ],
        series: [
          {
          }
        ]
      }
    }
  },
  mounted () {
    this.getData(this.filters)
    this.$watch('filters', (n) => this.getData(n), { deep: true })
    this.$watch('fashionChart', (n) => this.renderFashionChart(n), { deep: true })
    this.$watch('salesChart', (n) => this.renderSalesChart(n), { deep: true })
    this.$watch('saleType', () => this.getSale(), { deep: true })
  },
  methods: {
    // 查询销售相关信息
    getSale () {
      this.getSaleData()
      this.getSaleImgs()
    },
    // 切换大图
    changeIndex (add) {
      if (add === 0) {
        this.isShowBigImg = false
        return
      }
      const tmp = this.currentIndex + add
      if (tmp > this.currentImg.length - 1 || tmp < 0) {
        this.isShowBigImg = false
        return
      }
      this.currentIndex = tmp
    },
    // 显示大图
    showBigImg (index, type) {
      this.currentImg = type === 1 ? this.fashionImgs : this.salesImgs
      this.currentIndex = index
      this.isShowBigImg = true
    },
    // 渲染大图
    renderBigChart () {
      const dom = this.$echarts.init(document.getElementById('bigChart'))
      if (!this.detailChart) {
        dom.showLoading()
        return
      }
      dom.hideLoading()
      const detailBigChart = JSON.parse(localStorage.detailBigChart)
      detailBigChart.toolbox.feature = {}
      detailBigChart.series[0].radius = ['50%', '72%']
      detailBigChart.series[0].center = ['50%', '45%']
      detailBigChart.series[0].selectedMode = 'single'
      detailBigChart.legend.x = 'center'
      detailBigChart.legend.y = 'bottom'
      detailBigChart.legend.orient = 'horizontal'
      if (this.detailChart) {
        // 颜色分析特殊处理
        if (this.type === 14) {
          detailBigChart.legend.data = this.detailChart.result.map((item, index) => item.color)
          detailBigChart.series[0].data = this.detailChart.result.map((item) => {
            return { needType: this.detailChart.type, labelLine: { length: 23 }, value: item.num, name: item.color, itemStyle: { borderColor: '#ccc', color: item.averageHue, emphasis: { color: item.averageHue } } }
          })
        } else {
          detailBigChart.legend.data = Object.keys(this.detailChart.result)
          detailBigChart.series[0].data = Object.keys(this.detailChart.result || {}).map((item) => { return { needType: this.detailChart.type, value: this.detailChart.result[item], name: item } })
        }
      }
      // 如果有content说明是颜色/品类/图案的子集 需要另加一个返回的圆圈
      if (this.searchContent || this.showBack) {
        detailBigChart.series[1] = this.optionBack
      } else {
        detailBigChart.series[1] = { type: 'pie', data: [] }
      }
      dom.off('click')
      dom.on('click', (params) => {
        dom.showLoading()
        if (params.componentType === 'series') {
          // 这里的返回只针对 rootType 里的三种类型
          if (params.name === '返回') {
            this.searchContent = ''
            this.showBack = false
            this.isChangebar = true
            this.searchType = this.type
            this.getData(this.filters)
          } else {
            this.isChangebar = false
            switch (params.data.needType) {
              case 'category':this.searchType = 3; this.showBack = false; break
              case 'color':this.searchType = 4; this.showBack = false; break
              case 'pattern':this.searchType = 6; this.showBack = false; break
              case 'root_category':
              case 'root_color':
              case 'root_pattern':this.showBack = true; this.rootName = params.name; break
              default:
                this.searchType = this.type; break
            }
            if (params.name === this.searchContent) {
              this.searchContent = this.rootName
              this.searchType = this.type
            } else {
              this.searchContent = params.name
            }
            if (this.showBack) {
              this.getDetailData(this.searchType)
            }
            this.getAllData(this.searchType)
          }
          dom.setOption(detailBigChart)
        }
        dom.hideLoading()
        // 重新渲染图表
      })
      dom.setOption(detailBigChart)
    },

    // 统一获取数据
    getAllData (type) {
      this.getfashionData(type)
      this.getSaleData(type)
      this.getSaleImgs(type)
      this.getfashionImgs(type)
    },

    // 初始化页面获取数据
    getData (n) {
      if (n.length === 1 && JSON.stringify(n[0]) === '{}') {
        this.showEmpty = true
        return
      }
      this.showEmpty = false
      this.getfashionData()
      this.getSaleData()
      this.getSaleImgs()
      this.getfashionImgs()
      this.getDetailData()
      // 防止echarts找不到dom结构
      setTimeout(() => this.renderBigChart(), 10)
    },

    // 渲染流行趋势图
    renderFashionChart () {
      this.fashionDom = this.$echarts.init(document.getElementById('fashionChart'))
      if (!this.fashionChart.length) {
        this.fashionDom.showLoading({ text: '暂无数据' })
        return
      }
      this.barOption.legend.data = this.fashionChart.map(item => { return item.type })
      this.barOption.xAxis.data = Object.keys(this.fashionChart[0] ? this.fashionChart[0].result : {})
      this.barOption.series = this.fashionChart.map(
        item => {
          return { areaStyle: {}, name: item.type, type: 'line', data: Object.values(item.result) }
        })
      this.fashionDom.setOption(this.barOption, { notMerge: true })
    },
    // 渲染销售趋势图
    renderSalesChart () {
      if (this.type !== 2) return
      this.salesDom = this.$echarts.init(document.getElementById('salesChart'))
      if (!this.salesChart.length) {
        this.salesDom.showLoading({ text: '暂无数据' })
        return
      }
      console.log(this.salesChart)
      this.lineOption.legend.data = ['销量', '销售额']
      this.lineOption.xAxis.data = Object.keys(this.salesChart[0] ? this.salesChart[0].result : {})
      this.lineOption.series = this.salesChart.map(
        (item, index) => {
          return {
            name: item.name === '销量' ? '销量' : '销售额',
            type: 'bar',
            yAxisIndex: item.name === '销量' ? 0 : 1,
            data: item.name === '销量'
              ? Object.values(item.result)
              : Object.values(item.result).map(item => (item / 100).toFixed(2))
          }
        })
      this.lineOption.yAxis = this.salesChart.map(item => {
        return { name: item.name === '销量' ? '销量/万件' : '销售额/元', type: 'value' }
      })
      this.salesDom.setOption(this.lineOption, { notMerge: true })
    },

    // 获取多条件指定标签的详细分析数据
    async getDetailData (type) {
      this.detailChart = ''
      let result = await this.$axios.post('/bi-api/trend/detail/list', {
        paramList: this.filters,
        type: type || this.type,
        content: this.searchContent
      })
      this.detailChart = result
      this.renderBigChart(false)
    },
    // 获取流行趋势
    async getfashionData (type) {
      this.fashionDom && this.fashionDom.showLoading()
      let result = await this.$axios.post('/bi-api/trend/detail/get-fashion', {
        paramList: this.filters,
        type: type || this.searchType,
        content: this.searchContent
      })
      if (this.fashionDom) {
        result.length ? this.fashionDom.hideLoading() : this.fashionDom.showLoading({ text: '暂无数据' })
      }
      this.fashionChart = result
    },
    // 获取销售趋势
    async getSaleData (type) {
      if (this.type !== 2 && this.type !== 3) return
      this.salesDom && this.salesDom.showLoading()
      let result = await this.$axios.post('/bi-api/trend/detail/get-sales', {
        paramList: this.filters,
        type: type || this.searchType,
        shopType: this.saleTypeObj[this.saleType],
        content: this.searchContent
      })
      this.salesChart = result
      if (this.salesDom) {
        result.length ? this.salesDom.hideLoading() : this.salesDom.showLoading({ text: '暂无数据' })
      }
    },
    // 热销流行图片
    async getfashionImgs (type) {
      this.fashionImgs = []
      let result = await this.$axios.post('/bi-api/trend/detail/img/fashion-list', {
        paramList: this.filters,
        type: type || this.searchType,
        content: this.searchContent
      })
      this.fashionImgs = result.resultList
    },
    // 热销爆款图片
    async getSaleImgs (type) {
      this.salesImgs = []
      let result = await this.$axios.post('/bi-api/trend/detail/img/sales-list', {
        paramList: this.filters,
        type: type || this.searchType,
        shopType: this.saleTypeObj[this.saleType],
        content: this.searchContent
      })
      this.salesImgs = result.resultList
    }
  }
}
</script>
<style lang="scss" scoped>
  .filter-wrap{
    padding: 40px 50px 30px;
    height: 284px;
    background-color: #f7f9fa
  }
  .chart-pane{
    padding: 0 50px;
    display: flex;
  }
  .changeType{
    position: absolute;
    top: 31px;
    right: 20px;
    z-index: 2
  }
  .sale-chart{
    border: solid 1px #d9d9d9;
    padding: 15px;
    flex:1;
    height: 345px;
    transition: 0.3s;
    &:hover{
      box-shadow: 2px 2px 2px #d9d9d9;
    }
  }
  .chart{
    margin-top: 20px;
    border: solid 1px #d9d9d9;
    padding: 15px;
    flex:1;
    height: 400px;
    transition: 0.3s;
    &:hover{
      box-shadow: 2px 2px 2px #d9d9d9;
    }
  }
  .no-border{
    border: 0;
    &:hover{
      box-shadow: 0 0 0  #d9d9d9;
      background-color: #fff
    }
  }
  .nothing{
    flex:1;
    padding: 15px;
  }
  .line{
    width: 20px;
  }
  .trend-detail{
    padding-bottom: 50px;
  }
  .no-filter-wrap{
  .no-filter-title{
    margin-top: 130px;
    margin-bottom: 50px;
    font-size: 20px;
    color: #666;
  }
  .no-filter-msg{
    font-size: 14px;
    margin-bottom: 10px;
    color: #666;
  }
}
.img-wrap{
  background-color: #ffffff;
  border: solid 1px #d9d9d9;
  margin: 45px 50px;
  padding:0 10px 10px;
  .img-title{
    position: relative;
    font-weight: 500;
    font-size: 16px;
    margin-left:5px;
    color: #333333;
    margin: 15px 0;
    text-align: left;
    .changeType{
      top: 0;
      right: 5px;
    }
  }
.img-content{
    display: flex;
    flex-wrap: wrap;
    .img-single-wrap{
      cursor: pointer;
      position: relative;
      box-sizing: border-box;
      width: 20%;
      padding: 5px;
      .img-border{
        background: #f5f5f5;
      }
    }
  }
}
.big-img-wrap,
.big-img-mask{
  position:fixed;
  bottom: 0;
  left: 0;
  right: 0;
  top:0;
  background-color: #d8d8d8;
  opacity: 0.5;
  z-index: 3
}
.big-img-wrap{
  z-index: 4;
  overflow: hidden;
  .big-img-right,
  .big-img-left{
    position: absolute;
    color: #000;
    top: 50%;
    transform: translateY(-50%);
    background-color: #fff;
    z-index: 8;
    cursor: pointer;
    width: 160px;
    height: 160px;
    line-height: 160px;
    color: #999;
    &:hover{
      background-color: #000;
    }
    &:active{
      background-color: #000;
    }
  }
  .arrow{
    height: 49px;
    font-size: 49px;
  }
  .big-img-left{
    left: 0;
  }
  .big-img-right{
    right: 0;
  }
}
.big-img-center{
    width: 588px;
    height: 800px;
    margin: 0 auto;
    background-color: #ffffff;
    padding: 0 25px 25px;
    position: fixed;
    left: 0;
    right: 0;
    z-index: 9;
    top: 20px;
    img{
      max-width: 100%;
      height: 725px;
    }
    .download{
      text-align: right;
      padding: 15px 25px;
    .icon-wrap{
      cursor: pointer;
        line-height: 32px;
        text-align: center;
        display: inline-block;
        width: 75px;
        height: 32px;
        color: #666666;
        font-size: 14px;
        background-color: #f5f5f5;
        border: solid 1px #ebebeb;
    }
    }
  }
  .icon-close{
    cursor: pointer;
    width: 70px;
    height: 70px;
    top: 12px;
    font-size: 36px;
    right: 32px;
    position: absolute;
    line-height: 71px;
    &:hover{
      background-color: #999999;
    }
  }

  .no-charts,
  .no-imgs{
    padding: 20px;
    font-size: 14px;
    color: #666;
  }
  .no-charts{
    position: relative;
    line-height: 345px;
    // padding: 0;
    padding: 0 20px 30px;
  }
   .fashion-no-charts{
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1;
    transition: all 0.5s;
    background-color: #fff;
  }
  .chart-title{
      position: absolute;
      top: 35px;
      left:15px;
      line-height: 20px;
      font-size: 14px;
      color: #333333;
      font-weight: 500;
    }
</style>
