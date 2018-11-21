import { fromJS } from 'immutable'
import * as types from 'page/marketing/constant'
import reducer from 'page/marketing/reducer'
import createReducer from '../../common'

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
  detail: {
    loading: false,
    data: {}
  }
})

describe('营销活动-获取列表', () => {
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
      'totalCount': 1,
      'pageNum': 1,
      'result': [
        {
          'activityBaseInfo': {
            'id': 1,
            'activityTheme': 'app周年庆',
            'bizName': '理财',
            'beginTime': 1507910400000,
            'endTime': 1509379200000,
            'isAlways': 0,
            'isDelete': 0,
            'status': null,
            'auditTime': 1508083200000,
            'isAudit': 1,
            'activityType': 1,
            'costCenter': '理财',
            'costBudget': 100000,
            'activityBackground': '活动背景',
            'createdBy': null,
            'activityGoal': '促销',
            'relatedActivity': '哈哈',
            'attachmentPath': '*',
            'createdTime': 1508688000000,
            'updatedTime': 1508688000000
          },
          'userGroupInfoList': [
            {
              'userGroupId': 15,
              'userGroupName': '用户组1',
              'profileOrRuleName': null,
              'filterType': '筛选画像',
              'updateType': null,
              'percentage': null,
              'predictAmount': null,
              'userAmount': null,
              'updatedTime': null
            }
          ]
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

describe('营销活动-获取详情', () => {
  const action = {
    type: types.QUERY_DETAIL,
    payload: {
      'activityBaseInfo': {
        'id': 1,
        'activityTheme': 'app周年庆',
        'bizName': '理财',
        'beginTime': 1507910400000,
        'endTime': 1509379200000,
        'isAlways': 0,
        'isDelete': 0,
        'status': null,
        'auditTime': 1508083200000,
        'isAudit': 1,
        'activityType': 1,
        'costCenter': '理财',
        'costBudget': 100000,
        'activityBackground': '活动背景',
        'createdBy': null,
        'activityGoal': '促销',
        'relatedActivity': '哈哈',
        'attachmentPath': '*',
        'createdTime': 1508688000000,
        'updatedTime': 1508688000000
      },
      'userGroupInfoList': [
        {
          'userGroupId': 15,
          'userGroupName': '用户组1',
          'profileOrRuleName': null,
          'filterType': '筛选画像',
          'updateType': null,
          'percentage': null,
          'predictAmount': null,
          'userAmount': null,
          'updatedTime': null
        }
      ]
    }
  }
  const { pending, rejected, fulfilled } =
    createReducer(reducer, initial, action, 1)

  it('请求中', async () => {
    expect(pending.getIn(['detail', 'loading'])).toBe(true)
  })
  it('失败', async () => {
    expect(rejected.getIn(['detail', 'loading'])).toBe(false)
  })
  it('成功', () => {
    expect(fulfilled.getIn(['detail', 'loading'])).toBe(false)
    expect(fulfilled.getIn(['detail', 'data'])).toEqual(fromJS(action.payload))
  })
})
