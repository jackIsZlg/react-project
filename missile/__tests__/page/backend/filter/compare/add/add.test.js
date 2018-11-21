import reducer from 'page/backend/filter/compare/add/add'
import im from 'immutable'

const getDefaultParams = () => {
  return {
    menu: '时间2/按日/最近N日'
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

describe('动态比较值管理请求筛选指标列表数据', async() => {
  it('请求数据，等待网络', async() => {
    const params = {
      menu: 'test1/test2/test3'
    }
    const payload = {
      params: params
    }
    const result = reducer(data, {
      type: 'missile/compare/add/QUERY_PENDING',
      payload: payload
    })
    expect(result.get('list').get('loading')).toBe(true)
    expect(result.get('list').get('params')).toEqual(im.fromJS(params))
  })
  it('请求数据，被拒绝', async() => {
    const result = reducer(data, {
      type: 'missile/compare/add/QUERY_REJECTED'
    })
    expect(result.get('list').get('loading')).toBe(false)
  })
  it('请求数据，请求成功', async() => {
    const payload = [{
      compareElementColumnList: null,
      compareFormula: '3337111111111',
      compareName: '123',
      createdTime: 1511424737000,
      id: 18,
      menu: 'test1/test2/test3',
      replaceStr: 'value',
      updatedTime: 1511426324000
    }]
    const result = reducer(data, {
      type: 'missile/compare/add/QUERY_FULFILLED',
      payload: payload
    })
    expect(result.get('list').get('dataSource')).toEqual(im.fromJS(payload))
    expect(result.get('list').get('loading')).toBe(false)
  })
})
