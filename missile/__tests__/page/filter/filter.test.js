import { fromJS } from 'immutable'
import * as types from 'page/filter/constant'
import reducer from 'page/filter/filter'
import createReducer from '../../common'
import { LOCATION_CHANGE } from 'react-router-redux'

const getDefaultParams = () => {
  return {
    pageSize: 15,
    pageIndex: 1
  }
}

const initial = fromJS({
  list: {
    loading: false,
    params: getDefaultParams(),
    defaultParams: getDefaultParams(),
    dataSource: []
  },
  add: {},
  detail: {
    loading: false,
    data: {}
  }
})

describe('用户筛选添加或编辑时检测SQL', () => {
  const action = {
    type: types.CHECK
  }
  const { pending, rejected, fulfilled } =
    createReducer(reducer, initial, action, 1)

  it('请求中', async () => {
    expect(pending.getIn(['add', 'validating'])).toBe(true)
  })
  it('失败', async () => {
    expect(rejected.getIn(['add', 'validating'])).toBe(false)
    expect(rejected.getIn(['add', 'validated'])).toBe(false)
  })
  it('成功', () => {
    expect(fulfilled.getIn(['add', 'validating'])).toBe(false)
    expect(fulfilled.getIn(['add', 'validated'])).toBe(true)
  })
})

describe('用户筛选获取列表', () => {
  it('请求中', () => {
    const action = {
      type: types.QUERY + '_PENDING',
      payload: {
        params: {
          pageNum: 2,
          search: '关键字'
        }
      }
    }
    const pending = createReducer(reducer, initial, action)
    const expected = initial.getIn(['list', 'params']).merge(action.payload.params)
    expect(pending.getIn(['list', 'loading'])).toBe(true)
    expect(pending.getIn(['list', 'params'])).toEqual(expected)
  })
  it('失败', () => {
    const action = {
      type: types.QUERY + '_REJECTED'
    }
    const rejected = createReducer(reducer, initial, action)
    expect(rejected.getIn(['list', 'loading'])).toBe(false)
  })
  it('成功', () => {
    const payload = {
      'totalCount': 3,
      'pageNum': 1,
      'result': [
        {
          'id': 24,
          'profileName': '用户画像2',
          'userConditionJson': null,
          'userConditionSql': "SELECT count(DISTINCT sA.uid) as TOTAL FROM  (SELECT DISTINCT st.uid FROM stat_fin.agg_fin_user_order_freq_current st WHERE 1 = 1 AND first_buy_time > '2017-10-22' AND uid is not null ) sA",
          'status': 1,
          'userAmount': 0,
          'profilePoint': 'UID',
          'profileType': '无参数画像',
          'createType': 'SQL创建',
          'createdBy': 'admin',
          'createdTime': 1509379200000,
          'updatedTime': 1509379200000
        }
      ],
      'pages': 1
    }
    const action = {
      type: types.QUERY + '_FULFILLED',
      payload
    }
    const fulfilled = createReducer(reducer, initial, action)
    expect(fulfilled.getIn(['list', 'loading'])).toBe(false)
    expect(fulfilled.getIn(['list', 'dataSource'])).toEqual(fromJS(action.payload))
  })
})

describe('用户筛选获取详情', () => {
  it('请求中', () => {
    const action = {
      type: types.DETAIL + '_PENDING'
    }
    const pending = createReducer(reducer, initial, action)
    expect(pending.getIn(['detail', 'loading'])).toBe(true)
  })
  it('失败', () => {
    const action = {
      type: types.DETAIL + '_REJECTED'
    }
    const rejected = createReducer(reducer, initial, action)
    expect(rejected.getIn(['detail', 'loading'])).toBe(false)
  })
  it('成功', () => {
    const payload = {
      'id': 22,
      'profileName': '用户画像11',
      'userConditionJson': null,
      'userConditionSql': "SELECT count(DISTINCT sA.uid) as TOTAL FROM  (SELECT DISTINCT st.uid FROM stat_fin.agg_fin_user_order_freq_current st WHERE 1 = 1 AND first_buy_time > '2017-10-22' AND uid is not null ) sA",
      'status': 0,
      'userAmount': 0,
      'profilePoint': 'UID',
      'profileType': '无参数画像',
      'createType': 'SQL创建',
      'createdBy': 'admin',
      'copyBy': null,
      'createdTime': 1509379200000,
      'updatedTime': 1509465600000
    }
    const action = {
      type: types.DETAIL + '_FULFILLED',
      payload
    }
    const fulfilled = createReducer(reducer, initial, action)
    expect(fulfilled.getIn(['detail', 'loading'])).toBe(false)
    expect(fulfilled.getIn(['detail', 'data'])).toEqual(fromJS(action.payload))
  })
})

describe('用户筛选添加', () => {
  const action = {
    type: types.ADD
  }
  const { pending, rejected, fulfilled } =
    createReducer(reducer, initial, action, 1)

  it('请求中', async () => {
    expect(pending.getIn(['add', 'loading'])).toBe(true)
  })
  it('失败', async () => {
    expect(rejected.getIn(['add', 'loading'])).toBe(false)
  })
  it('成功', () => {
    expect(fulfilled.getIn(['add', 'loading'])).toBe(false)
  })
})

describe('跳转清除', () => {
  const action = {
    type: LOCATION_CHANGE
  }
  const result = createReducer(reducer, initial, action)

  it('清除表单状态', async () => {
    expect(result.getIn(['add', 'validating'])).toBe(undefined)
    expect(result.getIn(['add', 'validated'])).toBe(undefined)
  })
  it('清除详情数据', async () => {
    expect(result.getIn(['detail', 'data'])).toEqual(fromJS({}))
    expect(result.getIn(['detail', 'loading'])).toBe(false)
  })
})
