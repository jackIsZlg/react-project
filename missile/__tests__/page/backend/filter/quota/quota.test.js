import reducer from 'page/backend/filter/quota/quota'
import im from 'immutable'

const getDefaultParams = () => {
  return {
    pageSize: 10,
    pageNum: 1,
    keyword: ''
  }
}

const data = im.fromJS({
  list: {
    loading: false,
    params: getDefaultParams(),
    defaultParams: getDefaultParams(),
    dataSource: []
  },
  modal: {
    key: 0,
    visible: false,
    currentRecord: {},
    loading: false
  }
})

describe('画像指标集管理保存modal弹窗数据', async() => {
  it('保存数据，等待网络', async() => {
    const result = reducer(data, {
      type: 'missile/quota/SAVE_PENDING'
    })
    expect(result.get('modal').get('loading')).toBe(true)
  })
  it('保存数据，被拒绝', async() => {
    const result = reducer(data, {
      type: 'missile/quota/SAVE_REJECTED'
    })
    expect(result.get('modal').get('loading')).toBe(false)
  })
  it('保存数据，保存完成', async() => {
    const result = reducer(data, {
      type: 'missile/quota/SAVE_FULFILLED'
    })
    expect(result.get('modal').get('loading')).toBe(false)
  })
})

describe('画像指标集管理添加数据', async() => {
  it('添加数据，等待网络', async() => {
    const result = reducer(data, {
      type: 'missile/quota/ADD_PENDING'
    })
    expect(result.get('modal').get('loading')).toBe(true)
  })
  it('添加数据，被拒绝', async() => {
    const result = reducer(data, {
      type: 'missile/quota/ADD_REJECTED'
    })
    expect(result.get('modal').get('loading')).toBe(false)
  })
  it('添加数据，保存完成', async() => {
    const result = reducer(data, {
      type: 'missile/quota/ADD_FULFILLED'
    })
    expect(result.get('modal').get('loading')).toBe(false)
  })
})

describe('画像指标集管理删除数据', async() => {
  it('删除数据，等待网络', async() => {
    const result = reducer(data, {
      type: 'missile/quota/REMOVE_PENDING'
    })
    expect(result.get('list').get('loading')).toBe(true)
  })
  it('删除数据，被拒绝', async() => {
    const result = reducer(data, {
      type: 'missile/quota/REMOVE_REJECTED'
    })
    expect(result.get('list').get('loading')).toBe(false)
  })
  it('删除数据，保存完成', async() => {
    const result = reducer(data, {
      type: 'missile/quota/REMOVE_FULFILLED'
    })
    expect(result.get('list').get('loading')).toBe(false)
  })
})

describe('画像指标集管理删除数据源数据', async() => {
  it('删除数据，等待网络', async() => {
    const result = reducer(data, {
      type: 'missile/quota/REMOVEDATA_PENDING'
    })
    expect(result.get('list').get('loading')).toBe(true)
  })
  it('删除数据，被拒绝', async() => {
    const result = reducer(data, {
      type: 'missile/quota/REMOVEDATA_REJECTED'
    })
    expect(result.get('list').get('loading')).toBe(false)
  })
  it('删除数据，保存完成', async() => {
    const result = reducer(data, {
      type: 'missile/quota/REMOVEDATA_FULFILLED'
    })
    expect(result.get('list').get('loading')).toBe(false)
  })
})

describe('画像指标集管理modal弹窗', async() => {
  it('显示modal弹窗,修改数据弹窗', async() => {
    const currentRecord = {
      bizName: '业务线-测试3',
      createdTime: 1511420808000,
      datasourceMetricNumList: [{
        count: 8,
        dataTable: 'agg_uv_product',
        databaseName: 'stat',
        dbId: 51,
        spreadDataSource: 'stat.agg_uv_product',
        tableId: 6566
      }],
      id: 28,
      menu1: '一级test1',
      menu2: '一级test1',
      updatedTime: 1511429342000
    }
    const payload = {
      currentRecord: currentRecord
    }
    const result = reducer(data, {
      type: 'missile/quota/SHOW_MODAL',
      payload: payload
    })
    expect(result.get('modal').get('visible')).toBe(true)
    expect(result.get('modal').get('key')).toBe(1)
    expect(result.get('modal').get('currentRecord')).toEqual(im.fromJS(currentRecord))
  })
  it('关闭modal弹窗', async() => {
    const result = reducer(data, {
      type: 'missile/quota/HIDE_MODAL'
    })
    expect(result.get('modal').get('visible')).toBe(false)
  })
})

describe('画像指标集管理请求业务线数据', async() => {
  it('请求数据，等待网络', async() => {
    const result = reducer(data, {
      type: 'missile/quota/QUERYBUSINESS_PENDING'
    })
    expect(result.get('modal').get('loading')).toBe(true)
  })
  it('请求数据，被拒绝', async() => {
    const result = reducer(data, {
      type: 'missile/quota/QUERYBUSINESS_REJECTED'
    })
    expect(result.get('modal').get('loading')).toBe(false)
  })
  it('请求数据，请求成功', async() => {
    const payload = [{
      bizName: '理财',
      createdTime: 1508860800000,
      id: 50,
      updatedTime: 1508860800000
    }]
    const result = reducer(data, {
      type: 'missile/quota/QUERYBUSINESS_FULFILLED',
      payload: payload
    })
    expect(result.get('modal').get('businessDataSource')).toEqual(im.fromJS(payload))
    expect(result.get('modal').get('loading')).toBe(false)
  })
})

describe('画像指标集管理请求列表数据', async() => {
  it('请求数据，等待网络', async() => {
    const params = undefined
    const payload = {
      params: params
    }
    const result = reducer(data, {
      type: 'missile/quota/QUERY_PENDING',
      payload: payload
    })
    expect(result.get('list').get('loading')).toBe(true)
  })
  it('请求数据，被拒绝', async() => {
    const result = reducer(data, {
      type: 'missile/quota/QUERY_REJECTED'
    })
    expect(result.get('list').get('loading')).toBe(false)
  })
  it('请求数据，请求成功', async() => {
    const payload = {
      pageNum: 1,
      pages: 1,
      result: [{
        bizName: '业务线-测试3',
        createdTime: 1511420808000,
        datasourceMetricNumList: [{
          count: 8,
          dataTable: 'agg_uv_product',
          databaseName: 'stat',
          dbId: 51,
          tableId: 6566
        }],
        id: 28,
        menu1: '一级test1',
        menu2: '一级test1',
        updatedTime: 1511429342000
      }],
      totalCount: 1
    }
    const result = reducer(data, {
      type: 'missile/quota/QUERY_FULFILLED',
      payload: payload
    })
    expect(result.get('list').get('dataSource')).toEqual(im.fromJS(payload))
    expect(result.get('list').get('loading')).toBe(false)
  })
})
