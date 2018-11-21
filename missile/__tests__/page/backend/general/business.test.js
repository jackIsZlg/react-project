import reducer from 'page/backend/general/business'
import im from 'immutable'

const getDefaultParams = () => {
  return {
    pageSize: 12,
    pageIndex: 1
  }
}

const data = im.fromJS({
  list: {
    loading: false,
    params: getDefaultParams(),
    defaultParams: getDefaultParams(),
    dataSource: [
      {
        bizName: '理财',
        createdTime: 1508860800000,
        id: 50,
        updatedTime: 1508860800000
      },
      {
        bizName: '信贷',
        createdTime: 1508860860000,
        id: 51,
        updatedTime: 1508860800090
      }
    ]
  },
  modal: {
    key: 0,
    visible: false,
    currentRecord: {},
    loading: false
  }
})

describe('业务线管理新增数据', async () => {
  it('新增数据，等待网络', async () => {
    const result = reducer(data, {
      type: 'missile/business/ADD_PENDING'
    })
    expect(result.get('modal').get('loading')).toBe(true)
  })
  it('新增数据，被拒绝', async () => {
    const result = reducer(data, {
      type: 'missile/business/ADD_REJECTED'
    })
    expect(result.get('modal').get('loading')).toBe(false)
  })
  it('新增数据，新增完成', async () => {
    const result = reducer(data, {
      type: 'missile/business/ADD_FULFILLED'
    })
    expect(result.get('modal').get('loading')).toBe(false)
  })
})

describe('业务线管理请求表格列表', async () => {
  it('请求数据，等待网络', async () => {
    const params = undefined
    const payload = {
      params: params
    }
    const result = reducer(data, {
      type: 'missile/business/QUERY_PENDING',
      payload: payload
    })
    expect(result.get('list').get('loading')).toBe(true)
    expect(result.get('list').get('params')).toEqual(data.get('list').get('params'))
  })
  it('请求数据，被拒绝', async () => {
    const result = reducer(data, {
      type: 'missile/business/QUERY_REJECTED'
    })
    expect(result.get('list').get('loading')).toBe(false)
  })
  it('请求数据，请求成功', async () => {
    const payload = [{
      bizName: '理财',
      createdTime: 1508860800000,
      id: 50,
      updatedTime: 1508860800000
    },
    {
      bizName: '信贷',
      createdTime: 1508860860000,
      id: 51,
      updatedTime: 1508860800090
    }]
    const result = reducer(data, {
      type: 'missile/business/QUERY_FULFILLED',
      payload: payload
    })
    expect(result.get('list').get('dataSource')).toEqual(im.fromJS(payload))
    expect(result.get('list').get('loading')).toBe(false)
  })
})

describe('业务线管理modal弹窗', async () => {
  it('显示modal弹窗,修改数据弹窗', async () => {
    const currentRecord = {
      bizName: '社区',
      createdTime: 1508860800000,
      id: 54,
      time: '2017-10-25 00:00:00',
      updatedTime: 1508860800000
    }
    const payload = {currentRecord: currentRecord}
    const result = reducer(data, {
      type: 'missile/business/SHOW_MODAL',
      payload: payload
    })
    expect(result.get('modal').get('visible')).toBe(true)
    expect(result.get('modal').get('key')).toBe(1)
    expect(result.get('modal').get('currentRecord')).toEqual(im.fromJS(currentRecord))
  })
  it('关闭modal弹窗', async () => {
    const result = reducer(data, {
      type: 'missile/business/HIDE_MODAL'
    })
    expect(result.get('modal').get('visible')).toBe(false)
  })
})

describe('业务线管理保存modal弹窗数据', async () => {
  it('保存数据，等待网络', async () => {
    const result = reducer(data, {
      type: 'missile/business/SAVE_PENDING'
    })
    expect(result.get('modal').get('loading')).toBe(true)
  })
  it('保存数据，被拒绝', async () => {
    const result = reducer(data, {
      type: 'missile/business/SAVE_REJECTED'
    })
    expect(result.get('modal').get('loading')).toBe(false)
  })
  it('保存数据，保存完成', async () => {
    const result = reducer(data, {
      type: 'missile/business/SAVE_FULFILLED'
    })
    expect(result.get('modal').get('loading')).toBe(false)
  })
})
