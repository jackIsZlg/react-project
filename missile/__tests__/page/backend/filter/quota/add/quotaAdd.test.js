import reducer from 'page/backend/filter/quota/add/quotaAdd'
import im from 'immutable'

const getDefaultParam = () => {
  return {
    dbId: ''
  }
}
const data = im.fromJS({
  list: {
    loading: false,
    params: getDefaultParam(),
    defaultParams: getDefaultParam(),
    dataBaseList: [],
    dbIdList: [],
    tableIdList: {},
    appendCondition: ''
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
      type: 'missile/quota/add/SAVA_PENDING'
    })
    expect(result.get('list').get('loading')).toBe(true)
  })
  it('保存数据，被拒绝', async() => {
    const result = reducer(data, {
      type: 'missile/quota/add/SAVA_REJECTED'
    })
    expect(result.get('list').get('loading')).toBe(false)
  })
  it('保存数据，保存完成', async() => {
    const result = reducer(data, {
      type: 'missile/quota/add/SAVA_FULFILLED'
    })
    expect(result.get('list').get('loading')).toBe(false)
  })
})

describe('画像指标集管理请求数据库数据', async() => {
  it('请求数据，等待网络', async() => {
    const params = undefined
    const payload = {
      params: params
    }
    const result = reducer(data, {
      type: 'missile/quota/add/QUERYDATABASE_PENDING',
      payload: payload
    })
    expect(result.get('list').get('loading')).toBe(true)
  })
  it('请求数据，被拒绝', async() => {
    const result = reducer(data, {
      type: 'missile/quota/add/QUERYDATABASE_REJECTED'
    })
    expect(result.get('list').get('loading')).toBe(false)
  })
  it('请求数据，请求成功', async() => {
    const payload = {
      default: 6,
      dm: 2,
      stat: 51,
      stat_fin: 33,
      stat_loan: 34
    }
    const result = reducer(data, {
      type: 'missile/quota/add/QUERYDATABASE_FULFILLED',
      payload: payload
    })
    expect(result.get('list').get('dataBaseList')).toEqual(im.fromJS(payload))
    expect(result.get('list').get('loading')).toBe(false)
  })
})

describe('画像指标集管理请求数据表数据', async() => {
  it('请求数据，等待网络', async() => {
    const params = {
      dbId: 34
    }
    const payload = {
      params: params
    }
    const result = reducer(data, {
      type: 'missile/quota/add/QUERYDBID_PENDING',
      payload: payload
    })
    expect(result.get('list').get('loading')).toBe(true)
    expect(result.get('list').get('params')).toEqual(im.fromJS(params))
  })
  it('请求数据，被拒绝', async() => {
    const result = reducer(data, {
      type: 'missile/quota/add/QUERYDBID_REJECTED'
    })
    expect(result.get('list').get('loading')).toBe(false)
  })
  it('请求数据，请求成功', async() => {
    const payload = [{
      definition: '理财-支付统计表',
      tableId: 5123,
      tableName: 'agg_fin_pay'
    }]
    const result = reducer(data, {
      type: 'missile/quota/add/QUERYDBID_FULFILLED',
      payload: payload
    })
    expect(result.get('list').get('dbIdList')).toEqual(im.fromJS(payload))
    expect(result.get('list').get('loading')).toBe(false)
  })
})

describe('画像指标集管理请求画像指标数据', async() => {
  it('请求数据，等待网络', async() => {
    const params = {
      bizName: '业务线-测试3',
      menu: '一级test1/一级test1',
      tableId: 11898
    }
    const newParams = {
      dbId: '',
      bizName: '业务线-测试3',
      menu: '一级test1/一级test1',
      tableId: 11898
    }
    const payload = {
      params: params
    }
    const result = reducer(data, {
      type: 'missile/quota/add/QUERYTABLEID_PENDING',
      payload: payload
    })
    expect(result.get('list').get('loading')).toBe(true)
    expect(result.get('list').get('params')).toEqual(im.fromJS(newParams))
  })
  it('请求数据，被拒绝', async() => {
    const result = reducer(data, {
      type: 'missile/quota/add/QUERYTABLEID_REJECTED'
    })
    expect(result.get('list').get('loading')).toBe(false)
  })
  it('请求数据，请求成功', async() => {
    const payload = {
      appendCondition: '',
      dataColumnMetaList: [{
        columnChineseName: '投放渠道参数',
        columnId: 77074,
        columnName: 'a_f',
        comment: '',
        isCondition: 0,
        isMetric: 0
      }]
    }
    const result = reducer(data, {
      type: 'missile/quota/add/QUERYTABLEID_FULFILLED',
      payload: payload
    })
    expect(result.get('list').get('tableIdList')).toEqual(im.fromJS(payload))
    expect(result.get('list').get('loading')).toBe(false)
  })
})

describe('画像指标集管理请求画像指标数据更新', async() => {
  it('请求数据，请求成功', async() => {
    const tableListData = [{
      columnChineseName: '投放渠道参数',
      columnId: 77074,
      columnName: 'a_f',
      comment: '',
      isCondition: 0,
      isMetric: 0
    }]
    const result = reducer(data, {
      type: 'missile/quota/add/UPDATATABLELIST',
      tableListData: tableListData
    })
    expect(result.get('list').get('loading')).toBe(false)
    expect(result.get('list').get('tableIdList').get('dataColumnMetaList')).toEqual(im.fromJS(tableListData))
  })
})

describe('画像指标集管理请求画像指标数据过滤更新', async() => {
  it('请求数据，请求成功', async() => {
    const appendCondition = 'text'
    const result = reducer(data, {
      type: 'missile/quota/add/UPDATAAC',
      appendCondition: appendCondition
    })
    expect(result.get('list').get('loading')).toBe(false)
    expect(result.get('list').get('tableIdList').get('appendCondition')).toEqual(im.fromJS(appendCondition))
  })
})
