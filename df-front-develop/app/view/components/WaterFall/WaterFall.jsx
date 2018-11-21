import base from '../../common/baseModule'
import { LayoutCalc } from './LayoutCalc'

// 瀑布流单元块
import {
  WFItemIns,
  WFItemIns2,
  WFItemInsHistory,
  WFItemInsLike,
  WFItemInsFolder,
  WFItemRunway,
  WFItemRunwayFolder,
  WFItemRunwayHistory,
  WFItemCustomSearch,
  WFItemOrderMeeting,
  WFItemOrderFolder,
  WFItemRunwayHome,
  WFItemBrand,
  WFItemUpload,
  WFItemCollectLike
} from './WFItem'
import {
  WFItemInsOwnerSub,
  WFItemInsOwner,
  WFItemRunwayOwner,
  WFItemRecommendOwner
} from './WFItemOwner'
import { WFItemRunwayBoard } from './WFItemBoard'
import { WFItemUserInfo } from './WFItemUserInfo'
import { WFItemIndexBanner } from './WFItemBanner'
import { Article } from './WFitemArticle'
// 博客详情弹出层
import { BlogCover } from '../Blog/Blog'
// 精选集弹窗
import SelectPop from '../SelectPop/SelectPop'
// 举报弹窗
import ReportPop from '../ReportPop/ReportPop'
// 瀑布流单元辅助信息
import { wfTypeData } from '../../common/module/eventModule'
// 瀑布流公共辅助元素
import {
  GetData,
  NoResult,
  Loading,
  LoadMore,
  ToBottom,
  ToTop,
  TimeLine,
  FootTimeLine
} from './WaterFallBase'
// 分页器
import Pagination from '../../components/Pagination/Pagination'
// 上传
import Upload from '../Upload/Upload'

const platformList = {
  1: 'ins',
  2: 'runway'
}

/*
 * 瀑布流
 */
class WaterFall extends React.Component {
  constructor(props) {
    super(props)
    // 默认数据
    this.state = {
      _firstMasonry: true, // 布局组件，首次布局与重新布局flag
      queryData: {
        q: this.props.q || '', // 查询条件，搜索字段
        pageSize: this.props.pageSize || 30, // 每次请求数据，默认30
      },
      start: 0, // 后台记录使用
      page: 0, // 下一页
      totalPage: 0, // 翻页总页数

      columnNum: 0, // 列数
      columnWidth: this.props.columnWidth || 288, // 列宽
      initColumnHeight: this.props.initColumnHeight || [0], // 瀑布流初始高度
      index: 0, // 已添加数量
      waterFallData: [], // 瀑布流全部数据
      waterFallExtraDataTotal: 0, // 瀑布流额外数据(时间分割线，广告位...)
      waterFallTotal: 0, // 数据总数，
      wfHeight: 0, // 当前瀑布流高度

      showResultCount: this.props.showResultCount || false, // 是否显示实际总数，默认false
      resultCount: 0, // 实际总数，精选操作会改变该值

      statusFlag: 1, // 瀑布流状态 ，1：初次加载，2：初次查询无结果，3：加载中，4：加载完成,等待滑动，5：加载完成,触底
      historyEndFlag: false, // 足迹状态
      wfType: this.props.wfType || 'blog', // 单元块类型
      noFilter: this.props.noFilter !== false, // 原顶部排序方式（筛选），默认 true

      initContainerTop: 0, // 容器初始Top
      initContainerWidth: 0, // 容器初始width

      scrollTop: 0, // 滚动距离
      scrollTopPre: 0,
      containerTimeStamp: 0, // 定时任务

      loadType: this.props.loadType || 1, // 1:下拉加载 2:分页器加载，3：点击加载，默认1
      isScroll: false, // 滚动加载开启状态
      scrollFlag: false, // 滚动事件处理状态
      noBottom: this.props.noBottom || false, // 是否需要触底组件，默认false
      toTop: false, // 置顶按钮状态
      isBlogDetail: true, // 是否展示博客详情，默认true
      isFolderBtn: true, // 是否需要精选按钮,默认true
      isCancelFolder: this.props.isCancelFolder || false, // 是否需要取消精选按钮,默认false
      msnryCount: 0, // 布局插件计算布局数量，避免数量不变时重复布局操作造成资源浪费
      msnryCountOriginal: 0, // 布局插件计算布局'前'数量

      showItemStart: 0, // 显示节点开始位置
      showItemEnd: 0, // 显示节点开始位置
      resizeFlag: false, // 布局状态

      todayTime: new Date((new Date()).toDateString()).getTime(), // 今日时间
      _time: '', // 处理时间轴临时数据
      searchTime: 0, // 单词查询时间
      isLogin: false,

      extraData: {}
    }
  }

  // 第一次渲染前调用
  componentWillMount() {
    // this.isLogin();
    this.init()
  }

  // 第一次渲染后调用
  componentDidMount() {
    // 置顶按钮消隐
    base.renderToTopButton(false, this._calcShowItem())
    // this.renderToTop()
    // this.toTopShowHide()

    // 添加滚动事件，定时监听，获取初始top
    let pos = this.getContainerPos()
    console.log('初始位置：', pos)
    this.state.initContainerTop = pos.t
    this.state.initContainerWidth = pos.w

    this.containerTimeOut()

    // 获取列数
    this._columnNum(pos.w)

    // 获取数据
    this._initGetData()
  }

  // 监听props
  componentWillReceiveProps(nextProps) {
    // 全选
    if (nextProps.isSelectAll) {
      this.handleSelectAll(nextProps.isSelectAll)
      return
    }

    // 取消精选结束 or 移动
    if (nextProps.isCleanUp) {
      console.log('整理数据')
      this.handleCleanUp(nextProps.isCleanUp)
      return
    }

    // 进入编辑精选
    if (this.state.wfType !== 'folderSelect' && nextProps.wfType === 'folderSelect') {
      this.setState({
        wfType: 'folderSelect'
      })
      nextProps.getDataSuccess && nextProps.getDataSuccess(this.state)
    }

    // 退出编辑精选
    if (this.state.wfType === 'folderSelect' && nextProps.wfType !== 'folderSelect') {
      this.setState({
        wfType: nextProps.wfType
      })
      return
    }
    // 进入编辑精选
    if (this.state.wfType !== 'runwaySelect' && nextProps.wfType === 'runwaySelect') {
      this.setState({
        wfType: 'runwaySelect'
      })
      nextProps.getDataSuccess && nextProps.getDataSuccess(this.state)
    }

    // 退出编辑精选
    if (this.state.wfType === 'runwaySelect' && nextProps.wfType !== 'runwaySelect') {
      this.setState({
        wfType: nextProps.wfType
      })
      return
    }

    // 强制重置瀑布流
    if (nextProps.reset) {
      this._reset()
      return
    }

    // 正常流程，重置瀑布流
    if (nextProps.dataUrl !== this.props.dataUrl
      || (nextProps.q || '') !== this.state.queryData.q
      || nextProps.wfType !== this.state.wfType) {
      console.log('重置瀑布流')
      this.state.queryData.q = nextProps.q || ''
      this.state.wfType = nextProps.wfType
      this._reset()
    }
  }

  // 每次渲染后调用
  componentDidUpdate() {
    // 单元数量变化才引起重新布局
    // console.log(this.state.msnryCount, this.state.msnryCountOriginal);
    if (this.state.msnryCount === this.state.msnryCountOriginal) {
      // console.log('单元数量未变化');
      return
    }

    /* 瀑布流配置 */
    if (this.state._firstMasonry) {
      console.log('首次布局')
      this.state._firstMasonry = false

      this._initLayout(this.state.columnNum)

      this.calcWFItem(this.state.msnryCountOriginal, this.state.msnryCount)
    } else {
      console.log('重新布局')
      // 重新计算列数
      this.calcWFItem(this.state.msnryCountOriginal, this.state.msnryCount)
    }
    this.state.msnryCountOriginal = this.state.msnryCount
  }

  // 组件被卸载,清除定时器
  componentWillUnmount() {
    this.state.containerTimeStamp = -1
  }

  // 获取单元块宽度
  getGutter() {
    return this.state.columnWidth === 288 ? 20 : 10
  }

  // 请求数据
  async getData(callback, loop) {
    if (this.props.beforeLoadPage) {
      const result = await this.props.beforeLoadPage(this.state.page)
      if (!result) {
        this.setState({ statusFlag: 6 })
        return
      }
    }
    console.log('获取数据')
    // 触发渲染，显示loading
    this.state.statusFlag !== 1 && this.setState({
      statusFlag: 3
    })

    // 将瀑布流开始请求的状态暴露到组件外
    this.props.startRequest && this.props.startRequest('start', this.requestType)

    let self = this
    let _queryData = self.state.queryData

    // _queryData.boundaryId = ''
    // 分页数据必备，前一批数据最后一项的id，start开始项
    // if (self.state.page !== 0
    //   && self.state.wfType !== 'owner'
    //   && self.state.wfType !== 'insOwner'
    //   && self.state.wfType !== 'orderMeeting'
    //   && self.state.wfType !== 'orderFolder'
    //   && self.state.wfType !== 'brandSelected'
    //   && self.state.wfType !== 'brandImage'
    // ) {
    //   _queryData.boundaryId = self.state.waterFallData[self.state.waterFallTotal - 1].id
    // }

    // if (this.state.loadType === 2) {
    _queryData.start = self.state.page * self.state.queryData.pageSize
    // } else {
    //     // start为0，则赋0，非0则累加pageSize
    //     console.log(self.state.page, self.state.start, self.state.queryData.pageSize)
    //     _queryData.start = (self.state.page === 0 ? 0 : self.state.start + self.state.queryData.pageSize);
    // }

    // 灵感页排序，首次请求增加decrease参数
    if (self.state.page === 0 && self.state.wfType === 'index') {
      _queryData.decrease = self.props.decrease || 0
    }

    // 我的ins关注列表，增加pageSize参数
    if (self.state.wfType === 'insOwner') {
      _queryData.pageNo = self.state.page + 1
      delete _queryData.start
    }

    let startSearchTime = new Date().getTime()

    base.ajaxList.basic({
      url: base.baseUrl + self.props.dataUrl,
      type: 'GET',
      data: _queryData
    }, (d) => {
      if (this.requestType === 0) {
        // 将请求得到的标签数据暴露到组件外
        this.props.dealDataOfWaterFall && this.props.dealDataOfWaterFall(d)
      }
      if (d.result && d.result.param) {
        this.setState({
          nextPageParam: d.result.param.nextPageParam, // 保存额外分页参数
        })
      }

      // 计算查询时间
      let endSearchTime = new Date().getTime()
      let searchTime = endSearchTime - startSearchTime
      let result = ''
      let _total = 0
      let _status_flag = 4
      let isComplete = false// 数据完整性

      // 防止后端不给数据
      if (d.result) {
        result = ('resultList' in d.result) ? d.result.resultList : d.result
        _total = result ? result.length : 0
        self.state.totalPage = d.result.totalPageCount || 0
      }
      // 处理并存储数据
      if (_total || (this.state.wfType === 'folder' && !d.result)) {
        // 准备数据
        let preData = self.dataPreProcessing(result)
        let _temp = self.state.waterFallData.concat(preData.data)
        let _waterFallTotal = self.state.waterFallTotal + preData.data.length
        let _page = self.state.page + 1
        let idList = []

        for (let i = 0; i < preData.data.length; i++) {
          idList.push(preData.data[i].id)
        }
        if (self.props.recommendContent) {
          let content = {
            recommend_result: idList.join(',')
          }

          for (let key in self.props.recommendContent) {
            content[key] = self.props.recommendContent[key]
          }

          base.ajaxList.addPoint(3200001, content)
        } else if (self.props.bloggerSearchContent) {
          let content = {
            search_result: idList.join(',')
          }

          for (let key in self.props.bloggerSearchContent) {
            content[key] = self.props.bloggerSearchContent[key]
          }

          base.ajaxList.addPoint(3100002, content)
        }

        if (this.state.wfType !== 'owner' && this.state.wfType !== 'followOwner' && this.state.wfType !== 'insOwner' && this.state.wfType !== 'article' && this.state.wfType !== 'popularity') {
          for (let i = 0; i < preData.data.length; i++) {
            idList.push(preData.data[i].id)
          }
          base.eventCount.add(1041, {
            '来源页面': wfTypeData[this.state.wfType].name,
            '浏览Id列表': idList,
            '用户Id': base.LS().userId
          })
        }


        isComplete = preData.isComplete
        self.setState({
          waterFallData: _temp,
          waterFallTotal: _waterFallTotal,
          resultCount: (d.result && d.result.resultCount) || _waterFallTotal,
          page: _page,
          searchTime,
          start: d.result && d.result.start,
          showItemEnd: _waterFallTotal
        }, () => {
          // 回调，数据请求成功
          self.props.getDataSuccess && self.props.getDataSuccess(self.state)
        })
      }

      // 返回数据为空 or 接口异常，数据异常
      if (!isComplete) {
        _status_flag = self.changeWFStatus(_status_flag)

        // 数据加载完，or无数据 则移除滚动事件
        self.removeScroll()
      }

      // 修改瀑布流状态
      self.setState({
        statusFlag: _status_flag,
      }, () => {
        // 等待加载过程,loop为true,则加载完全部数据，在精选集全选操作中使用
        (loop && _status_flag === 4) ? self.getData(callback, loop)
          : (callback && callback(_status_flag))
      })
      // 将瀑布流请求完毕的状态暴露到组件外
      this.props.startRequest && this.props.startRequest('end', this.requestType)
      // 重置请求类型
      this.requestType = 0
    }, (d) => {
      console.log('请求结果', d)
      if (d.errorDesc) {
        this.setState({
          placeholderErrorMsg: d.errorDesc
        })
        if (this.props.onDataLoadError) {
          this.props.onDataLoadError && this.props.onDataLoadError(d.errorDesc)
        }
      }
      self.state.statusFlag = -1 // 获取数据失败
    })
  }

  // 获取容器top
  getContainerPos() {
    let pos = this.refs.container.getBoundingClientRect()
    return {
      t: pos.top,
      w: pos.width
    }
  }

  isLogin() {
    let self = this
    base.request({
      type: 'GET',
      url: `${base.baseUrl}/users/login-state`
    }).done((d) => {
      if (d.success) {
        d.result * 1 !== 0 && self.setState({
          isLogin: true
        })
      }
    }).fail()
  }


  // 初始化
  init() {
    // 增加history监听,默认监听
    this.props.popStateFlag !== false && this._popState()
  }

  // 初次获取数据
  _initGetData() {
    console.log('瀑布流初始化')
    let self = this
    // 初次获取数据
    self.getData((status) => {
      // 配置参数，只请求一次
      if (self.props.oneGetData) {
        // 回调参数为4（可继续加载数据），强制修改瀑布流状态为结束
        self.setState({
          statusFlag: status === 4 ? 5 : status
        })
        return
      }

      let { changeStatus } = self.props
      changeStatus && changeStatus()
      // 容器高度还原
      // self.refs.container.style.minHeight = 'auto';
      // 开启下拉加载
      self.state.loadType === 1 && self.startScroll()
    })
  }

  // 初始化布局模块
  _initLayout(columnNum) {
    this.layoutCalc = new LayoutCalc({
      columnWidth: this.state.columnWidth,
      itemSelector: '.water-fall-item', // 要布局的网格元素
      gutter: this.getGutter(),
      columnNum,
      initColumnHeight: this.state.initColumnHeight,
      columnHeight: new Array(columnNum).fill(0), // 列高默认0
    })
  }


  // 重置布局模块
  _resetLayout(columnNum) {
    if (typeof this.layoutCalc !== 'object') {
      return
    }
    if (!('reset' in this.layoutCalc)) {
      return
    }
    this.layoutCalc.reset({
      columnWidth: this.state.columnWidth,
      itemSelector: '.water-fall-item', // 要布局的网格元素
      gutter: this.getGutter(),
      columnNum,
      initColumnHeight: this.state.initColumnHeight,
      columnHeight: new Array(columnNum).fill(0), // 列高
    })
  }

  // 计算列数 并 触发启动布局
  _calcColumnNum(w) {
    let width = w || this.getContainerPos().w
    return Math.floor(width / this.state.columnWidth)
  }

  _columnNum(w) {
    let _columnNum = this._calcColumnNum(w)
    _columnNum !== this.state.columnNum && this.setState({
      columnNum: _columnNum
    })
  }


  // 计算单元块translate
  calcWFItem(start, end) {
    let _list = this.state.waterFallData

    console.log('计算区间', start, end)

    for (let i = start; i < end; i++) {
      let item = _list[i]
      let w
      let h

      // 计算该节点宽高
      if (!item.nodeWidth) {
        let el = this.refs.container.getElementsByClassName('water-fall-item')[i - this.state.showItemStart]

        let node = this.layoutCalc.getElWH(el)
        w = node.w === this.state.initContainerWidth ? -1 : node.w
        h = node.h
        item.nodeWidth = w
        item.nodeHeight = h
      } else {
        w = item.nodeWidth
        h = item.nodeHeight
      }

      let { x, y, colIndex } = this.layoutCalc.calc(w, h)

      item.translateX = x
      item.translateY = y
      item.colIndex = colIndex
      // _consoleData[i] = {
      //     'width': w,
      //     'height': h,
      //     'translateX': x,
      //     'translateY': y
      // }
    }
    this.setState({
      waterFallData: _list,
      wfHeight: this.layoutCalc.getMaxHeight()
    }, () => {
      // 布局完成
      typeof this.props.onLayoutOut === 'function' && this.props.onLayoutOut()
    })
  }


  // 处理瀑布流新状态与当前状态
  changeWFStatus(status) {
    // 瀑布流状态为2,5,-1,保持旧值
    if (this.state.statusFlag !== 2
      && this.state.statusFlag !== 5
      && this.state.statusFlag !== -1) {
      return (this.state.statusFlag === 1 && this.state.page === 0) ? 2 : 5
    }

    return status
  }

  // 滑动加载数据
  appendDetect() { // 添加瀑布流单元
    let self = this
    let _el_height = this.refs.container.offsetHeight // 瀑布流高度
    let screenH = document.documentElement.clientHeight
    // 加载等待过程
    if (this.state.statusFlag === 4
      && _el_height - screenH <= self.state.scrollTop + screenH) {
      // 未登陆 只可访问前三页
      // if (self.state.page >= 3) {
      //     scrollTop !== self.state.scrollTop && base.login();
      //     return
      // }

      // 为登陆 可以继续访问 但是要一直提示登陆
      if (self.state.page >= 3) {
        !self.state.isLogin && this.isLogin()
      }

      if (self.props.recommendContent) {
        base.ajaxList.addPoint(3200002, self.props.recommendContent)
      } else if (self.props.bloggerSearchContent) {
        base.ajaxList.addPoint(3100003, self.props.bloggerSearchContent)
      }
      self.getData()// 请求数据
    }
  }

  // 数据预处理
  dataPreProcessing(data) {
    let self = this
    let newData = []
    let _length = data ? data.length : 0
    let item

    // 精选集
    if (_length === 0) {
      // 额外数据填充，目前动态页、关注页
      let __key = `${0 + self.state.waterFallTotal}`
      if (self.props.extraData && self.props.extraData.hasOwnProperty(__key)) {
        let item = self.props.extraData[__key]
        let { width, height } = self.preImgWH(item.width, item.height)
        // 默认按照单列宽计算，*size列宽
        item.id = base.getRandomId()
        item.width = width * item.size + 20 * (item.size - 1)
        item.height = height * item.size
        newData.splice(__key * 1, 0, item)
      }
    }

    for (let i = 0; i < _length; i++) {
      item = data[i]
      // 额外数据填充，目前动态页、关注页
      let __key = `${i + self.state.waterFallTotal}`
      if (self.props.extraData && self.props.extraData.hasOwnProperty(__key)) {
        let item = self.props.extraData[__key]
        let { width, height } = self.preImgWH(item.width, item.height)
        // 默认按照单列宽计算，*size列宽
        item.id = base.getRandomId()
        item.width = width * item.size + 20 * (item.size - 1)
        item.height = height * item.size
        newData.splice(__key * 1, 0, item)
      }

      // 足迹时间一个月，强制截断数据
      if (self.state.historyEndFlag) {
        break
      }
      // 根据单元块类型处理数据
      switch (self.state.wfType) {
        case 'index':
        case 'blog':
        case 'folder':
        case 'folderSelect':
        case 'runwaySelect':
        case 'followBlog':
        case 'folderShare':
        case 'folderPublic':
        case 'ownerId':
        case 'history':
        case 'classify':
        case 'recommendBlog':
        case 'customSearch':
        case 'collectPic':
        case 'pinterest':
          // 足迹模块不包含足迹时间，跳出
          if (this.state.wfType === 'history' && !item.footprintTime) {
            break
          }

          // 订阅模块不包含postTime，跳出
          if (this.state.wfType === 'followBlog' && !item.postTime) {
            break
          }

          // 处理时间线
          if (self.props.timeLine) {
            let time
            self.props.timeLine === 'history' && (time = item.footprintTime)
            self.props.timeLine === 'followBlog' && (time = item.postTime)

            let _timeTemp = base.dealTime(time)

            // 足迹事件超过一个月，截断
            if (self.state.wfType === 'history' && base.isMonth(self.state.todayTime, time)) {
              self.state.statusFlag =
                (self.state.waterFallTotal === 0 && newData.length === 0) ? 2 : 5

              console.log('足迹数据截断')

              self.state.statusFlag === 5 && newData.push({
                id: 'time-end',
                isBlogCover: false,
                wfItemType: 'end'
              })

              self.state.historyEndFlag = true
              break
            }

            // 时间对比，插入时间轴
            if (self.state._time !== _timeTemp) {
              newData.push({
                id: `timeline-${base.getRandomId()}`,
                wfItemType: 'timeline',
                postTime: time,
                isBlogCover: false,
                time: _timeTemp
              })
            }
            self.state._time = _timeTemp
          }

          // 订阅模块，导入ins关系模块特殊处理
          // if (this.state.wfType === 'followBlog'
          //     && i === 0
          //     && self.state.waterFallData.length === 0) {
          //     newData.push({
          //         id: 'userInfo',
          //         wfItemType: `userInfo`,
          //         isBlogCover: false
          //     });
          //     // break;
          // }

          // 订阅模块，秀场部分特殊处理
          if (this.state.wfType === 'followBlog' && item.platformId === 2) {
            newData.push({
              id: item.showId,
              designerId: item.designerId,
              showImgList: item.showImgList,
              city: item.city,
              season: item.season,
              designerName: item.designerName,
              wfItemType: platformList[2],
              postTime: item.postTime,
              isBlogCover: false
            })
            break
          }

          // 异常数据跳出本次循环
          if (!item.width) {
            break
          }

          // 精选集全选操作后，select默认赋true
          if ((this.state.wfType === 'folderSelect' || this.state.wfType === 'runwaySelect')
            && this.props.clickAllSelect) {
            item.select = true
          }

          // 图片宽高自适应
          let imgWH = self.preImgWH(item.width, item.height)

          if (this.state.wfType === 'runwaySelect' && !item.blogger) {
            newData.push({
              id: item.id,
              mediaUrl: item.mediaUrl,
              bloggerId: item.bloggerId,
              width: imgWH.width,
              height: imgWH.height,
              averageHue: item.averageHue || '',
              showId: item.showId,
              viewCount: item.viewCount,
              wfItemType: 'runway',
              select: item.select || false
            })
            break
          }

          // 自定义搜索模块特殊处理
          if (this.state.wfType === 'customSearch') {
            newData.push({
              id: item.id,
              mediaUrl: item.mediaUrl,
              width: imgWH.width,
              height: imgWH.height,
              postTime: item.postTime,
              bloggerId: item.blogger.id,
              nickname: item.blogger.nickname,
              headImg: item.blogger.headImg,
              averageHue: item.averageHue || '',
              favoriteId: item.favoriteId || 0,
              wfItemType: platformList[`${item.blogger.platformId}`] || 'ins',
              bloggerTags: item.bloggerTags || [],
              featureTags: item.featureTags || [],
              textContent: item.textContent || '',
              platformId: item.blogger.platformId
            })
            break
          }

          newData.push({
            id: item.id,
            mediaUrl: item.mediaUrl,
            width: imgWH.width,
            height: imgWH.height,
            postTime: item.postTime,
            showId: item.showId,
            bloggerId: item.blogger.id,
            nickname: item.blogger.nickname,
            headImg: item.blogger.headImg,
            userId: item.blogger.bloggerPlatformId,
            averageHue: item.averageHue || '',
            favoriteId: item.favoriteId || 0,
            footprintTime: item.footprintTime || '',
            wfItemType: platformList[`${item.blogger.platformId}`] || 'ins',
            shared: item.shared || 1,
            select: item.select || false,
            platformId: item.blogger.platformId,
            folderName: item.folderName || '',
            folderId: item.folderId || this.props.folderId * 1 || 0
          })
          // console.log(`newData${i}`, newData)
          break
        case 'owner':
        case 'insOwner':
        case 'followOwner':
          // 非库内博主无ID，使用13位时间戳代替
          newData.push({
            id: item.id || base.getRandomId(),
            inLib: !!item.id,
            nickname: item.nickname,
            headImg: item.headImg,
            fansNum: item.fansNum,
            postNum: item.postNum,
            isVerified: item.isVerified || 0,
            followId: item.followId || 0,
            wfItemType: platformList[`${item.platformId}`] || 'ins',
            source: item.source || 1, // 来源
            intro: item.introduction || '', // 博主简介
            spiderStatus: item.hasOwnProperty('spiderStatus') ?
              item.spiderStatus : 8, // 爬虫状态，默认8，正常爬取
            hasPost: item.hasPost || false, // 是否拥有图片状态
            fetchStatus: !!item.fetchStatus // 是否爬取图片
          })
          break
        case 'popularity':
          // 人气100
          newData.push({
            id: item.bloggerId,
            inLib: !!item.id,
            nickname: item.nickname,
            headImg: item.headImg,
            fansNum: item.fansNum,
            postNum: item.postNum,
            isVerified: item.isVerified || 0,
            followId: item.followId || 0,
            wfItemType: platformList[`${item.platformId}`] || 'ins',
            source: item.source || 1, // 来源
            intro: item.introduction || '', // 博主简介
            spiderStatus: item.hasOwnProperty('spiderStatus') ?
              item.spiderStatus : 8, // 爬虫状态，默认8，正常爬取
            hasPost: item.hasPost || false, // 是否拥有图片状态
            fetchStatus: !!item.fetchStatus // 是否爬取图片
          })
          break
        case 'runwayDetail':
          if (!item.mediaUrl) {
            break
          }

          // 换算新宽高
          let runwayHomeImgWH = self.preImgWH(item.width, item.height)

          newData.push({
            id: item.id,
            mediaUrl: item.mediaUrl,
            width: runwayHomeImgWH.width,
            height: runwayHomeImgWH.height,
            averageHue: item.averageHue || '',
            showId: item.showId,
            wfItemType: 'runway'
          })

          break

        // 秀场详情-品牌详情-秀场列表
        case 'brandShow':
          if (!item.mediaUrl) {
            break
          }
          // 换算新宽高
          let newImgWH = self.preImgWH(1200, 1800)
          newData.push({
            id: item.id,
            designer: '',
            city: item.city,
            season: item.season,
            designerId: this.props.designerId,
            showId: item.id,
            mediaUrl: item.mediaUrl,
            width: newImgWH.width,
            height: newImgWH.height,
            averageHue: item.averageHue || '',
            wfItemType: 'runway'
          })
          break

        // 秀场首页
        case 'runwayHomePage':
          if (!item.mediaUrl) {
            break
          }

          // 换算新宽高
          let runwayImgWH = self.preImgWH(item.width, item.height)

          newData.push({
            id: item.id,
            designer: item.designer,
            city: item.city,
            runwayTime: item.runwayTime,
            season: item.season,
            designerId: item.designerId,
            showId: item.showId,
            mediaUrl: item.mediaUrl,
            width: runwayImgWH.width,
            height: runwayImgWH.height,
            averageHue: item.averageHue || '',
            wfItemType: 'runway'
          })

          break
        case 'article':
          newData.push({
            id: item.id,
            author: item.author,
            picture: item.picture,
            publishTime: item.publishTime,
            title: item.title,
            wfItemType: 'article'
          })
          break
        case 'orderFolder':
        case 'orderMeeting':
        case 'brandSelected':
        case 'brandImage':
          // 图片宽高自适应
          let imageWH = self.preImgWH(item.width, item.height)
          newData.push({
            id: item.id,
            mediaUrl: item.mediaUrl,
            width: imageWH.width,
            count: item.count || 0,
            height: imageWH.height,
            postTime: item.postTime,
            brand: item.brand,
            season: item.season,
            category: item.category,
            postId: item.postId,
            time: item.time,
            averageHue: item.averageHue || '',
            wfItemType: 'ins'
          })
          break
        default:
          break
      }

      // 为每条数据添加唯一标示
      let last = newData[newData.length - 1]
      last.unique = `${last.id}+${self.state.page}`
      // 为每条数据添加来源Id--专门为图片详情页添加
      last.sourceId = this.props.sourceId || 0
    }

    // 特殊处理，订阅页面，请求参数增加postTime
    if (this.state.wfType === 'followBlog') {
      let len = newData.length
      this.state.queryData.postTime = newData[len - 1].postTime
    }

    // console.log('extraData1', this.state.extraData);
    // if (this.state.wfType === 'folder') {
    //     this.setState({
    //         extraData: newData[0]
    //     }, () => {
    //         console.log('extraData2', this.state.extraData)
    //     });
    // }


    return {
      data: newData,
      // isComplete: data.length >= self.state.queryData.pageSize
      isComplete: data.length > 0
    }
  }

  // 预处理图片宽高
  preImgWH(w, h) {
    let _scale = this.state.columnWidth / w
    return {
      width: w * _scale,
      height: h * _scale
    }
  }

  // 定时任务，监听容器的width、top
  containerTimeOut() {
    // 约定containerTimeStamp=-1时，组件已被卸载
    if (this.state.containerTimeStamp === -1) {
      return
    }

    // rAF,40帧后执行,16.67ms*40
    if (this.state.containerTimeStamp < 40) {
      this.state.containerTimeStamp++
      requestAnimationFrame(() => {
        this.containerTimeOut()
      })
      return
    }

    this.state.containerTimeStamp = 0

    let { w, t } = this.getContainerPos()
    let scrollTop = this.state.initContainerTop - t

    // 滚动事件
    this.scrollEvent(scrollTop)

    // resize事件
    this.resizeEvent(w)

    // 重新开启定时任务
    this.containerTimeOut()
  }

  // 滚动事件
  scrollEvent(scrollTop) {
    // 滚动事件,每滚动100px,触发瀑布流单元添加
    // if (Math.abs(scrollTop - this.state.scrollTop) < 80) {
    //     return;
    // }

    // 下拉触发
    if (this.state.isScroll) {
      (scrollTop - this.state.scrollTop >= 0) && this.appendDetect(scrollTop)
    }
    // 滚动定时任务，不受isScroll影响
    this.state.scrollTop = scrollTop
    this.state.scrollFlag || this.scrollTimeOut()
  }

  scrollTimeOut() {
    let self = this
    let scrollTop = self.state.scrollTop
    self.state.scrollFlag = true
    setTimeout(() => {
      // 节点替换
      if (Math.abs(scrollTop - self.state.scrollTopPre) > 500) {
        self.state.scrollTopPre = scrollTop
        self._calcShowItem()
      }
      self.state.scrollFlag = false
    }, 10)
  }

  startScroll() {
    this.state.isScroll = true
    console.log('添加滚动事件')
  }

  removeScroll() {
    this.state.isScroll = false
    console.log('移除滚动事件')
  }

  // 计算显示区间
  _calcShowItem(cb) {
    let calcWFData = this.state.waterFallData
    let len = calcWFData.length
    let maxNum = this.state.queryData.pageSize * 3

    // 分页器模式跳出
    if (this.state.loadType === 2) {
      return
    }

    // 节点数少于指定数，不执行显示区间调整（数量少），提升性能
    if (len < maxNum) {
      return
    }

    // 设置保留高度
    let currentScrollTop = this.state.scrollTop
    let sentryScrollTop = Math.max(currentScrollTop - 2500 - this.state.initContainerTop, 0)

    // 根据当前滚动高度预估开始项，非从第0项开始循环查找
    let showItemStart = this.estimateStartItem(sentryScrollTop)
    let showItemEnd = Math.min(len, showItemStart + maxNum)

    // 显示区间不变
    if (this.state.showItemStart === showItemStart
      && this.state.showItemEnd === showItemEnd) {
      return
    }

    console.log('调整显示', showItemStart, showItemEnd)

    // 更新显示区间
    this.setState({
      showItemStart,
      showItemEnd
    }, () => {
      cb && cb()
    })
  }

  // 预估显示区间调整开始项
  estimateStartItem(sentryScrollTop) {
    let calcWFData = this.state.waterFallData
    let len = calcWFData.length
    let maxNum = this.state.queryData.pageSize * 3
    let scale = (sentryScrollTop / this.state.wfHeight).toFixed(4) // 高度占比
    let showItemStart = Math.floor(scale * this.state.waterFallTotal) // 预算当前项
    let flag = calcWFData[showItemStart >= len ? len - 1 : showItemStart].translateY >= sentryScrollTop
    // 检测当前项是否满足,若当前项已超出范围，取最后一项
    let findItem = () => {
      if (showItemStart <= 0) {
        return 0
      }

      if (showItemStart >= len) {
        return Math.max(len - maxNum, 0)
      }

      // 根据当前项前后浮动列数单位继续查找
      console.log(flag, '滚动高度', sentryScrollTop, '当前高度', calcWFData[showItemStart].translateY, showItemStart)

      showItemStart += this.state.columnNum * (flag ? -1 : 1)

      if ((calcWFData[showItemStart].translateY >= sentryScrollTop) ^ flag) {
        console.log(!flag, '滚动高度', sentryScrollTop, '当前高度', calcWFData[showItemStart].translateY, showItemStart)
        return showItemStart
      }
      return findItem()
    }
    console.log('高度占比', scale)

    return findItem()
  }

  // 开启下拉加载
  startAutoLoad() {
    console.log('开启下拉加载')
    this.setState({
      loadType: 1
    }, () => {
      this.startScroll()
      this.getData()
    })
  }

  // 置顶按钮消隐
  toTopShowHide() {
    let self = this
    document.addEventListener('scroll', () => {
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
      // 置顶按钮消隐
      scrollTop > 300 !== self.state.toTop && (self.state.toTop = (scrollTop > 300))
      ReactDOM.render(<ToTop show={self.state.toTop}
        toTop={self.toTop.bind(self)}
      />, document.getElementById('btn-to-top'))
    })
  }

  // 子组件waterFallItemBlog事件

  // 打开BlogCover
  handleImg(index) {
    let itemData = this.state.waterFallData[index]
    // 指定浏览器内url
    let picUrl = this.props.folderId ? `/blog/detail/${itemData.postId || itemData.id}?folderId=${this.props.folderId}` : `/blog/detail/${itemData.postId || itemData.id}`
    let url = itemData.wfItemType === 'runway' ? `/show/img/detail/${itemData.id}` : picUrl
    let originalPath = this.props.originalPath || window.location.toString()

    if (this.props.trackMarker === 'brandImg') {
      base.eventCount.add('4033', {
        '图片ID': itemData.id
      })
    }

    if (itemData.platformId && this.props.pointContent) {
      this.props.pointContent.pic_type = itemData.platformId
    }

    this.burialPoint(2100001, itemData, index)
    console.log('itemData', itemData, this.props.pointContent)
    ReactDOM.render(<BlogCover wfType={this.state.wfType}
      columnWidth={this.state.columnWidth}
      hidden={false}
      handleAddFolder={this.handleAddFolder.bind(this)}
      getData={this.getData.bind(this)}
      outIndex={index}
      wfData={this.state.waterFallData}
      originalPath={originalPath}
      pointContent={this.props.pointContent}
    />, document.getElementById('blog-pop-wrapper'))
    window.history.pushState({
      blogId: itemData.id,
      outIndex: index,
      originalPath: window.location.toString()
    }, '', url)

    base.eventCount.add(1015, {
      '来源页面': wfTypeData[this.state.wfType].name,
      '图片Id': itemData.id,
      '图片位置': index,
      '用户ID': base.LS().id
    })

    // 搜索埋点
    if (this.props.userCount) {
      this.props.userCount('1020003', {
        preEvent: '搜索页面',
        content: '点击了搜索图片进入大图',
        type: '1',
        typeDesc: '搜索页面'
      })
    }
  }

  // 精选集操作选择
  handleSelect(index) {
    let _list = this.state.waterFallData
    let item = _list[index]

    if (item.select) {
      item.select = !item.select
    } else {
      item.select = true
    }
    // if(this.state.start > 0){
    //   _list.pop()
    // }
    // 通知到外层
    this.props.handleSelect(item.select ? 'add' : 'del', item.id)

    this.setState({
      waterFallData: _list
    })
  }

  handleSelectAll(action) {
    let self = this
    self._selectAll(action === 'all')
  }

  _selectAll(status) {
    let _list = this.state.waterFallData
    let _len = _list.length
    for (let i = 0; i < _len; i++) {
      let item = _list[i]

      // 非图片数据，跳出本次循环
      if (item.wfItemType !== 'runway' && item.wfItemType !== 'ins') {
        continue
      }
      item.select = status
    }
    this.setState({
      waterFallData: _list
    })
  }

  // 整理瀑布流数据，恢复正常状态
  handleCleanUp(status) {
    let _list = []
    let len = this.state.waterFallTotal

    // console.log(this.state.extraData);
    // this.props.extraData && _list.push(this.state.extraData);

    // console.log('_list', _list);
    for (let i = 0; i < len; i++) {
      let item = this.state.waterFallData[i]
      if (status === 'clean') {
        // 清除选中项
        !item.select && _list.push(item)
      } else {
        item.select = false
        _list.push(item)
      }
    }


    // 强制更新瀑布流数据
    this.state.waterFallData = _list
    this.state.waterFallTotal = _list.length

    // 节点数量变化，则重新计算布局
    if (len !== _list.length) {
      this._resetLayout(this.state.columnNum)
      this.calcWFItem(0, _list.length)
      this._calcShowItem()
    }

    this.setState({
      wfType: 'folder',
      statusFlag: _list.length === 0 ? 2 : 4,
    })

    _list.length === 0 && (this.refs.container.minHeight = '0')
  }

  burialPoint(code, data, index) {
    let { pointContent } = this.props
    let content = {}
    let flag = false
    content.index = !this.props.extraData ? index : index - 1
    switch (this.props.wfType) {
      case 'index':
      case 'followBlog':
      case 'classify':
      case 'recommendBlog':
      case 'ownerId':
      case 'blog':
        content.blogger_id = data.bloggerId
        break
      case 'folder':
      case 'folderShare':
        content.blogger_id = data.bloggerId
        content.album_id = base.getUrlStringId()
        break
      case 'runwayDetail':
        content.blogger_id = data.bloggerId
        content.show_id = data.showId
        break
      case 'orderMeeting':
      case 'brandImage':
        flag = true
        break
      default:
        break
    }

    content.pic_id = flag ? data.postId : data.id
    for (let key in pointContent) {
      content[key] = pointContent[key]
    }
    if (content.source_page === 'pic_detail') {
      let originalUrl = window.location.toString().split('/')
      content.source_pic_id = originalUrl[originalUrl.length - 1]
    }
    base.ajaxList.addPoint(code, content)
  }

  // 打开精选集管理
  handleSelectPop(index) {
    let _data = this.state.waterFallData[index]
    let mediaUrl = _data.mediaUrl
    let nickname = _data.nickname
    let wrapperEl = document.getElementById('select-pop-wrapper')
    let id = _data.id

    if (!!wrapperEl.innerHTML) {
      wrapperEl.innerHTML = ''
    }

    if (this.props.wfType === 'orderMeeting' || this.props.wfType === 'brandImage') {
      id = _data.postId
    }

    if (_data.platformId && this.props.pointContent) {
      this.props.pointContent.pic_type = _data.platformId
    }

    this.burialPoint(2100002, _data, index)

    if (this.props.wfType === 'runwayDetail') {
      base.eventCount.add('4043', {
        '图片ID': _data.id
      })
    } else if (this.props.wfType === 'index') {
      base.eventCount.add('1087', {
        '登录状态': !base.LS().userId ? '未登陆' : '已登陆',
        '图片ID': _data.id,
        '博主ID': _data.bloggerId
      })
    } else {
      base.eventCount.add('1017', {
        '来源页面': wfTypeData[this.state.wfType].name,
        '图片Id': _data.id,
        '图片位置': index
      })
    }

    ReactDOM.render(<SelectPop blogId={id}
      wfType={this.state.wfType}
      mediaUrl={mediaUrl}
      nickname={nickname}
      outIndex={index}
      handleAddFolder={this.handleAddFolder.bind(this)}
      hidden={false}
    />, wrapperEl)
  }

  // 加入精选
  handleAddFolder(index, folderId, favoriteId) {
    let _list = this.state.waterFallData
    _list[index].favoriteId = favoriteId
    // _list[index].favoriteCount++;
    let _resultCount = (this.props.folderId && (this.props.folderId * 1 === folderId * 1)) ? this.state.resultCount + 1 : this.state.resultCount
    this.setState({
      resultCount: _resultCount,
      waterFallData: _list
    })

    // 搜索埋点
    if (this.props.userCount) {
      this.props.userCount('1010006', {
        preEvent: '搜索页面',
        content: '直接精选了图片',
        type: '3',
        typeDesc: '进入搜索页面',
      })
    }
  }

  // 取消精选
  handleCancelFolder(index) {
    let _list = this.state.waterFallData
    _list.splice(index, 1)

    typeof this.props.subFolderNum === 'function' && this.props.subFolderNum('cancel', 1)

    // 强制更新瀑布流数据
    this.state.waterFallData = _list
    this.state.waterFallTotal = _list.length

    // 重新计算布局
    this._resetLayout(this.state.columnNum)
    this.calcWFItem(0, _list.length)

    this.setState({
      statusFlag: _list.length === 0 ? 2 : 4,
    })
  }

  // 单列动画优化
  executeSingleAni(start, colIndex, height) {
    let list = this.state.waterFallData
    // 跳过第一个
    start++
    for (; start < this.state.waterFallTotal; start++) {
      let item = list[start]
      let itemColIndex = item.colIndex

      if (itemColIndex !== colIndex) {
        console.log('跳出本次循环')
        continue
      }

      // 遇到非单列元素，停止修改之后的元素
      if (itemColIndex === -1) {
        console.log('跳出循环')
        break
      }

      // 同列元素修改pos
      item.translateY += height
    }

    // 更新列高
    this.layoutCalc.updateColHeight(colIndex, height)

    return list
  }

  // 更新单个模块的宽高
  updateSingleHeight(index, height) {
    let item = this.state.waterFallData[index]
    let list = this.executeSingleAni(index, item.colIndex, height)
    item.nodeHeight += height

    this.setState({
      waterFallData: list,
      waterFallTotal: list.length
    })
  }

  // 图片不喜欢
  handleDislike(index) {
    let _list = this.state.waterFallData
    let item = _list[index]
    item.dislike = true
    this.setState({
      waterFallData: _list
    })
  }

  // 上传图片成功
  uploadPicSuccess(num) {
    let { subFolderNum, renderWaterFall } = this.props

    subFolderNum && subFolderNum('upload', num)
    renderWaterFall && renderWaterFall()
  }

  handleUpload(id) {
    let upload = document.createElement('div')
    upload.id = 'upload'
    document.body.appendChild(upload)
    ReactDOM.render(<Upload id={id}
      renderWater={this.uploadPicSuccess.bind(this)}
    />, document.querySelector('#upload'))
  }

  // 订阅
  ajaxFan(index) {
    let self = this
    let _list = self.state.waterFallData
    let _item = _list[index]
    let {
      id,
      nickname,
      headImg,
      isVerified,
      followId: _isFa,
    } = _item
    let { followBlogger } = this.props
    let content = {}

    // 取消订阅
    if (_isFa !== 0) {
      base.ajaxList.unFollowOwner(_isFa, () => {
        _item.followId = 0
        self.setState({
          waterFallData: _list
        })
        
        self.props.changeFollowCount && self.props.changeFollowCount('del')
      })
      return
    }

    content.blogger_id = id
    for (let key in followBlogger) {
      content[key] = followBlogger[key]
    }
    base.ajaxList.addPoint(2300002, content)

    // 我的ins关注列表订阅
    if (self.state.wfType === 'insOwner' || self.state.wfType === 'popularity') {
      base.ajaxList.subscribeInsOwner(id, (d) => {
        _item.followId = d.result
        self.setState({
          waterFallData: _list
        })
        df_alert({
          tipImg: base.ossImg(headImg, 120),
          mainText: '成功订阅博主',
          subText: nickname
        })
        self.props.changeFollowCount && self.props.changeFollowCount('add')
        base.eventCount.add(1010, {
          '来源页面': '我的ins关注列表',
          '博主Id': id
        })
      })
      return
    }

    // 非库内博主订阅
    if (id.toString().length === 19) {
      base.ajaxList.subscribeOwner({ nickname, headImg, isVerified }, (d) => {
        _item.followId = d.result.followId
        _item.id = d.result.bloggerId
        _item.fetchStatus = true

        self.setState({
          waterFallData: _list
        })
        df_alert({
          tipImg: `${base.baseUrl}/owner/image?url=${headImg}`,
          mainText: '成功订阅博主',
          subText: nickname
        })
        switch (self.state.wfType) {
          case 'owner':
            base.eventCount.add(1010, {
              '来源页面': '搜索博主',
              '博主Id': id
            })
            break
          case 'followOwner':
            base.eventCount.add(1010, {
              '来源页面': '订阅列表',
              '博主Id': id
            })
            break
          default:
            break
        }
      })
      return
    }

    // 正常订阅
    base.ajaxList.followOwner(id, (d) => {
      _item.followId = d.result
      self.setState({
        waterFallData: _list
      })
      df_alert({
        tipImg: base.ossImg(headImg, 120),
        mainText: '成功订阅博主',
        subText: nickname
      })
      switch (self.state.wfType) {
        case 'owner':
          base.eventCount.add(1010, {
            '来源页面': '搜索博主',
            '博主Id': id
          })
          break
        case 'followOwner':
          base.eventCount.add(1010, {
            '来源页面': '订阅列表',
            '博主Id': id
          })
          self.props.changeFollowCount && self.props.changeFollowCount('add')
          break
        default:
          break
      }
    })
  }

  toTop() {
    // $('body,html').animate({scrollTop: '0px'}, 500);
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    this.state.scrollTop = 0
    this._calcShowItem()
  }


  // 重置瀑布流
  _reset(page = 0) {
    // 固定容器高度，避免置顶
    // let el = this.refs.container,
    //     _height = Math.floor(el.offsetHeight);
    // el.style.minHeight = _height + 'px';

    // console.log(this.state.wfType, wfTypeData[this.state.wfType].name)
    base.eventCount.add(1054, {
      '用户ID': base.LS().id,
      '来源页': wfTypeData[this.state.wfType].name,
    })

    this._resetLayout(this.state.columnNum)

    this.setState({
      statusFlag: 1,
      scrollTop: 0, // 滚动距离(事件绑在window上)
      page, // 当前页
      index: 0, // 已添加数量
      start: 0,
      waterFallData: [], // 瀑布流全部数据
      waterFallTotal: 0, // 数据总数
      waterFallDataCurrent: [],
      showItemStart: 0, // 显示节点开始位置
      showItemEnd: 0, // 显示节点开始位置
      isScroll: false, // 滚动加载开启状态
      scrollFlag: false, // 滚动事件处理状态
      historyEndFlag: false,
      _time: '', // 处理时间轴临时数据
    }, () => {
      this._initGetData()
    })
  }
  // 分类找图纠错
  cancelClassify(id) {
    const tmpWaterFallData = this.state.waterFallData
    tmpWaterFallData.map((item, index) => {
      console.log(item, index)
      if (item.id === id) {
        tmpWaterFallData.splice(index, 1)
      }
    })
    this.setState({statusFlag: tmpWaterFallData.length === 0 ? 2 : 4, waterFallData: tmpWaterFallData, waterFallTotal: tmpWaterFallData.length }, () => {
      this._resetLayout(this.state.columnNum)
      this.calcWFItem(0, tmpWaterFallData.length)
    })
  }
  // 渲染组装，单元块区分，时间线
  _renderWaterFallItem() {
    let self = this
    let _list = []
    let _length = self.state.waterFallData.length
    let _start = Math.min(self.state.showItemStart, _length)
    let _end = Math.min(self.state.showItemEnd, _length)
    console.log('组装单元', _start, _end)
    let mainProps = {
      wfType: self.state.wfType,
      // wfItemType: self.state.wfItemType,
      columnWidth: self.state.columnWidth
    }

    for (let i = _start; i < _end; i++) {
      let _data = self.state.waterFallData[i]
      let _id = (self.state.wfType === 'orderMeeting' || self.state.wfType === 'brandImage') ? _data.postId : _data.id
      let _key = `item_${_data.unique}`
      let selfProps = { key: _key, data: _data, }
      let handleProps = {
        handleClickImg: self.handleImg.bind(self, i, _id, _data),
        handleSelectPop: self.handleSelectPop.bind(self, i, _id),
      }

      // 增加外部索引
      mainProps.outIndex = i
      // 根据瀑布流单元块类型，选择相应组件
      switch (`${this.state.wfType}-${_data.wfItemType}`) {
        // 热门-ins 搜索图片
        case 'index-ins':
        case 'pinterest-ins':
          _list.push(<WFItemInsLike {...mainProps}
            {...selfProps}
            {...handleProps}
            handleDislike={self.handleDislike.bind(self, i)}
            isFolderBtn={self.state.isFolderBtn}
            seeBlogger={self.props.seeBlogger}
          />)
          break

        // 搜索页-ins、分类页-ins，外层订阅列表-ins，公开精选集
        case 'blog-ins':
        case 'classify-ins':
        case 'followBlog-ins':
        case 'recommendBlog-ins':
          _list.push(<WFItemIns {...mainProps}
            {...selfProps}
            {...handleProps}
            isFolderBtn={self.state.isFolderBtn}
            seeBlogger={this.props.seeBlogger}
            cancelClassify={this.cancelClassify.bind(this)}
          />)
          break

        // 自定义搜索模块
        case 'customSearch-ins':
          _list.push(<WFItemCustomSearch {...mainProps}
            {...selfProps}
            {...handleProps}
            isFolderBtn={self.state.isFolderBtn}
          />)
          break

        // 外层订阅列表-runway
        case 'followBlog-runway':
          _list.push(<WFItemRunwayBoard {...mainProps}
            {...selfProps}
          />)
          break

        // 精选集管理-ins
        case 'folder-ins':
        case 'folderShare-ins':
        case 'folderSelect-ins':
        case 'folderPublic-ins':
          _list.push(<WFItemInsFolder {...mainProps}
            {...selfProps}
            {...handleProps}
            showGalleryBtn={this.props.showGalleryBtn || false}
            handleClickSelect={self.handleSelect.bind(self, i)}
            handleCancelFolder={self.handleCancelFolder.bind(self, i)}
            isFolderBtn={self.state.isFolderBtn}
            isCancelFolder={self.state.isCancelFolder}
            folderId={self.props.folderId}
            pointContent={this.props.pointContent}
          />)
          break

        // 搜索页、精选集管理-runway
        case 'folder-runway':
        case 'folderShare-runway':
        case 'folderSelect-runway':
        case 'folderPublic-runway':
        case 'blog-runway':
          _list.push(<WFItemRunwayFolder {...mainProps}
            {...selfProps}
            {...handleProps}
            handleClickSelect={self.handleSelect.bind(self, i)}
            handleCancelFolder={self.handleCancelFolder.bind(self, i)}
            isFolderBtn={self.state.isFolderBtn}
            isCancelFolder={self.state.isCancelFolder}
            folderId={self.props.folderId}
          />)
          break

        // 我的订阅列表,搜索博主-ins／runway
        case 'owner-ins':
        case 'followOwner-ins':
          _list.push(<WFItemInsOwner ratiomInsOwner
            {...mainProps}
            {...selfProps}
            handleFan={self.ajaxFan.bind(self, i)}
            seeBlogger={self.props.seeBlogger}
          />)
          break
        case 'owner-runway':
        case 'followOwner-runway':
          _list.push(<WFItemRunwayOwner {...mainProps}
            {...selfProps}
            handleFan={self.ajaxFan.bind(self, i)}
          />)
          break
        // 人气top
        // 我的ins关注列表
        case 'popularity-ins':
        case 'insOwner-ins':
          _list.push(<WFItemInsOwnerSub {...mainProps}
            {...selfProps}
            handleFan={self.ajaxFan.bind(self, i)}
            getSizeFn={!i && self.props.getGuideDesign}
            seeBlogger={self.props.seeBlogger}
          />)
          break

        // 足迹-ins／runway
        case 'history-ins':
          _list.push(<WFItemInsHistory {...mainProps}
            {...selfProps}
            {...handleProps}
            isFolderBtn={self.state.isFolderBtn}
            isCancelFolder={self.state.isCancelFolder}
          />)
          break
        case 'history-runway':
          _list.push(<WFItemRunwayHistory {...mainProps}
            {...selfProps}
            {...handleProps}
            isFolderBtn={self.state.isFolderBtn}
            isCancelFolder={self.state.isCancelFolder}
          />)
          break

        // 博主详情页
        case 'ownerId-ins':
          _list.push(<WFItemIns2 {...mainProps}
            {...selfProps}
            {...handleProps}
            isFolderBtn={self.state.isFolderBtn}
            folderId={self.props.folderId}
          />)
          break

        // 秀场详情页
        case 'runwayDetail-runway':
        case 'runwaySelect-runway':
          _list.push(<WFItemRunway {...mainProps}
            {...selfProps}
            {...handleProps}
            handleClickSelect={self.handleSelect.bind(self, i)}
            isFolderBtn={self.state.isFolderBtn}
          />)
          break

        case 'runwayHomePage-runway':
          _list.push(<WFItemRunwayHome {...mainProps}
            {...selfProps}
            {...handleProps}
            isFolderBtn={self.state.isFolderBtn}
          />)
          break
        case 'brandShow-runway':
          _list.push(<WFItemBrand {...mainProps}
            {...selfProps}
            {...handleProps}
            isFolderBtn={self.state.isFolderBtn}
          />)
          break
        // 时间线
        case 'history-end':
          _list.push(<FootTimeLine {...selfProps} />)
          break
        case 'history-timeline':
        case 'followBlog-timeline':
          _list.push(<TimeLine {...selfProps}
            type={this.props.timeLine}
            today={self.state.todayTime}
          />)
          break

        // 订阅列表--个人信息
        case 'followBlog-userInfo':
          _list.push(<WFItemUserInfo {...selfProps}
            followBlogger={self.props.followBlogger}
          />)
          break

        // 订阅列表--个人信息
        case 'followBlog-recommendOwner':
          _list.push(<WFItemRecommendOwner {...selfProps}
            executeSingleAni={this.updateSingleHeight.bind(this)}
            recommendContent={self.props.recommendContent}
            followBlogger={self.props.followBlogger}
            seeBlogger={this.props.seeBlogger}
          />)
          break

        // 灵感页面--推荐位
        case 'index-banner':
          _list.push(<WFItemIndexBanner {...selfProps} />)
          break
        // 文章列表
        case 'article-article':
          _list.push(<Article {...selfProps} />)
          break

        // 订货会、品牌精选首页
        case 'orderFolder-ins':
        case 'brandSelected-ins':
          _list.push(<WFItemOrderFolder {...mainProps}
            {...selfProps}
          />)
          break
        // 订货会、品牌精选单图页
        case 'orderMeeting-ins':
        case 'brandImage-ins':
          _list.push(<WFItemOrderMeeting {...mainProps}
            {...selfProps}
            {...handleProps}
            isFolderBtn={self.state.isFolderBtn}
          />)
          break
        // 打开上传
        case 'folder-uploadPicture':
          _list.push(<WFItemUpload folderId={self.props.folderId}
            {...selfProps}
            handleUpload={this.handleUpload.bind(this)}
          />)
          break
        case 'collectPic-ins':
          _list.push(<WFItemCollectLike {...mainProps}
            {...selfProps}
            {...handleProps}
            pageType={this.props.pageType}
            handleDislike={self.handleDislike.bind(self, i)}
            isFolderBtn={self.state.isFolderBtn}
            seeBlogger={self.props.seeBlogger}
          />)
          break
        // 默认
        default:
          _list.push(<WFItemIns {...mainProps}
            {...selfProps}
            {...handleProps}
            isFolderBtn={self.state.isFolderBtn}
          />)
      }
    }

    // 组装完，修改布局插件计算布局数量
    self.state.msnryCount = _length

    return _list
  }

  // 选择渲染状态组件
  _renderWaterFallStatus() {
    // 单图推荐不显示状态
    // if (this.props.wfType === 'recommendBlog') {
    //   return null
    // }

    let html = ''
    switch (this.state.statusFlag) {
      case 1:
        html = <GetData />
        break
      case 2:
        html = (<NoResult wfType={this.state.wfType}
          noResultTip={this.props.noResultTip}
          columnNum={this.state.columnNum}
          q={this.state.queryData.q}
          followBlogger={this.props.followBlogger}
          seeBlogger={this.props.seeBlogger}
          // id={this.props.id}
          // handleUpload={this.handleUpload.bind(this)}
        />)
        break
      case 3:
        html = <Loading wfType={this.props.wfType} />
        break
      case 4:
        html = ''
        break
      case 5:
        html = !this.state.noBottom && <ToBottom wfType={this.state.wfType} />
        break
      case 6:
        break
      case -1:
      default:
        html = <div>系统异常，请刷新</div>
    }
    return html
  }

  // 渲染加载方式
  _renderLoadType() {
    // 无结果跳出
    if (this.state.statusFlag === 5 || this.state.statusFlag === 3) {
      return <div></div>
    }

    let html = null
    if (this.state.loadType === 2) {
      this.state.totalPage > 1 && (html = (<Pagination pageNo={this.state.page - 1}
        totalPage={this.state.totalPage}
        reset={this._reset.bind(this)}
      />))
    } else if (this.state.loadType === 3) {
      html = <LoadMore autoLoad={this.startAutoLoad.bind(this)} />
    }
    return html
  }

  // 单图推荐标题
  _renderRecommendTitle() {
    if (this.props.wfType !== 'recommendBlog'
      || this.state.statusFlag === 2
      || this.state.statusFlag === 1) {
      return null
    }
    return (<div className="water-fall-recommend-title"> 为你推荐</div>)
  }

  // 监听popstate
  _popState() {
    console.log('绑定popState')
    let self = this
    window.addEventListener('popstate', (e) => {
      // 处理锚点
      // let hash_status = base.hashManage.status;
      // if (hash_status) {
      //     let _order = base.hashManage._get().order;
      //     if (_order && _order != self.state.order) {
      //         self.setState({
      //             order: _order
      //         }, function () {
      //             this._reset();
      //         });
      //     }
      //     return;
      // }
      // 处理弹出层
      let blogWrapperEl = document.getElementById('blog-pop-wrapper')
      if (e.state && e.state.blogId) {
        ReactDOM.render(<BlogCover hidden={false}
          wfType={self.state.wfType}
          columnWidth={self.state.columnWidth}
          getData={self.getData.bind(self)}
          outIndex={e.state.outIndex}
          wfData={self.state.waterFallData}
          originalPath={e.state.originalPath}
        />, blogWrapperEl)
      } else {
        base.bodyScroll()
        blogWrapperEl.childElementCount !== 0
          && ReactDOM.render(<BlogCover hidden={true} />, blogWrapperEl)
      }
      ReactDOM.render(<SelectPop hidden={true} />, document.getElementById('select-pop-wrapper'))
      ReactDOM.render(<ReportPop hidden={true} />, document.getElementById('report-pop-wrapper'))
    })
  }

  // 视窗修改，resize
  resizeEvent(w) {
    // 宽度未改变
    if (this.state.initContainerWidth === w) {
      return
    }

    // 子元素为0
    if (this.state.waterFallData.length === 0) {
      return
    }

    if (this.state.resizeFlag) {
      return
    }

    this.state.resizeFlag = true
    let _columnNum = this._calcColumnNum(w)
    let currentColumnNum = this.state.columnNum

    // 列数不变，不更新
    if (_columnNum === currentColumnNum) {
      this.state.resizeFlag = false
      return
    }

    console.log('视窗resize')
    this.state.columnNum = _columnNum
    this.state.initContainerWidth = w
    this._resetLayout(_columnNum)

    this.calcWFItem(0, this.state.waterFallData.length)

    // 重新计算显示区间
    this._calcShowItem()

    this.state.resizeFlag = false
  }

  // 置顶
  renderToTop() {
    let toTopEl = document.getElementById('btn-to-top')
    let parentEl = document.getElementById('df-side-wrapper')

    if (!parentEl) {
      // 无节点则创建
      parentEl = document.createElement('div')
      parentEl.id = 'df-side-wrapper'
      document.getElementById('content').appendChild(parentEl)
    }

    // 置顶按钮已存在则跳出
    if (toTopEl) {
      return
    }

    toTopEl = document.createElement('div')

    let firstEl = parentEl.getElementsByClassName('btn')[0]
    toTopEl.id = 'btn-to-top'
    // 置顶按钮插在第一位
    if (firstEl) {
      parentEl.insertBefore(toTopEl, firstEl)
    } else {
      parentEl.appendChild(toTopEl)
    }
    ReactDOM.render(
      <ToTop show={this.state.toTop} toTop={this.toTop.bind(this)} />,
      document.getElementById('btn-to-top')
    )
  }

  render() {
    let column_html = this.state.statusFlag === 2 ? '' : this._renderWaterFallItem()
    let status_html = this._renderWaterFallStatus()
    let _containerStyle = this.state.wfHeight === 0 ?
      {} : { height: `${this.state.wfHeight}px` }
    return (
      <div className="water-fall-container">
        <div className="water-fall-tab">
          {this.state.showResultCount &&
            <div className="total-num-tab float-l">共{base.numberFormat(this.state.waterFallTotal)}枚</div>}
        </div>
        {this._renderRecommendTitle()}
        <div className="clearfix" />
        {this.state.statusFlag === 1 && status_html}
        <div id="container" ref="container" style={_containerStyle}>
          {column_html}
        </div>
        {this.state.statusFlag !== 1 && status_html}
        {this._renderLoadType()}
      </div>)
  }
}

export default WaterFall

