import reducer from 'page/backend/marketing/cost/cost'
import im from 'immutable'

const getDefaultParams = () => {
  return {
    pageSize: 10,
    pageNum: 1,
    keyword: '',
    status: '1'
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

describe('费用部门管理保存modal弹窗数据', async() => {
  it('保存数据，等待网络', async() => {
    const result = reducer(data, {
      type: 'missile/cost/SAVE_PENDING'
    })
    expect(result.get('modal').get('loading')).toBe(true)
  })
  it('保存数据，被拒绝', async() => {
    const result = reducer(data, {
      type: 'missile/cost/SAVE_REJECTED'
    })
    expect(result.get('modal').get('loading')).toBe(false)
  })
  it('保存数据，保存完成', async() => {
    const result = reducer(data, {
      type: 'missile/cost/SAVE_FULFILLED'
    })
    expect(result.get('modal').get('loading')).toBe(false)
  })
})

describe('费用部门管理启用禁用按钮', async() => {
  it('提交数据，等待网络', async() => {
    const result = reducer(data, {
      type: 'missile/cost/CLOSE_PENDING'
    })
    expect(result.get('list').get('loading')).toBe(true)
  })
  it('提交数据，被拒绝', async() => {
    const result = reducer(data, {
      type: 'missile/cost/CLOSE_REJECTED'
    })
    expect(result.get('list').get('loading')).toBe(false)
  })
  it('提交数据，保存完成', async() => {
    const result = reducer(data, {
      type: 'missile/cost/CLOSE_FULFILLED'
    })
    expect(result.get('list').get('loading')).toBe(false)
  })
})

describe('费用部门管理modal弹窗', async() => {
  it('显示modal弹窗,修改数据弹窗', async() => {
    const currentRecord = {
      costCenter1: '富数',
      costCenter2: '富数-研发',
      costCenterCode: '71999999',
      costCenterName: '富数-研发部-研发部-研发部0',
      createdTime: 1508860800000,
      id: 14,
      status: 0,
      updatedTime: 1508860800000
    }
    const payload = {
      currentRecord: currentRecord
    }
    const result = reducer(data, {
      type: 'missile/cost/SHOW_MODAL',
      payload: payload
    })
    expect(result.get('modal').get('visible')).toBe(true)
    expect(result.get('modal').get('key')).toBe(1)
    expect(result.get('modal').get('currentRecord')).toEqual(im.fromJS(currentRecord))
  })
  it('关闭modal弹窗', async() => {
    const result = reducer(data, {
      type: 'missile/cost/HIDE_MODAL'
    })
    expect(result.get('modal').get('visible')).toBe(false)
  })
})

describe('费用部门管理请求列表数据', async() => {
  it('保存数据，等待网络', async() => {
    const params = undefined
    const payload = {
      params: params
    }
    const result = reducer(data, {
      type: 'missile/cost/QUERY_PENDING',
      payload: payload
    })
    expect(result.get('list').get('params')).toEqual(data.get('list').get('params'))
  })
  it('请求数据，被拒绝', async() => {
    const result = reducer(data, {
      type: 'missile/cost/QUERY_REJECTED'
    })
    expect(result.get('list').get('loading')).toBe(false)
  })
  it('请求数据，请求成功', async() => {
    const payload = {
      pageNum: 1,
      pages: 1,
      result: [{
        costCenter1: '社区',
        costCenter2: '社区-研发',
        costCenterCode: '91999999',
        costCenterName: '社区-研发部-研发部-研发部',
        createdTime: 1508860800000,
        id: 10,
        status: 0,
        updatedTime: 1508860800000
      }],
      totalCount: 1
    }
    const result = reducer(data, {
      type: 'missile/cost/QUERY_FULFILLED',
      payload: payload
    })
    expect(result.get('list').get('dataSource')).toEqual(im.fromJS(payload))
    expect(result.get('list').get('loading')).toBe(false)
  })
})
