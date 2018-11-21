import reducer from 'page/backend/filter/compare/compare'
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

describe('动态比较值管理保存modal弹窗数据', async() => {
  it('保存数据，等待网络', async() => {
    const result = reducer(data, {
      type: 'missile/compare/SAVE_PENDING'
    })
    expect(result.get('modal').get('loading')).toBe(true)
  })
  it('保存数据，被拒绝', async() => {
    const result = reducer(data, {
      type: 'missile/compare/SAVE_REJECTED'
    })
    expect(result.get('modal').get('loading')).toBe(false)
  })
  it('保存数据，保存完成', async() => {
    const result = reducer(data, {
      type: 'missile/compare/SAVE_FULFILLED'
    })
    expect(result.get('modal').get('loading')).toBe(false)
  })
})

describe('动态比较值管理添加数据', async() => {
  it('添加数据，等待网络', async() => {
    const result = reducer(data, {
      type: 'missile/compare/ADD_PENDING'
    })
    expect(result.get('modal').get('loading')).toBe(true)
  })
  it('添加数据，被拒绝', async() => {
    const result = reducer(data, {
      type: 'missile/compare/ADD_REJECTED'
    })
    expect(result.get('modal').get('loading')).toBe(false)
  })
  it('添加数据，保存完成', async() => {
    const result = reducer(data, {
      type: 'missile/compare/ADD_FULFILLED'
    })
    expect(result.get('modal').get('loading')).toBe(false)
  })
})

describe('动态比较值管理删除数据', async() => {
  it('删除数据，等待网络', async() => {
    const result = reducer(data, {
      type: 'missile/compare/REMOVE_PENDING'
    })
    expect(result.get('list').get('loading')).toBe(true)
  })
  it('删除数据，被拒绝', async() => {
    const result = reducer(data, {
      type: 'missile/compare/REMOVE_REJECTED'
    })
    expect(result.get('list').get('loading')).toBe(false)
  })
  it('删除数据，保存完成', async() => {
    const result = reducer(data, {
      type: 'missile/compare/REMOVE_FULFILLED'
    })
    expect(result.get('list').get('loading')).toBe(false)
  })
})

describe('动态比较值管理modal弹窗', async() => {
  it('显示modal弹窗,修改数据弹窗', async() => {
    const currentRecord = {
      createdTime: 1508860800000,
      id: 3,
      menu1: '时间2',
      menu2: '按日',
      menu3: '最近N日',
      updatedTime: 1508860800000
    }
    const payload = {
      currentRecord: currentRecord
    }
    const result = reducer(data, {
      type: 'missile/compare/SHOW_MODAL',
      payload: payload
    })
    expect(result.get('modal').get('visible')).toBe(true)
    expect(result.get('modal').get('key')).toBe(1)
    expect(result.get('modal').get('currentRecord')).toEqual(im.fromJS(currentRecord))
  })
  it('关闭modal弹窗', async() => {
    const result = reducer(data, {
      type: 'missile/compare/HIDE_MODAL'
    })
    expect(result.get('modal').get('visible')).toBe(false)
  })
})

describe('动态比较值管理请求列表数据', async() => {
  it('请求数据，等待网络', async() => {
    const params = undefined
    const payload = {
      params: params
    }
    const result = reducer(data, {
      type: 'missile/compare/QUERY_PENDING',
      payload: payload
    })
    expect(result.get('list').get('loading')).toBe(true)
  })
  it('请求数据，被拒绝', async() => {
    const result = reducer(data, {
      type: 'missile/compare/QUERY_REJECTED'
    })
    expect(result.get('list').get('loading')).toBe(false)
  })
  it('请求数据，请求成功', async() => {
    const payload = {
      pageNum: 1,
      pages: 1,
      result: [{
        createdTime: 1508860800000,
        id: 3,
        menu1: '时间2',
        menu2: '按日',
        menu3: '最近N日',
        updatedTime: 1508860800000
      }],
      totalCount: 1
    }
    const result = reducer(data, {
      type: 'missile/compare/QUERY_FULFILLED',
      payload: payload
    })
    expect(result.get('list').get('dataSource')).toEqual(im.fromJS(payload))
    expect(result.get('list').get('loading')).toBe(false)
  })
})
