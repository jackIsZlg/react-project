import reducer from 'page/backend/marketing/info/info'
import im from 'immutable'

const getDefaultParams = () => {
  return {
    pageSize: 10,
    pageNum: 1,
    keyword: '',
    status: '-1'
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

describe('附加字段管理保存modal弹窗数据', async() => {
  it('保存数据，等待网络', async() => {
    const result = reducer(data, {
      type: 'missile/info/SAVE_PENDING'
    })
    expect(result.get('modal').get('loading')).toBe(true)
  })
  it('保存数据，被拒绝', async() => {
    const result = reducer(data, {
      type: 'missile/info/SAVE_REJECTED'
    })
    expect(result.get('modal').get('loading')).toBe(false)
  })
  it('保存数据，保存完成', async() => {
    const result = reducer(data, {
      type: 'missile/info/SAVE_FULFILLED'
    })
    expect(result.get('modal').get('loading')).toBe(false)
  })
})

describe('附加字段管理新增数据', async() => {
  it('新增数据，等待网络', async() => {
    const result = reducer(data, {
      type: 'missile/info/ADD_PENDING'
    })
    expect(result.get('modal').get('loading')).toBe(true)
  })
  it('新增数据，被拒绝', async() => {
    const result = reducer(data, {
      type: 'missile/info/ADD_REJECTED'
    })
    expect(result.get('modal').get('loading')).toBe(false)
  })
  it('新增数据，新增完成', async() => {
    const result = reducer(data, {
      type: 'missile/info/ADD_FULFILLED'
    })
    expect(result.get('modal').get('loading')).toBe(false)
  })
})

describe('附加字段管理启用禁用按钮', async() => {
  it('提交数据，等待网络', async() => {
    const result = reducer(data, {
      type: 'missile/info/CLOSE_PENDING'
    })
    expect(result.get('list').get('loading')).toBe(true)
  })
  it('提交数据，被拒绝', async() => {
    const result = reducer(data, {
      type: 'missile/info/CLOSE_REJECTED'
    })
    expect(result.get('list').get('loading')).toBe(false)
  })
  it('提交数据，保存完成', async() => {
    const result = reducer(data, {
      type: 'missile/info/CLOSE_FULFILLED'
    })
    expect(result.get('list').get('loading')).toBe(false)
  })
})

describe('附加字段管理modal弹窗', async() => {
  it('显示modal弹窗,修改数据弹窗', async() => {
    const currentRecord = {
      additionColumn: '支付模块',
      additionColumnValue: '金币商场,商场,阳光',
      additionColumnValueList: null,
      bizName: '信贷1',
      createdBy: 'admin',
      createdTime: 1508947200000,
      id: 23,
      isNeeded: '必选',
      isSingle: '单选',
      status: 0,
      updatedTime: 1508947200000
    }
    const payload = {
      currentRecord: currentRecord
    }
    const result = reducer(data, {
      type: 'missile/info/SHOW_MODAL',
      payload: payload
    })
    expect(result.get('modal').get('visible')).toBe(true)
    expect(result.get('modal').get('key')).toBe(1)
    expect(result.get('modal').get('currentRecord')).toEqual(im.fromJS(currentRecord))
  })
  it('关闭modal弹窗', async() => {
    const result = reducer(data, {
      type: 'missile/info/HIDE_MODAL'
    })
    expect(result.get('modal').get('visible')).toBe(false)
  })
})

describe('附加字段管理modal弹窗修改数据', async() => {
  it('修改数据弹窗', async() => {
    const currentRecord = [{
      additionColumn: '支付模块',
      additionColumnValue: '金币商场,商场,新用户',
      bizName: '信贷',
      createdBy: 'admin',
      createdTime: 1508947200000,
      id: 23,
      isNeeded: '必选',
      isSingle: '单选',
      status: 0,
      updatedTime: 1508947200000
    }]
    const payload = {
      currentRecord: currentRecord
    }
    const result = reducer(data, {
      type: 'missile/info/INPUTUPDATA',
      payload: payload
    })
    expect(result.get('modal').get('visible')).toBe(true)
    expect(result.get('modal').get('currentRecord')).toEqual(im.fromJS(currentRecord))
  })
})

describe('附加字段管理请求业务线数据', async() => {
  it('请求数据，等待网络', async() => {
    const result = reducer(data, {
      type: 'missile/info/QUERYBUSINESS_PENDING'
    })
    expect(result.get('modal').get('loading')).toBe(true)
  })
  it('请求数据，被拒绝', async() => {
    const result = reducer(data, {
      type: 'missile/info/QUERYBUSINESS_REJECTED'
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
      type: 'missile/info/QUERYBUSINESS_FULFILLED',
      payload: payload
    })
    expect(result.get('modal').get('businessDataSource')).toEqual(im.fromJS(payload))
    expect(result.get('modal').get('loading')).toBe(false)
  })
})

describe('附加字段管理请求列表数据', async() => {
  it('请求数据，等待网络', async() => {
    const params = undefined
    const payload = {
      params: params
    }
    const result = reducer(data, {
      type: 'missile/info/QUERY_PENDING',
      payload: payload
    })
    expect(result.get('list').get('loading')).toBe(true)
  })
  it('请求数据，被拒绝', async() => {
    const result = reducer(data, {
      type: 'missile/info/QUERY_REJECTED'
    })
    expect(result.get('list').get('loading')).toBe(false)
  })
  it('请求数据，请求成功', async() => {
    const payload = {
      pageNum: 1,
      pages: 1,
      result: [{
        additionColumn: '支付模块',
        additionColumnValue: '金币商场,商场,阳光',
        additionColumnValueList: null,
        bizName: '信贷',
        createdBy: 'admin',
        createdTime: 1508947200000,
        id: 23,
        isNeeded: '必选',
        isSingle: '单选',
        status: 0,
        updatedTime: 1508947200000
      }],
      totalCount: 1
    }
    const result = reducer(data, {
      type: 'missile/info/QUERY_FULFILLED',
      payload: payload
    })
    expect(result.get('list').get('dataSource')).toEqual(im.fromJS(payload))
    expect(result.get('list').get('loading')).toBe(false)
  })
})
